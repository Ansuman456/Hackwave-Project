import { v4 as uuidv4 } from "uuid";
import {
  ProblemAnalysis,
  ResearchResult,
  InnovationResult,
  DiscoveredSolution,
} from "../../graph/state";
import { emitEvent } from "../../utils/sseStreamer";
import { generateEmbeddings, clusterSolutions, assignClusterNames } from "./vectorClustering";
import { buildFeatureLandscape, identifyGaps } from "./gapAnalysis";
import { generateCandidates } from "./candidateGenerator";
import { scoreCandidates, filterDuplicateCandidates, getClosestExistingSolutions } from "./candidateRanker";
import { getLLM } from "../../utils/llmFactory";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

export interface InnovationResult_Old {
  success: boolean;
  innovation?: InnovationResult;
  error?: string;
}

export async function runInnovation(
  projectId: string,
  problemAnalysis: ProblemAnalysis,
  research: ResearchResult
): Promise<InnovationResult_Old> {
  emitEvent(projectId, "innovation", "innovation_started", "Innovation agent starting analysis");

  try {
    const solutions = research.discoveredSolutions;

    if (solutions.length === 0) {
      return { success: false, error: "No discovered solutions to analyze" };
    }

    // Step 1: Vector Embeddings & Clustering
    emitEvent(projectId, "innovation", "innovation_started", "Generating solution embeddings and clusters");
    let clusters;
    try {
      const embedded = await generateEmbeddings(solutions);
      const rawClusters = clusterSolutions(embedded, solutions);
      clusters = assignClusterNames(rawClusters, solutions);
    } catch (err) {
      console.error("[Innovation] Embedding/clustering failed, using fallback:", err);
      // Fallback: simple grouping by relationToProblem
      clusters = buildFallbackClusters(solutions);
    }

    // Step 2: Feature Landscape & Gap Analysis
    emitEvent(projectId, "innovation", "innovation_started", "Analyzing feature landscape and identifying gaps");
    const featureLandscape = buildFeatureLandscape(solutions);
    const gaps = identifyGaps(featureLandscape, solutions, problemAnalysis.domainKeywords);

    // Step 3: Candidate Generation
    emitEvent(projectId, "innovation", "innovation_started", "Generating candidate ideas");
    let candidates = await generateCandidates(
      problemAnalysis,
      research,
      gaps,
      featureLandscape,
      clusters
    );

    if (candidates.length === 0) {
      return { success: false, error: "Failed to generate any candidate ideas" };
    }

    // Step 4: Score & Filter Candidates
    emitEvent(projectId, "innovation", "innovation_started", "Scoring and filtering candidates");
    const rawScored = scoreCandidates(candidates, solutions);
    let scored = filterDuplicateCandidates(rawScored, solutions);

    if (scored.length === 0 && rawScored.length > 0) {
      console.log("[Innovation] All candidates filtered by similarity check. Using top raw scored candidate as fallback.");
      scored = [rawScored[0]];
    }

    if (scored.length === 0) {
      return { success: false, error: "No viable candidate ideas after scoring and filtering" };
    }

    // Step 5: Build Differentiation Analysis
    const closestSolutions = getClosestExistingSolutions(scored[0], solutions);
    const differentiationSummary = buildDifferentiationSummary(scored[0], closestSolutions, solutions);

    // Step 6: Novelty Assessment
    const noveltyAssessment = assessNovelty(scored[0], solutions, featureLandscape);

    // Step 7: Project Capability Requirements
    const projectCapabilityRequirements = deriveCapabilityRequirements(scored[0]);

    // Build InnovationResult (without selectedIdea - user selects later)
    const innovationResult: InnovationResult = {
      innovationId: `inn_${uuidv4().substring(0, 8)}`,
      candidateIdeas: scored,
      selectedIdea: null, // User will select
      solutionLandscape: {
        totalSolutions: solutions.length,
        directSolutions: solutions.filter((s) => s.relationToProblem === "direct").length,
        adjacentSolutions: solutions.filter((s) => s.relationToProblem === "adjacent").length,
        dominantApproaches: extractDominantApproaches(solutions),
        majorSolutionClusters: clusters,
      },
      featureLandscape,
      identifiedGaps: gaps,
      differentiation: {
        summary: differentiationSummary,
        keyDifferentiators: scored[0]?.differentiators || [],
      },
      noveltyAssessment,
      projectCapabilityRequirements,
      validationQuestions: generateValidationQuestions(scored[0], gaps),
      confidence: calculateConfidence(scored, solutions),
    };

    emitEvent(
      projectId,
      "innovation",
      "innovation_completed",
      `Innovation analysis complete: ${scored.length} candidates generated, top score: ${scored[0].overallConceptScore}`
    );

    return { success: true, innovation: innovationResult };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Innovation agent failed";
    console.error("[Innovation] Fatal error:", err);
    emitEvent(projectId, "innovation", "agent_failed", msg);
    return { success: false, error: msg };
  }
}

function buildFallbackClusters(solutions: DiscoveredSolution[]) {
  const groups = new Map<string, string[]>();
  for (const sol of solutions) {
    const key = sol.relationToProblem;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(sol.id);
  }

  return Array.from(groups.entries()).map(([key, ids], i) => ({
    id: `cluster_${i + 1}`,
    name: `${key.charAt(0).toUpperCase() + key.slice(1)} Solutions`,
    description: `Group of ${key} solutions`,
    solutionIds: ids,
    commonFeatures: [],
    distinguishingCharacteristics: [],
  }));
}

function extractDominantApproaches(solutions: DiscoveredSolution[]): string[] {
  const approachCounts = new Map<string, number>();
  for (const sol of solutions) {
    const approaches = sol.approach.split(/[,.]/).map((a) => a.trim()).filter(Boolean);
    for (const a of approaches) {
      const canonical = a.toLowerCase().substring(0, 50);
      approachCounts.set(canonical, (approachCounts.get(canonical) || 0) + 1);
    }
  }

  return Array.from(approachCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([approach]) => approach);
}

function buildDifferentiationSummary(
  candidate: any,
  closestSolutions: Array<{ solutionId: string; overlap: string[]; differences: string[]; strength: number }>,
  allSolutions: DiscoveredSolution[]
): string {
  const closest = closestSolutions[0];
  if (!closest) return "No close existing solutions found for comparison.";

  const closestSol = allSolutions.find((s) => s.id === closest.solutionId);
  const closestName = closestSol?.name || "Unknown";

  const overlapList = closest.overlap.length > 0
    ? `Shared capabilities: ${closest.overlap.join(", ")}.`
    : "No direct feature overlap.";

  const diffList = closest.differences.length > 0
    ? `Key differences: ${closest.differences.slice(0, 3).join(", ")}.`
    : "";

  return `Closest existing solution: ${closestName}. ${overlapList} ${diffList} The proposed concept differentiates by addressing identified gaps that existing solutions do not cover.`;
}

function assessNovelty(
  candidate: any,
  solutions: DiscoveredSolution[],
  featureLandscape: any[]
): any {
  const candidateFeatureNames = new Set(
    candidate.keyFeatures.map((f: any) => f.name.toLowerCase().trim())
  );

  // Count how many existing solutions have similar features
  let overlapCount = 0;
  for (const sol of solutions) {
    const solFeatureNames = sol.features.map((f) => f.name.toLowerCase().trim());
    const overlap = solFeatureNames.filter((f) => candidateFeatureNames.has(f)).length;
    if (overlap >= 2) overlapCount++;
  }

  const overlapRatio = solutions.length > 0 ? overlapCount / solutions.length : 0;

  let classification: "high_differentiation" | "moderate_differentiation" | "low_differentiation";
  if (overlapRatio < 0.2) classification = "high_differentiation";
  else if (overlapRatio < 0.5) classification = "moderate_differentiation";
  else classification = "low_differentiation";

  return {
    classification,
    score: Math.round((1 - overlapRatio) * 10 * 100) / 100,
    reasoning: `${Math.round((1 - overlapRatio) * 100)}% of existing solutions share few features with the proposed concept.`,
    strongestDifferentiators: candidate.differentiators?.map((d: any) => d.statement) || [],
    majorOverlapAreas: [],
    closestExistingSolutions: solutions.slice(0, 3).map((s) => s.id),
    evidenceSourceIds: [],
    confidence: 0.7,
  };
}

function deriveCapabilityRequirements(candidate: any): any {
  const capabilities = new Set<string>();
  const techCapabilities = new Set<string>();
  const roles = new Set<string>();

  for (const feature of candidate.keyFeatures || []) {
    capabilities.add(feature.name);
    if (feature.category === "ai") techCapabilities.add("AI/ML model");
    if (feature.category === "automation") techCapabilities.add("automation engine");
    if (feature.category === "analytics") techCapabilities.add("analytics dashboard");
    if (feature.category === "workflow") techCapabilities.add("workflow engine");
  }

  // Infer roles from features
  const hasAI = [...capabilities].some((c) => c.toLowerCase().includes("predict") || c.toLowerCase().includes("classify"));
  const hasUI = candidate.keyFeatures?.length > 2;
  const hasData = [...capabilities].some((c) => c.toLowerCase().includes("data") || c.toLowerCase().includes("track"));

  if (hasAI) roles.add("AI/ML Engineer");
  if (hasUI) roles.add("Frontend Developer");
  if (hasData) roles.add("Backend Developer");
  roles.add("Full-Stack Developer");

  return {
    requiredCapabilities: [...capabilities],
    technicalCapabilities: [...techCapabilities, "REST API", "database"],
    domainCapabilities: [...capabilities].slice(0, 5),
    likelyTeamRoles: [...roles],
    complexityAreas: candidate.potentialRisks || [],
    potentialSkillGaps: [],
    criticalDependencies: [],
  };
}

function generateValidationQuestions(candidate: any, gaps: any[]): string[] {
  const questions: string[] = [];

  if (candidate.estimatedComplexity === "high") {
    questions.push("Can this be built as an MVP in the hackathon timeframe?");
  }
  if (candidate.differentiationScore < 6) {
    questions.push("Is the differentiation strong enough to stand out?");
  }
  if (gaps.length === 0) {
    questions.push("Are there sufficient unmet needs to justify this approach?");
  }
  questions.push("Does the team have the required skills?");
  questions.push("Can this be demonstrated effectively?");

  return questions;
}

function calculateConfidence(candidates: any[], solutions: DiscoveredSolution[]): number {
  if (candidates.length === 0) return 0;
  const avgScore = candidates.reduce((sum, c) => sum + c.overallConceptScore, 0) / candidates.length;
  const solutionCoverage = Math.min(solutions.length / 10, 1);
  return Math.round((avgScore / 10 * 0.7 + solutionCoverage * 0.3) * 100) / 100;
}
