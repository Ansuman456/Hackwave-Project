import { Source, DiscoveredSolution } from "../graph/state";
import { normalizeUrl, extractDomain } from "./sourceNormalizer";

interface CandidateEntity {
  id: string;
  name: string;
  canonicalDomain: string;
  urls: string[];
  sourceIds: string[];
  sources: Source[];
  relationToProblem: "direct" | "adjacent" | "technical";
  relevanceScore: number;
}

export function deduplicateSources(sources: Source[]): Source[] {
  const urlMap = new Map<string, Source>();

  for (const source of sources) {
    const normalized = normalizeUrl(source.url);

    if (urlMap.has(normalized)) {
      const existing = urlMap.get(normalized)!;
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
      existing.relevanceScore = Math.max(
        existing.relevanceScore,
        source.relevanceScore
      );
    } else {
      urlMap.set(normalized, { ...source });
    }
  }

  return Array.from(urlMap.values());
}

export function buildCandidateEntities(sources: Source[]): CandidateEntity[] {
  const domainGroups = new Map<string, Source[]>();

  for (const source of sources) {
    const domain = extractDomain(source.canonicalUrl || source.url);
    const key = domain || source.url;

    if (!domainGroups.has(key)) {
      domainGroups.set(key, []);
    }
    domainGroups.get(key)!.push(source);
  }

  const candidates: CandidateEntity[] = [];

  for (const [key, group] of domainGroups) {
    const allUrls = group.map((s) => s.url);
    const allSourceIds = group.map((s) => s.id);
    const avgRelevance =
      group.reduce((sum, s) => sum + s.relevanceScore, 0) / group.length;

    // Determine best name from titles
    const titles = group
      .map((s) => s.title)
      .filter((t) => t && t.length > 2);
    const name = titles.length > 0 ? titles[0] : key;

    // Determine relation from source types
    const hasGitHub = group.some((s) => s.sourceType === "github");
    const hasProduct = group.some(
      (s) => s.sourceType === "product" || s.sourceType === "startup"
    );
    const hasHackathon = group.some((s) => s.sourceType === "hackathon");

    let relation: "direct" | "adjacent" | "technical" = "adjacent";
    if (hasProduct || hasHackathon) relation = "direct";
    if (hasGitHub && !hasProduct) relation = "technical";

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
