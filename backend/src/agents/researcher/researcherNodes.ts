import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { v4 as uuidv4 } from "uuid";
import { getLLM } from "../../utils/llmFactory";
import { ProblemAnalysis, Source, DiscoveredSolution } from "../../graph/state";
import {
  QUERY_GEN_SYSTEM_PROMPT,
  QUERY_GEN_FEW_SHOT,
  QueryGenOutputSchema,
  QueryGenOutput,
} from "../../prompts/researcherQueryGen";
import {
  CLASSIFIER_SYSTEM_PROMPT,
  ClassifierOutputSchema,
  ClassifierOutput,
} from "../../prompts/candidateClassifier";
import {
  ENRICHMENT_QUERY_SYSTEM_PROMPT,
  EnrichmentQueryOutputSchema,
  EnrichmentQueryOutput,
} from "../../prompts/enrichmentQueryGen";
import {
  FIELD_EXTRACTOR_SYSTEM_PROMPT,
  FIELD_EXTRACTOR_FEW_SHOT,
} from "../../prompts/fieldExtractor";
import {
  CONTRADICTION_DETECTOR_SYSTEM_PROMPT,
  ContradictionOutputSchema,
} from "../../prompts/contradictionDetector";
import { executeDualSearch } from "../../services/webResearchService";
import {
  deduplicateSources,
  buildCandidateEntities,
} from "../../services/solutionDeduplicator";
import { rankCandidates, CandidateForRanking } from "../../services/candidateRanker";
import { mergeSolutionEvidence } from "../../services/evidenceMerger";
import { githubSearchRepositoriesTool } from "../../tools/github/githubTools";
import { emitEvent } from "../../utils/sseStreamer";
import {
  Contradiction,
  DiscoveredSolutionSchema,
} from "../../graph/state";
import { getConfig } from "../../config/env";
import { getResearchBudget, ResearchMode, CONCURRENCY } from "../../config/research.config";
import { addUsageMetrics } from "../../models/HackathonProject.model";

import { z } from "zod";

export interface ResearchPlan {
  researchDimensions: string[];
  queryCategories: string[];
  maxRounds: number;
  priorityKeywords: string[];
}

export async function buildResearchPlan(
  problemAnalysis: ProblemAnalysis,
  projectId: string
): Promise<ResearchPlan> {
  emitEvent(projectId, "researcher", "research_plan_built", "Building research plan");

  const dimensions: string[] = [];

  // Direct problem dimension
  dimensions.push("direct_problem");

  // Target user dimension
  if (problemAnalysis.targetUsers.length > 0) {
    dimensions.push("target_user");
  }

  // Commercial products dimension
  dimensions.push("commercial_product");

  // Startup dimension
  dimensions.push("startup");

  // GitHub open source dimension
  dimensions.push("github_open_source");

  // Hackathon projects dimension
  dimensions.push("hackathon_project");

  // Technical approaches dimension
  if (problemAnalysis.mechanisms.length > 0) {
    dimensions.push("technical_approach");
  }

  // Adjacent domains
  dimensions.push("adjacent_domain");

  const queryCategories = [
    "direct_problem",
    "target_user",
    "commercial_product",
    "startup",
    "github_open_source",
    "hackathon_project",
    "technical_approach",
    "adjacent_domain",
  ];

  const priorityKeywords = [
    ...problemAnalysis.domainKeywords,
    ...problemAnalysis.synonyms,
  ].slice(0, 10);

  return {
    researchDimensions: dimensions,
    queryCategories,
    maxRounds: 3,
    priorityKeywords,
  };
}

const MAX_RETRIES = 2;

function buildRepairPrompt(rawResponse: string, errors: string[]): string {
  return `
YOUR PREVIOUS RESPONSE FAILED SCHEMA VALIDATION.

VALIDATION ERRORS:
${errors.join("\n")}

PREVIOUS RESPONSE:
${rawResponse}

INSTRUCTIONS:
Fix the JSON payload to resolve ALL listed validation errors. Return ONLY valid JSON matching the schema. No markdown, no code fences.`;
}

async function callLLMWithRetry<T>(
  systemPrompt: string,
  userPrompt: string,
  schema: any,
  schemaName: string
): Promise<{ success: true; data: T } | { success: false; error: string }> {
  const model = getLLM("research");

  const structuredModel = model.withStructuredOutput(schema, {
    name: schemaName,
  });

  let lastError = "";

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      let prompt = userPrompt;
      if (attempt > 0) {
        prompt = buildRepairPrompt(userPrompt, [lastError]);
      }

      const result = (await structuredModel.invoke([
        new SystemMessage(systemPrompt),
        new HumanMessage(prompt),
      ])) as any;

      return { success: true, data: result as T };
    } catch (err) {
      lastError = err instanceof Error ? err.message : "LLM call failed";
    }
  }

  return { success: false, error: lastError };
}

// ============================================================
// NODE: Generate Discovery Queries
// ============================================================
export async function generateDiscoveryQueries(
  problemAnalysis: ProblemAnalysis,
  projectId: string,
  round: number
): Promise<{ queries: QueryGenOutput["queries"] }> {
  emitEvent(projectId, "researcher", "discovery_queries_generated", `Generating discovery queries (round ${round})`);

  const userPrompt = `ProblemAnalysis:
${JSON.stringify(problemAnalysis, null, 2)}

Generate discovery queries for round ${round}. Focus on uncovered research dimensions.`;

  const result = await callLLMWithRetry<QueryGenOutput>(
    QUERY_GEN_SYSTEM_PROMPT + "\n\n" + QUERY_GEN_FEW_SHOT,
    userPrompt,
    QueryGenOutputSchema,
    "DiscoveryQueries"
  );

  if (result.success) {
    addUsageMetrics(projectId, { geminiCalls: 1, llmTokens: 500 }).catch(() => {});
    return { queries: result.data.queries };
  }

  // Fallback: generate basic queries from keywords
  const fallbackQueries = generateFallbackQueries(problemAnalysis);
  return { queries: fallbackQueries };
}

function generateFallbackQueries(analysis: ProblemAnalysis) {
  const queries: QueryGenOutput["queries"] = [];
  const keywords = analysis.domainKeywords.slice(0, 4);
  const users = analysis.targetUsers.slice(0, 2);

  for (const kw of keywords) {
    queries.push({
      id: `fallback_q${queries.length + 1}`,
      query: kw,
      category: "direct_problem",
      targetProviders: ["gemini", "tavily"],
      rationale: `Direct keyword search for ${kw}`,
    });
  }

  for (const u of users) {
    queries.push({
      id: `fallback_q${queries.length + 1}`,
      query: `${u.role} ${analysis.domainKeywords[0] || ""} tool software`,
      category: "target_user",
      targetProviders: ["gemini", "tavily"],
      rationale: `User-focused search for ${u.role}`,
    });
  }

  queries.push({
    id: `fallback_q${queries.length + 1}`,
    query: `${analysis.domainKeywords[0] || ""} github open source`,
    category: "github_open_source",
    targetProviders: ["github"],
    rationale: "GitHub repository search",
  });

  queries.push({
    id: `fallback_q${queries.length + 1}`,
    query: `${analysis.domainKeywords[0] || ""} hackathon project`,
    category: "hackathon_project",
    targetProviders: ["gemini", "tavily"],
    rationale: "Hackathon project search",
  });

  return queries.slice(0, 10);
}

// ============================================================
// NODE: Run Dual Web Search
// ============================================================
export async function runDualWebSearch(
  queries: Array<{ id: string; query: string; targetProviders: string[] }>,
  projectId: string
): Promise<{ sources: Source[]; geminiCalls: number; tavilyCalls: number }> {
  emitEvent(projectId, "researcher", "dual_search_executing", `Executing dual search for ${queries.length} queries`);

  const allSources: Source[] = [];
  let geminiCalls = 0;
  let tavilyCalls = 0;

  // Execute queries with bounded concurrency
  const chunks: typeof queries[] = [];
  for (let i = 0; i < queries.length; i += CONCURRENCY.SEARCH_CONCURRENCY) {
    chunks.push(queries.slice(i, i + CONCURRENCY.SEARCH_CONCURRENCY));
  }

  for (const chunk of chunks) {
    const results = await Promise.allSettled(
      chunk.map((q) => executeDualSearch(q.query, "web", projectId))
    );

    for (const r of results) {
      if (r.status === "fulfilled") {
        allSources.push(...r.value.mergedSources);
        if (!r.value.geminiFailed) geminiCalls++;
        if (!r.value.tavilyFailed) tavilyCalls++;
      }
    }
  }

  return { sources: allSources, geminiCalls, tavilyCalls };
}

// ============================================================
// NODE: Run GitHub Search
// ============================================================
export async function runGitHubSearch(
  queries: Array<{ query: string }>,
  projectId: string
): Promise<{ sources: Source[]; searchCalls: number }> {
  emitEvent(projectId, "researcher", "github_search_executing", `Searching GitHub for ${queries.length} queries`);

  const allSources: Source[] = [];
  let searchCalls = 0;

  for (const q of queries.slice(0, 5)) {
    try {
      const result = await githubSearchRepositoriesTool.invoke({
        query: q.query,
        perPage: 10,
      });
      const parsed = JSON.parse(result);
      searchCalls++;

      if (parsed.success && parsed.results) {
        for (const repo of parsed.results) {
          allSources.push({
            id: `src_gh_${uuidv4().substring(0, 8)}`,
            title: repo.fullName || repo.name,
            url: repo.url || `https://github.com/${repo.fullName}`,
            canonicalUrl: repo.url || `https://github.com/${repo.fullName}`,
            domain: "github.com",
            sourceType: "github",
            discoveredBy: ["github"],
            searchQueryIds: [],
            snippet: repo.description || "",
            retrievedAt: new Date().toISOString(),
            relevanceScore: Math.min((repo.stars || 0) / 100, 1.0),
            authorityScore: 0.85,
            extractionStatus: "success",
            metadata: {
              stars: repo.stars,
              forks: repo.forks,
              language: repo.language,
              topics: repo.topics,
            },
          });
        }
      }
    } catch (err) {
      console.error(`[runGitHubSearch] Failed for query "${q.query}":`, err);
      // Skip failed GitHub searches
    }
  }

  return { sources: allSources, searchCalls };
}

// ============================================================
// NODE: Classify Candidates
// ============================================================
export async function classifyCandidates(
  sources: Source[],
  problemAnalysis: ProblemAnalysis,
  projectId: string
): Promise<{ classified: Source[] }> {
  if (sources.length === 0) return { classified: [] };

  emitEvent(projectId, "researcher", "candidates_classifying", `Classifying ${sources.length} candidates`);

  // Group sources by domain for classification
  const sourceData = sources.map((s) => ({
    url: s.url,
    title: s.title,
    snippet: s.snippet || "",
    domain: s.domain,
    sourceType: s.sourceType,
  }));

  const userPrompt = `Core Problem: ${problemAnalysis.coreProblem}
Target Users: ${problemAnalysis.targetUsers.map((u) => u.role).join(", ")}

Sources to classify:
${JSON.stringify(sourceData.slice(0, 30), null, 2)}`;

  const result = await callLLMWithRetry<ClassifierOutput>(
    CLASSIFIER_SYSTEM_PROMPT,
    userPrompt,
    ClassifierOutputSchema,
    "CandidateClassifier"
  );

  if (result.success) {
    // Apply classifications to sources
    const classificationMap = new Map(
      result.data.classifications.map((c) => [c.url, c])
    );

    const classified = sources
      .map((s) => {
        const c = classificationMap.get(s.url);
        if (c) {
          return {
            ...s,
            relevanceScore: c.confidence,
            metadata: {
              ...s.metadata,
              classification: c.classification,
              reasoning: c.reasoning,
            },
          };
        }
        return s;
      })
      .filter((s) => {
        const classification = s.metadata?.classification;
        return classification !== "irrelevant";
      });

    return { classified };
  }

  // Fallback: keep all sources
  return { classified: sources };
}

// ============================================================
// NODE: Detect Missing Fields & Generate Enrichment Queries
// ============================================================
export function detectMissingFields(
  solution: DiscoveredSolution
): string[] {
  const missing: string[] = [];

  if (!solution.features || solution.features.length === 0)
    missing.push("features");
  if (!solution.workflow || solution.workflow.length === 0)
    missing.push("workflow");
  if (!solution.targetUsers || solution.targetUsers.length === 0)
    missing.push("targetUsers");
  if (!solution.technologies || solution.technologies.length === 0)
    missing.push("technologies");
  if (!solution.inputs || solution.inputs.length === 0)
    missing.push("inputs");
  if (!solution.outputs || solution.outputs.length === 0)
    missing.push("outputs");
  if (!solution.limitations || solution.limitations.length === 0)
    missing.push("limitations");
  if (!solution.approach || solution.approach.length < 5)
    missing.push("approach");

  return missing;
}

export async function generateEnrichmentQueries(
  solution: DiscoveredSolution,
  missingFields: string[],
  projectId: string
): Promise<EnrichmentQueryOutput> {
  const userPrompt = `Candidate: ${solution.name}
Current populated fields:
- description: ${solution.description ? "yes" : "missing"}
- features: ${solution.features?.length || 0} items
- workflow: ${solution.workflow?.length || 0} items
- technologies: ${solution.technologies?.length || 0} items
- targetUsers: ${solution.targetUsers?.length || 0} items
- limitations: ${solution.limitations?.length || 0} items

Missing priority fields: ${missingFields.join(", ")}

Generate targeted queries to fill these missing fields.`;

  const result = await callLLMWithRetry<EnrichmentQueryOutput>(
    ENRICHMENT_QUERY_SYSTEM_PROMPT,
    userPrompt,
    EnrichmentQueryOutputSchema,
    "EnrichmentQueries"
  );

  if (result.success) {
    return result.data;
  }

  // Fallback: generate basic queries
  return {
    candidateId: solution.id,
    candidateName: solution.name,
    targetedQueries: missingFields.slice(0, 3).map((f) => ({
      query: `${solution.name} ${f}`,
      targetField: f as any,
      targetProviders: ["gemini", "tavily"] as any,
    })),
  };
}

// ============================================================
// NODE: Extract Solution Fields from Content
// ============================================================
export async function extractSolutionFields(
  candidateName: string,
  sourceContents: Array<{ sourceId: string; content: string }>,
  projectId: string
): Promise<Partial<DiscoveredSolution> | null> {
  if (sourceContents.length === 0) return null;

  const combinedContent = sourceContents
    .map((s) => `[Source ${s.sourceId}]:\n${s.content.substring(0, 3000)}`)
    .join("\n\n---\n\n");

  const userPrompt = `Candidate: "${candidateName}"
Available Source IDs: ${sourceContents.map((s) => s.sourceId).join(", ")}

Source Content:
${combinedContent}

Extract the solution fields from this content. Map every feature and workflow step to the source ID where it was found.`;

  const model = getLLM("research");

  try {
    const response = await model.invoke([
      new SystemMessage(FIELD_EXTRACTOR_SYSTEM_PROMPT + "\n\n" + FIELD_EXTRACTOR_FEW_SHOT),
      new HumanMessage(userPrompt),
    ]);

    const rawOutput =
      typeof response.content === "string"
        ? response.content
        : JSON.stringify(response.content);

    // Extract JSON
    const jsonMatch = rawOutput.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    const parsed = JSON.parse(jsonMatch[0]);

    // Validate partial result
    const partialSchema = DiscoveredSolutionSchema.partial();
    const validation = partialSchema.safeParse(parsed);

    if (validation.success) {
      return validation.data;
    }

    return parsed;
  } catch (err) {
    console.error(`[extractSolutionFields] Failed for candidate "${candidateName}":`, err);
    return null;
  }
}

// ============================================================
// NODE: Detect Contradictions
// ============================================================
export async function detectContradictions(
  solution: DiscoveredSolution,
  sourceContents: Array<{ sourceId: string; content: string }>,
  projectId: string
): Promise<Contradiction[]> {
  if (sourceContents.length < 2) return [];

  const contentSummary = sourceContents
    .map(
      (s) =>
        `[Source ${s.sourceId}]: ${s.content.substring(0, 1000)}`
    )
    .join("\n\n");

  const userPrompt = `Candidate: "${solution.name}"
Source content:
${contentSummary}

Check for contradictions between sources about this candidate.`;

  const result = await callLLMWithRetry<any>(
    CONTRADICTION_DETECTOR_SYSTEM_PROMPT,
    userPrompt,
    ContradictionOutputSchema,
    "ContradictionDetector"
  );

  if (result.success) {
    return result.data.contradictions || [];
  }

  return [];
}

// ============================================================
// NODE: Decision Functions
// ============================================================

export interface DiscoveryDecisionInput {
  round: number;
  totalCandidates: number;
  newCandidatesThisRound: number;
  relevantCandidates: number;
  budgetRemaining: boolean;
}

export type DiscoveryDecision = "continue" | "refine" | "finish";

export function shouldContinueDiscovery(
  input: DiscoveryDecisionInput
): DiscoveryDecision {
  // Stop if budget is exhausted
  if (!input.budgetRemaining) return "finish";

  // Stop if max rounds reached
  if (input.round >= 3) return "finish";

  // Stop if sufficient candidates and diminishing returns
  if (input.relevantCandidates >= 15 && input.newCandidatesThisRound < 3) {
    return "finish";
  }

  // Stop if we have enough relevant candidates
  if (input.relevantCandidates >= 20) return "finish";

  // Continue if new candidates are still being found
  if (input.newCandidatesThisRound >= 5) return "continue";

  // Refine if new candidates are declining but we have some
  if (input.newCandidatesThisRound >= 2 && input.relevantCandidates >= 5) {
    return "refine";
  }

  // Continue for at least 2 rounds
  if (input.round < 2) return "continue";

  return "finish";
}

export interface EnrichmentDecisionInput {
  candidate: DiscoveredSolution;
  missingFields: string[];
  enrichmentRound: number;
  maxRounds: number;
}

export type EnrichmentDecision = "enrich" | "next_candidate" | "finish";

export function shouldContinueEnrichment(
  input: EnrichmentDecisionInput
): EnrichmentDecision {
  // Stop if max rounds reached
  if (input.enrichmentRound >= input.maxRounds) return "next_candidate";

  // Stop if no missing core fields
  if (input.missingFields.length === 0) return "next_candidate";

  // Stop if only low-priority fields are missing
  const highPriorityFields = ["features", "workflow", "targetUsers", "approach"];
  const hasHighPriorityMissing = input.missingFields.some((f) =>
    highPriorityFields.includes(f)
  );

  if (!hasHighPriorityMissing && input.enrichmentRound >= 1) {
    return "next_candidate";
  }

  // Continue enrichment
  return "enrich";
}

// ============================================================
// NODE: Quality Validation
// ============================================================

export interface QualityValidationResult {
  isValid: boolean;
  issues: string[];
  warnings: string[];
}

export function validateResearchQuality(
  sources: Source[],
  solutions: DiscoveredSolution[]
): QualityValidationResult {
  const issues: string[] = [];
  const warnings: string[] = [];

  // Check sources exist
  if (sources.length === 0) {
    issues.push("No sources found during research");
  }

  // Check solutions exist
  if (solutions.length === 0) {
    issues.push("No discovered solutions found");
  }

  // Validate each solution has required fields
  for (const sol of solutions) {
    if (!sol.name || sol.name === "Unknown Solution") {
      warnings.push(`Solution ${sol.id} has no identifiable name`);
    }
    if (!sol.description || sol.description.length < 10) {
      warnings.push(`Solution ${sol.name} has insufficient description`);
    }
    if (sol.features.length === 0) {
      warnings.push(`Solution ${sol.name} has no extracted features`);
    }
    if (sol.sourceIds.length === 0) {
      issues.push(`Solution ${sol.name} has no source references`);
    }

    // Check referential integrity
    for (const srcId of sol.sourceIds) {
      if (!sources.some((s) => s.id === srcId)) {
        issues.push(`Solution ${sol.name} references non-existent source ${srcId}`);
      }
    }

    // Check features have source IDs
    for (const feature of sol.features) {
      if (feature.sourceIds.length === 0) {
        warnings.push(`Feature "${feature.name}" in ${sol.name} has no source IDs`);
      }
    }
  }

  return {
    isValid: issues.length === 0,
    issues,
    warnings,
  };
}

// ============================================================
// NODE: Finalize Research Result
// ============================================================

export function finalizeResearchResult(
  researchId: string,
  allSources: Source[],
  discoveredSolutions: DiscoveredSolution[],
  contradictions: Contradiction[],
  metrics: {
    geminiSearchCalls: number;
    tavilySearchCalls: number;
    githubSearchCalls: number;
    totalSourcesFound: number;
    discoveryRounds: number;
    enrichmentRounds: number;
    topCandidatesCount: number;
  },
  stoppingReason: "coverage_sufficient" | "diminishing_returns" | "max_iterations" | "budget_limit" | "provider_failure"
) {
  const uniqueSources = deduplicateSources(allSources);

  return {
    researchId,
    summary: {
      queriesRun: metrics.geminiSearchCalls + metrics.tavilySearchCalls + metrics.githubSearchCalls,
      geminiSearchCalls: metrics.geminiSearchCalls,
      tavilySearchCalls: metrics.tavilySearchCalls,
      githubSearchCalls: metrics.githubSearchCalls,
      sourcesFound: metrics.totalSourcesFound,
      uniqueSources: uniqueSources.length,
      candidateEntities: metrics.topCandidatesCount,
      relevantSolutions: discoveredSolutions.length,
      directSolutions: discoveredSolutions.filter(
        (s) => s.relationToProblem === "direct"
      ).length,
      adjacentSolutions: discoveredSolutions.filter(
        (s) => s.relationToProblem === "adjacent"
      ).length,
      technicalApproaches: discoveredSolutions.filter(
        (s) => s.relationToProblem === "technical"
      ).length,
      enrichedSolutions: discoveredSolutions.filter(
        (s) => (s.features?.length || 0) > 0
      ).length,
      discoveryRounds: metrics.discoveryRounds,
      enrichmentRounds: metrics.enrichmentRounds,
    },
    sources: uniqueSources,
    discoveredSolutions,
    coverage: {
      commercialProducts: uniqueSources.some(
        (s) =>
          s.sourceType === "product" ||
          s.sourceType === "startup" ||
          s.domain.includes("producthunt") ||
          s.domain.includes("appsumo") ||
          s.domain.includes("capterra")
      ),
      startups: uniqueSources.some(
        (s) =>
          s.sourceType === "startup" ||
          s.domain.includes("ycombinator") ||
          s.domain.includes("crunchbase") ||
          s.domain.includes("producthunt") ||
          s.domain.includes("pitchbook")
      ),
      githubRepos: uniqueSources.some(
        (s) => s.sourceType === "github" || s.domain.includes("github.com")
      ),
      hackathons: uniqueSources.some(
        (s) =>
          s.sourceType === "hackathon" ||
          s.domain.includes("devpost") ||
          s.domain.includes("devfolio") ||
          s.domain.includes("hackathon")
      ),
      researchPapers: uniqueSources.some(
        (s) =>
          s.sourceType === "research" ||
          s.domain.includes("arxiv") ||
          s.domain.includes("ieee") ||
          s.domain.includes("scholar") ||
          s.domain.includes("researchgate")
      ),
    },
    unresolvedQuestions: [],
    contradictions,
    stoppingReason,
    quality: {
      evidenceQuality:
        discoveredSolutions.length > 10
          ? "high"
          : discoveredSolutions.length > 5
            ? "medium"
            : "low",
      coverageQuality:
        uniqueSources.length > 30
          ? "high"
          : uniqueSources.length > 15
            ? "medium"
            : "low",
    },
  };
}
