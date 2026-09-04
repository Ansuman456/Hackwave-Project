"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.githubGetContentsTool = exports.githubGetReadmeTool = exports.githubGetRepositoryTool = exports.githubSearchRepositoriesTool = void 0;
const tools_1 = require("@langchain/core/tools");
const zod_1 = require("zod");
const env_1 = require("../../config/env");
async function githubFetch(endpoint) {
    const config = (0, env_1.getConfig)();
    const headers = {
        Accept: "application/vnd.github.v3+json",
    };
    if (config.GITHUB_TOKEN) {
        headers.Authorization = `Bearer ${config.GITHUB_TOKEN}`;
    }
    const response = await fetch(`https://api.github.com${endpoint}`, {
        headers,
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`GitHub API ${response.status}: ${errorText}`);
    }
    return response.json();
}
exports.githubSearchRepositoriesTool = new tools_1.DynamicStructuredTool({
    name: "github_search_repositories",
    description: "Searches GitHub for open-source repositories matching keywords. Returns repository name, owner, description, stars, forks, topics, and language.",
    schema: zod_1.z.object({
        query: zod_1.z
            .string()
            .describe("Search query (e.g., 'food waste prediction python')"),
        perPage: zod_1.z
            .number()
            .min(1)
            .max(30)
            .default(10)
            .describe("Results per page (max 30)"),
        page: zod_1.z.number().min(1).default(1).describe("Page number"),
    }),
    func: async ({ query, perPage, page }) => {
        try {
            const endpoint = `/search/repositories?q=${encodeURIComponent(query)}&per_page=${perPage}&page=${page}&sort=stars&order=desc`;
            const data = (await githubFetch(endpoint));
            const results = (data.items || []).map((item) => ({
                owner: item.owner?.login || "",
                name: item.name || "",
                fullName: item.full_name || "",
                url: item.html_url || "",
                description: item.description || "",
                stars: item.stargazers_count || 0,
                forks: item.forks_count || 0,
                topics: item.topics || [],
                language: item.language || "",
                createdAt: item.created_at || "",
                updatedAt: item.updated_at || "",
            }));
            return JSON.stringify({
                success: true,
                query,
                totalCount: data.total_count || 0,
                results,
                provider: "github",
            });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Unknown GitHub error";
            return JSON.stringify({
                success: false,
                error: message,
                query,
                results: [],
                provider: "github",
            });
        }
    },
});
exports.githubGetRepositoryTool = new tools_1.DynamicStructuredTool({
    name: "github_get_repository",
    description: "Fetches detailed metadata for a specific GitHub repository including description, languages, topics, stars, forks, license, and dates.",
    schema: zod_1.z.object({
        owner: zod_1.z.string().describe("Repository owner (username or org)"),
        repo: zod_1.z.string().describe("Repository name"),
    }),
    func: async ({ owner, repo }) => {
        try {
            const data = (await githubFetch(`/repos/${owner}/${repo}`));
            return JSON.stringify({
                success: true,
                fullName: data.full_name || `${owner}/${repo}`,
                url: data.html_url || "",
                description: data.description || "",
                stars: data.stargazers_count || 0,
                forks: data.forks_count || 0,
                topics: data.topics || [],
                language: data.language || "",
                languages: data.languages || {},
                license: data.license?.spdx_id || "",
                createdAt: data.created_at || "",
                updatedAt: data.updated_at || "",
                pushedAt: data.pushed_at || "",
                defaultBranch: data.default_branch || "main",
                provider: "github",
            });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Unknown GitHub error";
            return JSON.stringify({
                success: false,
                error: message,
                provider: "github",
            });
        }
    },
});
exports.githubGetReadmeTool = new tools_1.DynamicStructuredTool({
    name: "github_get_readme",
    description: "Fetches and decodes the README file of a GitHub repository. Returns the raw markdown content.",
    schema: zod_1.z.object({
        owner: zod_1.z.string().describe("Repository owner"),
        repo: zod_1.z.string().describe("Repository name"),
    }),
    func: async ({ owner, repo }) => {
        try {
            const data = (await githubFetch(`/repos/${owner}/${repo}/readme`));
            let content = "";
            if (data.content && data.encoding === "base64") {
                content = Buffer.from(data.content, "base64").toString("utf-8");
            }
            else if (data.content) {
                content = data.content;
            }
            return JSON.stringify({
                success: true,
                name: data.name || "README.md",
                content: content.substring(0, 10000),
                truncated: content.length > 10000,
                provider: "github",
            });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Unknown GitHub error";
            return JSON.stringify({
                success: false,
                error: message,
                provider: "github",
            });
        }
    },
});
exports.githubGetContentsTool = new tools_1.DynamicStructuredTool({
    name: "github_get_contents",
    description: "Fetches specific file contents (e.g., package.json, requirements.txt, docs) from a repository.",
    schema: zod_1.z.object({
        owner: zod_1.z.string().describe("Repository owner"),
        repo: zod_1.z.string().describe("Repository name"),
        path: zod_1.z.string().describe("File path in the repository"),
    }),
    func: async ({ owner, repo, path }) => {
        try {
            const data = (await githubFetch(`/repos/${owner}/${repo}/contents/${path}`));
            let content = "";
            if (data.content && data.encoding === "base64") {
                content = Buffer.from(data.content, "base64").toString("utf-8");
            }
            else if (data.content) {
                content = data.content;
            }
            return JSON.stringify({
                success: true,
                name: data.name || path,
                type: data.type || "file",
                content: content.substring(0, 5000),
                truncated: content.length > 5000,
                provider: "github",
            });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Unknown GitHub error";
            return JSON.stringify({
                success: false,
                error: message,
                provider: "github",
            });
        }
    },
});
//# sourceMappingURL=githubTools.js.map