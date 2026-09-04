"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CACHE_TTL = exports.SOURCE_AUTHORITY = exports.CONCURRENCY = void 0;
exports.getResearchBudget = getResearchBudget;
const BUDGETS = {
    fast: {
        maxDiscoveryRounds: 1,
        maxInitialQueries: 5,
        maxCandidatesForEnrichment: 15,
        maxEnrichmentRoundsPerCandidate: 1,
        maxGeminiCalls: 15,
        maxTavilyCalls: 15,
        maxGitHubSearchCalls: 15,
        maxTotalSearchOperations: 30,
    },
    balanced: {
        maxDiscoveryRounds: 2,
        maxInitialQueries: 10,
        maxCandidatesForEnrichment: 8,
        maxEnrichmentRoundsPerCandidate: 1,
        maxGeminiCalls: 35,
        maxTavilyCalls: 35,
        maxGitHubSearchCalls: 35,
        maxTotalSearchOperations: 70,
    },
    deep: {
        maxDiscoveryRounds: 3,
        maxInitialQueries: 15,
        maxCandidatesForEnrichment: 35,
        maxEnrichmentRoundsPerCandidate: 2,
        maxGeminiCalls: 50,
        maxTavilyCalls: 50,
        maxGitHubSearchCalls: 40,
        maxTotalSearchOperations: 100,
    },
};
function getResearchBudget(mode) {
    return { ...BUDGETS[mode] };
}
exports.CONCURRENCY = {
    SEARCH_CONCURRENCY: 3,
    GITHUB_CONCURRENCY: 2,
    MAX_RETRIES: 2,
    RETRY_BACKOFF_MS: 1000,
};
exports.SOURCE_AUTHORITY = {
    official: 0.95,
    github: 0.9,
    research: 0.9,
    hackathon: 0.85,
    established: 0.75,
    producthunt: 0.6,
    blog: 0.5,
    reddit: 0.4,
    unknown: 0.2,
};
exports.CACHE_TTL = {
    SEARCH_CACHE_TTL_MS: 24 * 60 * 60 * 1000,
    SOURCE_CACHE_TTL_MS: 7 * 24 * 60 * 60 * 1000,
    GITHUB_CACHE_TTL_MS: 24 * 60 * 60 * 1000,
};
//# sourceMappingURL=research.config.js.map