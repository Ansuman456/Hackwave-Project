export interface ResearchBudget {
    maxDiscoveryRounds: number;
    maxInitialQueries: number;
    maxCandidatesForEnrichment: number;
    maxEnrichmentRoundsPerCandidate: number;
    maxGeminiCalls: number;
    maxTavilyCalls: number;
    maxGitHubSearchCalls: number;
    maxTotalSearchOperations: number;
}
export type ResearchMode = "fast" | "balanced" | "deep";
export declare function getResearchBudget(mode: ResearchMode): ResearchBudget;
export declare const CONCURRENCY: {
    SEARCH_CONCURRENCY: number;
    GITHUB_CONCURRENCY: number;
    MAX_RETRIES: number;
    RETRY_BACKOFF_MS: number;
};
export declare const SOURCE_AUTHORITY: Record<string, number>;
export declare const CACHE_TTL: {
    SEARCH_CACHE_TTL_MS: number;
    SOURCE_CACHE_TTL_MS: number;
    GITHUB_CACHE_TTL_MS: number;
};
//# sourceMappingURL=research.config.d.ts.map