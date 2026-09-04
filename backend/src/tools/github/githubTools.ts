import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { getConfig } from "../../config/env";

export async function githubFetch(endpoint: string): Promise<unknown> {
  const config = getConfig();
  const headers: Record<string, string> = {
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

export const githubSearchRepositoriesTool = new DynamicStructuredTool({
  name: "github_search_repositories",
  description:
    "Searches GitHub for open-source repositories matching keywords. Returns repository name, owner, description, stars, forks, topics, and language.",
  schema: z.object({
    query: z
      .string()
      .describe("Search query (e.g., 'food waste prediction python')"),
    perPage: z
      .number()
      .min(1)
      .max(30)
      .default(10)
      .describe("Results per page (max 30)"),
    page: z.number().min(1).default(1).describe("Page number"),
  }),
  func: async ({ query, perPage, page }) => {
    try {
      const endpoint = `/search/repositories?q=${encodeURIComponent(query)}&per_page=${perPage}&page=${page}&sort=stars&order=desc`;
      const data = (await githubFetch(endpoint)) as {
        total_count?: number;
        items?: Array<{
          full_name?: string;
          html_url?: string;
          description?: string;
          stargazers_count?: number;
          forks_count?: number;
          topics?: string[];
          language?: string;
          created_at?: string;
          updated_at?: string;
          owner?: { login?: string };
          name?: string;
        }>;
      };

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
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown GitHub error";
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

export const githubGetRepositoryTool = new DynamicStructuredTool({
  name: "github_get_repository",
  description:
    "Fetches detailed metadata for a specific GitHub repository including description, languages, topics, stars, forks, license, and dates.",
  schema: z.object({
    owner: z.string().describe("Repository owner (username or org)"),
    repo: z.string().describe("Repository name"),
  }),
  func: async ({ owner, repo }) => {
    try {
      const data = (await githubFetch(`/repos/${owner}/${repo}`)) as {
        full_name?: string;
        html_url?: string;
        description?: string;
        stargazers_count?: number;
        forks_count?: number;
        topics?: string[];
        language?: string;
        languages?: Record<string, number>;
        license?: { spdx_id?: string };
        created_at?: string;
        updated_at?: string;
        pushed_at?: string;
        default_branch?: string;
      };

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
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown GitHub error";
      return JSON.stringify({
        success: false,
        error: message,
        provider: "github",
      });
    }
  },
});

export const githubGetReadmeTool = new DynamicStructuredTool({
  name: "github_get_readme",
  description:
    "Fetches and decodes the README file of a GitHub repository. Returns the raw markdown content.",
  schema: z.object({
    owner: z.string().describe("Repository owner"),
    repo: z.string().describe("Repository name"),
  }),
  func: async ({ owner, repo }) => {
    try {
      const data = (await githubFetch(
        `/repos/${owner}/${repo}/readme`
      )) as {
        content?: string;
        encoding?: string;
        name?: string;
      };

      let content = "";
      if (data.content && data.encoding === "base64") {
        content = Buffer.from(data.content, "base64").toString("utf-8");
      } else if (data.content) {
        content = data.content;
      }

      return JSON.stringify({
        success: true,
        name: data.name || "README.md",
        content: content.substring(0, 10000),
        truncated: content.length > 10000,
        provider: "github",
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown GitHub error";
      return JSON.stringify({
        success: false,
        error: message,
        provider: "github",
      });
    }
  },
});

export const githubGetContentsTool = new DynamicStructuredTool({
  name: "github_get_contents",
  description:
    "Fetches specific file contents (e.g., package.json, requirements.txt, docs) from a repository.",
  schema: z.object({
    owner: z.string().describe("Repository owner"),
    repo: z.string().describe("Repository name"),
    path: z.string().describe("File path in the repository"),
  }),
  func: async ({ owner, repo, path }) => {
    try {
      const data = (await githubFetch(
        `/repos/${owner}/${repo}/contents/${path}`
      )) as {
        content?: string;
        encoding?: string;
        name?: string;
        type?: string;
      };

      let content = "";
      if (data.content && data.encoding === "base64") {
        content = Buffer.from(data.content, "base64").toString("utf-8");
      } else if (data.content) {
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
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown GitHub error";
      return JSON.stringify({
        success: false,
        error: message,
        provider: "github",
      });
    }
  },
});
