import crypto from "crypto";
import { geminiWebSearchTool } from "../tools/gemini/geminiWebSearch.tool";
import { tavilyWebSearchTool } from "../tools/tavily/tavilySearch.tool";
import { tavilyExtractTool } from "../tools/tavily/tavilyExtract.tool";
import {
  githubGetReadmeTool,
  githubGetContentsTool,
  githubGetRepositoryTool,
} from "../tools/github/githubTools";
import { mergeSearchResults } from "./evidenceMerger";
import { Source } from "../graph/state";
import { v4 as uuidv4 } from "uuid";
import {
  findCachedSearch,
  cacheSearchResult,
} from "../models/SearchCache.model";

import { addUsageMetrics } from "../models/HackathonProject.model";

function computeQueryHash(query: string): string {
  return crypto.createHash("sha256").update(query.toLowerCase().trim()).digest("hex");
}

export interface DualSearchResult {
  queryId: string;
  query: string;
  geminiResults: Array<{
    title: string;
    url: string;
    snippet: string;
    domain: string;
  }>;
  tavilyResults: Array<{
    title: string;
    url: string;
    snippet: string;
    content?: string;
    domain: string;
    score?: number;
  }>;
  mergedSources: Source[];
  geminiFailed: boolean;
  tavilyFailed: boolean;
}

export async function executeDualSearch(
  query: string,
  sourceType: Source["sourceType"] = "web",
  projectId?: string
): Promise<DualSearchResult> {
  const queryId = `q_${uuidv4().substring(0, 8)}`;
  const queryHash = computeQueryHash(query);

  // Check cache first
  try {
    const cached = await findCachedSearch(queryHash);
    if (cached) {
      if (projectId) {
        addUsageMetrics(projectId, { cacheHits: 1 }).catch(() => {});
      }
      const mergedSources = mergeSearchResults(
        cached.geminiResults,
        cached.tavilyResults,
        queryId,
        sourceType
      );
      return {
        queryId,
        query,
        geminiResults: cached.geminiResults,
        tavilyResults: cached.tavilyResults,
        mergedSources,
        geminiFailed: false,
        tavilyFailed: false,
      };
    }
  } catch (err) {
    console.error(`[webResearchService] Cache lookup failed for query "${query}":`, err);
    // Continue without cache on error
  }

  if (projectId) {
    addUsageMetrics(projectId, {
      cacheMisses: 1,
      geminiSearchCalls: 1,
      tavilyCalls: 1,
    }).catch(() => {});
  }

  const [geminiResult, tavilyResult] = await Promise.allSettled([
    geminiWebSearchTool.invoke({
      query,
      purpose: `Discover existing solutions for: ${query}`,
    }),
    tavilyWebSearchTool.invoke({
      query,
      searchDepth: "basic",
      maxResults: 10,
    }),
  ]);

  let geminiParsed: { success: boolean; results: any[] } = {
    success: false,
    results: [],
  };
  let tavilyParsed: { success: boolean; results: any[] } = {
    success: false,
    results: [],
  };

  if (geminiResult.status === "fulfilled") {
    try {
      geminiParsed = JSON.parse(geminiResult.value);
    } catch (err) {
      console.error("[webResearchService] Failed to parse Gemini result:", err);
      geminiParsed = { success: false, results: [] };
    }
  }

  if (tavilyResult.status === "fulfilled") {
    try {
      tavilyParsed = JSON.parse(tavilyResult.value);
    } catch (err) {
      console.error("[webResearchService] Failed to parse Tavily result:", err);
      tavilyParsed = { success: false, results: [] };
    }
  }

  const geminiResults = geminiParsed.success ? geminiParsed.results : [];
  const tavilyResults = tavilyParsed.success ? tavilyParsed.results : [];

  const mergedSources = mergeSearchResults(
    geminiResults,
    tavilyResults,
    queryId,
    sourceType
  );

  // Cache results for future lookups
  try {
    await cacheSearchResult(query, queryHash, mergedSources, geminiResults, tavilyResults);
  } catch (err) {
    console.error("[webResearchService] Failed to cache search result:", err);
  }

  return {
    queryId,
    query,
    geminiResults,
    tavilyResults,
    mergedSources,
    geminiFailed: !geminiParsed.success,
    tavilyFailed: !tavilyParsed.success,
  };
}

export interface DeepExtractionResult {
  sources: Source[];
}

export async function executeDeepExtraction(
  queryOrUrl: string,
  providers: {
    gemini: boolean;
    tavily: boolean;
    github: boolean;
  }
): Promise<DeepExtractionResult> {
  const sources: Source[] = [];
  const queryId = `q_${uuidv4().substring(0, 8)}`;

  // If URL looks like a GitHub repo, use GitHub tools for deep extraction
  const isGitHubUrl =
    queryOrUrl.includes("github.com") && providers.github;

  if (isGitHubUrl) {
    // Extract owner/repo from URL
    const match = queryOrUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (match) {
      const [, owner, repo] = match;

      // Get repository metadata
      try {
        const repoResult = await githubGetRepositoryTool.invoke({
          owner,
          repo,
        });
        const repoParsed = JSON.parse(repoResult);
        if (repoParsed.success && repoParsed.repository) {
          const r = repoParsed.repository;
          sources.push({
            id: `src_gh_repo_${uuidv4().substring(0, 8)}`,
            title: r.fullName || `${owner}/${repo}`,
            url: r.url || queryOrUrl,
            canonicalUrl: r.url || queryOrUrl,
            domain: "github.com",
            sourceType: "github",
            discoveredBy: ["github"],
            searchQueryIds: [queryId],
            snippet: r.description || "",
            retrievedAt: new Date().toISOString(),
            relevanceScore: Math.min((r.stars || 0) / 100, 1.0),
            authorityScore: 0.85,
            extractionStatus: "success",
            metadata: {
              stars: r.stars,
              forks: r.forks,
              language: r.language,
              topics: r.topics,
            },
          });
        }
      } catch (err) {
        console.error(`[webResearchService] Failed to fetch GitHub repo ${owner}/${repo}:`, err);
      }

      // Get README content
      try {
        const readmeResult = await githubGetReadmeTool.invoke({
          owner,
          repo,
        });
        const readmeParsed = JSON.parse(readmeResult);
        if (readmeParsed.success && readmeParsed.content) {
          sources.push({
            id: `src_gh_readme_${uuidv4().substring(0, 8)}`,
            title: `README: ${owner}/${repo}`,
            url: `${queryOrUrl}#readme`,
            canonicalUrl: `${queryOrUrl}#readme`,
            domain: "github.com",
            sourceType: "github",
            discoveredBy: ["github"],
            searchQueryIds: [queryId],
            snippet: readmeParsed.content.substring(0, 500),
            content: readmeParsed.content,
            retrievedAt: new Date().toISOString(),
            relevanceScore: 0.8,
            authorityScore: 0.9,
            extractionStatus: "success",
            metadata: { fileType: "readme" },
          });
        }
      } catch (err) {
        console.error(`[webResearchService] Failed to fetch README for ${owner}/${repo}:`, err);
      }

      // Get key files (package.json, pyproject.toml, etc.)
      const keyFiles = [
        "package.json",
        "pyproject.toml",
        "requirements.txt",
        "Cargo.toml",
        "go.mod",
        "pom.xml",
      ];
      for (const filename of keyFiles) {
        try {
          const contentsResult = await githubGetContentsTool.invoke({
            owner,
            repo,
            path: filename,
          });
          const contentsParsed = JSON.parse(contentsResult);
          if (contentsParsed.success && contentsParsed.content) {
            sources.push({
              id: `src_gh_file_${uuidv4().substring(0, 8)}`,
              title: `${filename}: ${owner}/${repo}`,
              url: `${queryOrUrl}/blob/main/${filename}`,
              canonicalUrl: `${queryOrUrl}/blob/main/${filename}`,
              domain: "github.com",
              sourceType: "github",
              discoveredBy: ["github"],
              searchQueryIds: [queryId],
              snippet: contentsParsed.content.substring(0, 300),
              content: contentsParsed.content,
              retrievedAt: new Date().toISOString(),
              relevanceScore: 0.7,
              authorityScore: 0.85,
              extractionStatus: "success",
              metadata: { fileType: filename },
            });
          }
        } catch (err) {
          // Skip missing files - expected for most repos
        }
      }
    }
  } else {
    // Use Tavily Extract for web URLs (only if queryOrUrl is a valid URL)
    const isUrl = /^https?:\/\//i.test(queryOrUrl);
    if (providers.tavily && isUrl) {
      try {
        const extractResult = await tavilyExtractTool.invoke({
          urls: [queryOrUrl],
        });
        const extractParsed = JSON.parse(extractResult);
        if (extractParsed.success && extractParsed.results) {
          for (const result of extractParsed.results) {
            sources.push({
              id: `src_extract_${uuidv4().substring(0, 8)}`,
              title: result.title || queryOrUrl,
              url: result.url || queryOrUrl,
              canonicalUrl: result.url || queryOrUrl,
              domain: new URL(result.url || queryOrUrl).hostname,
              sourceType: "web",
              discoveredBy: ["tavily"],
              searchQueryIds: [queryId],
              snippet: result.rawContent?.substring(0, 500) || "",
              content: result.rawContent || "",
              retrievedAt: new Date().toISOString(),
              relevanceScore: 0.8,
              authorityScore: 0.7,
              extractionStatus: "success",
              metadata: { extractionType: "tavily_extract" },
            });
          }
        }
      } catch (err) {
        console.error(`[webResearchService] Tavily extract failed for ${queryOrUrl}:`, err);
      }
    }

    // Also run web search for additional context
    if (providers.gemini || providers.tavily) {
      const searchResult = await executeDualSearch(queryOrUrl);
      sources.push(...searchResult.mergedSources);
    }
  }

  return { sources };
}
