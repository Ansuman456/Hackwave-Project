import { ProblemAnalysis, Source, DiscoveredSolution } from "../../graph/state";
import { QueryGenOutput } from "../../prompts/researcherQueryGen";
import { EnrichmentQueryOutput } from "../../prompts/enrichmentQueryGen";
import { Contradiction } from "../../graph/state";
export interface ResearchPlan {
    researchDimensions: string[];
    queryCategories: string[];
    maxRounds: number;
    priorityKeywords: string[];
}
export declare function buildResearchPlan(problemAnalysis: ProblemAnalysis, projectId: string): Promise<ResearchPlan>;
export declare function generateDiscoveryQueries(problemAnalysis: ProblemAnalysis, projectId: string, round: number): Promise<{
    queries: QueryGenOutput["queries"];
}>;
export declare function runDualWebSearch(queries: Array<{
    id: string;
    query: string;
    targetProviders: string[];
}>, projectId: string): Promise<{
    sources: Source[];
    geminiCalls: number;
    tavilyCalls: number;
}>;
export declare function runGitHubSearch(queries: Array<{
    query: string;
}>, projectId: string): Promise<{
    sources: Source[];
    searchCalls: number;
}>;
export declare function classifyCandidates(sources: Source[], problemAnalysis: ProblemAnalysis, projectId: string): Promise<{
    classified: Source[];
}>;
export declare function detectMissingFields(solution: DiscoveredSolution): string[];
export declare function generateEnrichmentQueries(solution: DiscoveredSolution, missingFields: string[], projectId: string): Promise<EnrichmentQueryOutput>;
export declare function extractSolutionFields(candidateName: string, sourceContents: Array<{
    sourceId: string;
    content: string;
}>, projectId: string): Promise<Partial<DiscoveredSolution> | null>;
export declare function detectContradictions(solution: DiscoveredSolution, sourceContents: Array<{
    sourceId: string;
    content: string;
}>, projectId: string): Promise<Contradiction[]>;
export interface DiscoveryDecisionInput {
    round: number;
    totalCandidates: number;
    newCandidatesThisRound: number;
    relevantCandidates: number;
    budgetRemaining: boolean;
}
export type DiscoveryDecision = "continue" | "refine" | "finish";
export declare function shouldContinueDiscovery(input: DiscoveryDecisionInput): DiscoveryDecision;
export interface EnrichmentDecisionInput {
    candidate: DiscoveredSolution;
    missingFields: string[];
    enrichmentRound: number;
    maxRounds: number;
}
export type EnrichmentDecision = "enrich" | "next_candidate" | "finish";
export declare function shouldContinueEnrichment(input: EnrichmentDecisionInput): EnrichmentDecision;
export interface QualityValidationResult {
    isValid: boolean;
    issues: string[];
    warnings: string[];
}
export declare function validateResearchQuality(sources: Source[], solutions: DiscoveredSolution[]): QualityValidationResult;
export declare function finalizeResearchResult(researchId: string, allSources: Source[], discoveredSolutions: DiscoveredSolution[], contradictions: Contradiction[], metrics: {
    geminiSearchCalls: number;
    tavilySearchCalls: number;
    githubSearchCalls: number;
    totalSourcesFound: number;
    discoveryRounds: number;
    enrichmentRounds: number;
    topCandidatesCount: number;
}, stoppingReason: "coverage_sufficient" | "diminishing_returns" | "max_iterations" | "budget_limit" | "provider_failure"): {
    researchId: string;
    summary: {
        queriesRun: number;
        geminiSearchCalls: number;
        tavilySearchCalls: number;
        githubSearchCalls: number;
        sourcesFound: number;
        uniqueSources: number;
        candidateEntities: number;
        relevantSolutions: number;
        directSolutions: number;
        adjacentSolutions: number;
        technicalApproaches: number;
        enrichedSolutions: number;
        discoveryRounds: number;
        enrichmentRounds: number;
    };
    sources: {
        domain: string;
        id: string;
        title: string;
        url: string;
        canonicalUrl: string;
        sourceType: "hackathon" | "other" | "open_source" | "research" | "github" | "product" | "startup" | "web" | "blog";
        discoveredBy: ("github" | "gemini" | "tavily")[];
        searchQueryIds: string[];
        retrievedAt: string;
        relevanceScore: number;
        authorityScore: number;
        extractionStatus: "success" | "partial" | "failed";
        metadata: Record<string, unknown>;
        snippet?: string | null | undefined;
        content?: string | null | undefined;
        publishedAt?: string | null | undefined;
    }[];
    discoveredSolutions: {
        name: string;
        description: string;
        confidence: number;
        workflow: {
            description: string;
            sourceIds: string[];
            step: number;
            action: string;
        }[];
        targetUsers: string[];
        id: string;
        sourceIds: string[];
        problemSolved: string;
        approach: string;
        features: {
            name: string;
            description: string;
            category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "collaboration" | "integration";
            sourceIds: string[];
        }[];
        inputs: string[];
        outputs: string[];
        technologies: string[];
        limitations: string[];
        relationToProblem: "technical" | "direct" | "adjacent";
        lastEnrichedAt: string;
        website?: string | null | undefined;
        githubRepository?: string | null | undefined;
    }[];
    coverage: {
        commercialProducts: boolean;
        startups: boolean;
        githubRepos: boolean;
        hackathons: boolean;
        researchPapers: boolean;
    };
    unresolvedQuestions: never[];
    contradictions: {
        status: "unresolved" | "resolved";
        sourceIds: string[];
        solutionId: string;
        field: string;
        conflictingValues: string[];
    }[];
    stoppingReason: "coverage_sufficient" | "diminishing_returns" | "max_iterations" | "budget_limit" | "provider_failure";
    quality: {
        evidenceQuality: string;
        coverageQuality: string;
    };
};
//# sourceMappingURL=researcherNodes.d.ts.map