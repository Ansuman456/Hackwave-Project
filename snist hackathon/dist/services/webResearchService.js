"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeDualSearch = executeDualSearch;
exports.executeDeepExtraction = executeDeepExtraction;
const crypto_1 = __importDefault(require("crypto"));
const geminiWebSearch_tool_1 = require("../tools/gemini/geminiWebSearch.tool");
const tavilySearch_tool_1 = require("../tools/tavily/tavilySearch.tool");
const tavilyExtract_tool_1 = require("../tools/tavily/tavilyExtract.tool");
const githubTools_1 = require("../tools/github/githubTools");
const evidenceMerger_1 = require("./evidenceMerger");
const uuid_1 = require("uuid");
const SearchCache_model_1 = require("../models/SearchCache.model");
const HackathonProject_model_1 = require("../models/HackathonProject.model");
function computeQueryHash(query) {
    return crypto_1.default.createHash("sha256").update(query.toLowerCase().trim()).digest("hex");
}
const GEMINI_SEARCH_TIMEOUT_MS = 6000; // 6 seconds limit for Gemini Search Grounding
function withTimeout(promise, timeoutMs, fallbackValue) {
    let timer;
    const timeoutPromise = new Promise((resolve) => {
        timer = setTimeout(() => {
            console.warn(`[SEARCH TIMEOUT] Gemini search exceeded ${timeoutMs}ms limit. Proceeding with Tavily...`);
            resolve(fallbackValue);
        }, timeoutMs);
    });
    return Promise.race([
        promise.then((val) => {
            clearTimeout(timer);
            return val;
        }),
        timeoutPromise,
    ]);
}
async function executeDualSearch(query, sourceType = "web", projectId) {
    const queryId = `q_${(0, uuid_1.v4)().substring(0, 8)}`;
    const queryHash = computeQueryHash(query);
    // Check cache first
    try {
        const cached = await (0, SearchCache_model_1.findCachedSearch)(queryHash);
        if (cached) {
            if (projectId) {
                (0, HackathonProject_model_1.addUsageMetrics)(projectId, { cacheHits: 1 }).catch(() => { });
            }
            const mergedSources = (0, evidenceMerger_1.mergeSearchResults)(cached.geminiResults, cached.tavilyResults, queryId, sourceType);
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
    }
    catch (err) {
        console.error(`[webResearchService] Cache lookup failed for query "${query}":`, err);
        // Continue without cache on error
    }
    if (projectId) {
        (0, HackathonProject_model_1.addUsageMetrics)(projectId, {
            cacheMisses: 1,
            geminiSearchCalls: 1,
            tavilyCalls: 1,
        }).catch(() => { });
    }
    const [geminiResult, tavilyResult] = await Promise.allSettled([
        withTimeout(geminiWebSearch_tool_1.geminiWebSearchTool.invoke({
            query,
            purpose: `Discover existing solutions for: ${query}`,
        }), GEMINI_SEARCH_TIMEOUT_MS, JSON.stringify({
            success: false,
            error: "Gemini search timed out (6s limit exceeded)",
            results: [],
            provider: "gemini",
        })),
        tavilySearch_tool_1.tavilyWebSearchTool.invoke({
            query,
            searchDepth: "basic",
            maxResults: 10,
        }),
    ]);
    let geminiParsed = {
        success: false,
        results: [],
    };
    let tavilyParsed = {
        success: false,
        results: [],
    };
    if (geminiResult.status === "fulfilled") {
        try {
            geminiParsed = JSON.parse(geminiResult.value);
        }
        catch (err) {
            console.error("[webResearchService] Failed to parse Gemini result:", err);
            geminiParsed = { success: false, results: [] };
        }
    }
    if (tavilyResult.status === "fulfilled") {
        try {
            tavilyParsed = JSON.parse(tavilyResult.value);
        }
        catch (err) {
            console.error("[webResearchService] Failed to parse Tavily result:", err);
            tavilyParsed = { success: false, results: [] };
        }
    }
    const geminiResults = geminiParsed.success ? geminiParsed.results : [];
    const tavilyResults = tavilyParsed.success ? tavilyParsed.results : [];
    const mergedSources = (0, evidenceMerger_1.mergeSearchResults)(geminiResults, tavilyResults, queryId, sourceType);
    // Cache results for future lookups
    try {
        await (0, SearchCache_model_1.cacheSearchResult)(query, queryHash, mergedSources, geminiResults, tavilyResults);
    }
    catch (err) {
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
async function executeDeepExtraction(queryOrUrl, providers) {
    const sources = [];
    const queryId = `q_${(0, uuid_1.v4)().substring(0, 8)}`;
    // If URL looks like a GitHub repo, use GitHub tools for deep extraction
    const isGitHubUrl = queryOrUrl.includes("github.com") && providers.github;
    if (isGitHubUrl) {
        // Extract owner/repo from URL
        const match = queryOrUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
        if (match) {
            const [, owner, repo] = match;
            // Get repository metadata
            try {
                const repoResult = await githubTools_1.githubGetRepositoryTool.invoke({
                    owner,
                    repo,
                });
                const repoParsed = JSON.parse(repoResult);
                if (repoParsed.success && repoParsed.repository) {
                    const r = repoParsed.repository;
                    sources.push({
                        id: `src_gh_repo_${(0, uuid_1.v4)().substring(0, 8)}`,
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
            }
            catch (err) {
                console.error(`[webResearchService] Failed to fetch GitHub repo ${owner}/${repo}:`, err);
            }
            // Get README content
            try {
                const readmeResult = await githubTools_1.githubGetReadmeTool.invoke({
                    owner,
                    repo,
                });
                const readmeParsed = JSON.parse(readmeResult);
                if (readmeParsed.success && readmeParsed.content) {
                    sources.push({
                        id: `src_gh_readme_${(0, uuid_1.v4)().substring(0, 8)}`,
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
            }
            catch (err) {
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
                    const contentsResult = await githubTools_1.githubGetContentsTool.invoke({
                        owner,
                        repo,
                        path: filename,
                    });
                    const contentsParsed = JSON.parse(contentsResult);
                    if (contentsParsed.success && contentsParsed.content) {
                        sources.push({
                            id: `src_gh_file_${(0, uuid_1.v4)().substring(0, 8)}`,
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
                }
                catch (err) {
                    // Skip missing files - expected for most repos
                }
            }
        }
    }
    else {
        // Use Tavily Extract for web URLs (only if queryOrUrl is a valid URL)
        const isUrl = /^https?:\/\//i.test(queryOrUrl);
        if (providers.tavily && isUrl) {
            try {
                const extractResult = await tavilyExtract_tool_1.tavilyExtractTool.invoke({
                    urls: [queryOrUrl],
                });
                const extractParsed = JSON.parse(extractResult);
                if (extractParsed.success && extractParsed.results) {
                    for (const result of extractParsed.results) {
                        sources.push({
                            id: `src_extract_${(0, uuid_1.v4)().substring(0, 8)}`,
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
            }
            catch (err) {
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
//# sourceMappingURL=webResearchService.js.map