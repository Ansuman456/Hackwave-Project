import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { githubFetch } from "./githubTools";

export const githubGetUserTool = new DynamicStructuredTool({
  name: "github_get_user",
  description:
    "Fetches a GitHub user's public profile including name, bio, public repo count, followers, and location.",
  schema: z.object({
    username: z.string().describe("GitHub username"),
  }),
  func: async ({ username }) => {
    try {
      const data = (await githubFetch(`/users/${username}`)) as {
        login?: string;
        name?: string;
        bio?: string;
        public_repos?: number;
        followers?: number;
        following?: number;
        location?: string;
        html_url?: string;
        created_at?: string;
      };

      return JSON.stringify({
        success: true,
        username: data.login || username,
        name: data.name || "",
        bio: data.bio || "",
        publicRepos: data.public_repos || 0,
        followers: data.followers || 0,
        following: data.following || 0,
        location: data.location || "",
        profileUrl: data.html_url || "",
        createdAt: data.created_at || "",
        provider: "github",
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown GitHub error";
      return JSON.stringify({
        success: false,
        error: message,
        username,
        provider: "github",
      });
    }
  },
});

export const githubListUserRepositoriesTool = new DynamicStructuredTool({
  name: "github_list_user_repositories",
  description:
    "Lists a GitHub user's public repositories with metadata (name, description, language, topics, stars, fork status, activity dates).",
  schema: z.object({
    username: z.string().describe("GitHub username"),
    perPage: z
      .number()
      .min(1)
      .max(100)
      .default(100)
      .describe("Repositories per page (max 100)"),
  }),
  func: async ({ username, perPage }) => {
    try {
      const data = (await githubFetch(
        `/users/${username}/repos?per_page=${perPage}&sort=updated`
      )) as Array<{
        name?: string;
        full_name?: string;
        html_url?: string;
        description?: string;
        language?: string;
        topics?: string[];
        stargazers_count?: number;
        forks_count?: number;
        fork?: boolean;
        created_at?: string;
        updated_at?: string;
        pushed_at?: string;
      }>;

      const repos = (data || []).map((r) => ({
        name: r.name || "",
        fullName: r.full_name || "",
        url: r.html_url || "",
        description: r.description || "",
        language: r.language || "",
        topics: r.topics || [],
        stars: r.stargazers_count || 0,
        forks: r.forks_count || 0,
        isFork: r.fork || false,
        createdAt: r.created_at || "",
        updatedAt: r.updated_at || "",
        pushedAt: r.pushed_at || "",
      }));

      return JSON.stringify({
        success: true,
        username,
        totalCount: repos.length,
        repos,
        provider: "github",
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown GitHub error";
      return JSON.stringify({
        success: false,
        error: message,
        username,
        repos: [],
        provider: "github",
      });
    }
  },
});

export const githubGetLanguagesTool = new DynamicStructuredTool({
  name: "github_get_languages",
  description:
    "Fetches the programming languages used in a repository with byte counts. Strong evidence of demonstrated technology usage.",
  schema: z.object({
    owner: z.string().describe("Repository owner"),
    repo: z.string().describe("Repository name"),
  }),
  func: async ({ owner, repo }) => {
    try {
      const data = (await githubFetch(
        `/repos/${owner}/${repo}/languages`
      )) as Record<string, number>;

      const languages = Object.entries(data || {}).map(([name, bytes]) => ({
        name,
        bytes,
      }));

      return JSON.stringify({
        success: true,
        owner,
        repo,
        languages,
        provider: "github",
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown GitHub error";
      return JSON.stringify({
        success: false,
        error: message,
        owner,
        repo,
        languages: [],
        provider: "github",
      });
    }
  },
});

export const githubGetCommitsTool = new DynamicStructuredTool({
  name: "github_get_commits",
  description:
    "Fetches recent commit history for a repository to assess contribution activity and recency.",
  schema: z.object({
    owner: z.string().describe("Repository owner"),
    repo: z.string().describe("Repository name"),
    perPage: z.number().min(1).max(100).default(30).describe("Commits to fetch"),
  }),
  func: async ({ owner, repo, perPage }) => {
    try {
      const data = (await githubFetch(
        `/repos/${owner}/${repo}/commits?per_page=${perPage}`
      )) as Array<{
        sha?: string;
        commit?: {
          author?: { name?: string; date?: string };
          message?: string;
        };
      }>;

      const commits = (data || []).map((c) => ({
        sha: c.sha || "",
        date: c.commit?.author?.date || "",
        message: (c.commit?.message || "").substring(0, 200),
      }));

      return JSON.stringify({
        success: true,
        owner,
        repo,
        commitCount: commits.length,
        latestCommitDate: commits[0]?.date || "",
        commits,
        provider: "github",
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown GitHub error";
      return JSON.stringify({
        success: false,
        error: message,
        owner,
        repo,
        commits: [],
        provider: "github",
      });
    }
  },
});
