"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deduplicateSources = deduplicateSources;
exports.buildCandidateEntities = buildCandidateEntities;
const sourceNormalizer_1 = require("./sourceNormalizer");
function deduplicateSources(sources) {
    const urlMap = new Map();
    for (const source of sources) {
        const normalized = (0, sourceNormalizer_1.normalizeUrl)(source.url);
        if (urlMap.has(normalized)) {
            const existing = urlMap.get(normalized);
            // Merge discoveredBy
            const allDiscoveredBy = new Set([
                ...existing.discoveredBy,
                ...source.discoveredBy,
            ]);
            existing.discoveredBy = Array.from(allDiscoveredBy);
            // Merge searchQueryIds
            const allQueryIds = new Set([
                ...existing.searchQueryIds,
                ...source.searchQueryIds,
            ]);
            existing.searchQueryIds = Array.from(allQueryIds);
            // Keep better content
            if (!existing.content && source.content) {
                existing.content = source.content;
            }
            if (!existing.snippet && source.snippet) {
                existing.snippet = source.snippet;
            }
            // Keep higher relevance score
            existing.relevanceScore = Math.max(existing.relevanceScore, source.relevanceScore);
        }
        else {
            urlMap.set(normalized, { ...source });
        }
    }
    return Array.from(urlMap.values());
}
function buildCandidateEntities(sources) {
    const domainGroups = new Map();
    for (const source of sources) {
        const domain = (0, sourceNormalizer_1.extractDomain)(source.canonicalUrl || source.url);
        const key = domain || source.url;
        if (!domainGroups.has(key)) {
            domainGroups.set(key, []);
        }
        domainGroups.get(key).push(source);
    }
    const candidates = [];
    for (const [key, group] of domainGroups) {
        const allUrls = group.map((s) => s.url);
        const allSourceIds = group.map((s) => s.id);
        const avgRelevance = group.reduce((sum, s) => sum + s.relevanceScore, 0) / group.length;
        // Determine best name from titles
        const titles = group
            .map((s) => s.title)
            .filter((t) => t && t.length > 2);
        const name = titles.length > 0 ? titles[0] : key;
        // Determine relation from source types
        const hasGitHub = group.some((s) => s.sourceType === "github");
        const hasProduct = group.some((s) => s.sourceType === "product" || s.sourceType === "startup");
        const hasHackathon = group.some((s) => s.sourceType === "hackathon");
        let relation = "adjacent";
        if (hasProduct || hasHackathon)
            relation = "direct";
        if (hasGitHub && !hasProduct)
            relation = "technical";
        candidates.push({
            id: `candidate_${candidates.length + 1}`,
            name,
            canonicalDomain: key,
            urls: allUrls,
            sourceIds: allSourceIds,
            sources: group,
            relationToProblem: relation,
            relevanceScore: avgRelevance,
        });
    }
    return candidates;
}
//# sourceMappingURL=solutionDeduplicator.js.map