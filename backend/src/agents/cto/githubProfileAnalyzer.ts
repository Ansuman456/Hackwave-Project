import { getConfig } from "../../config/env";
import { emitEvent } from "../../utils/sseStreamer";

export interface GithubProfileData {
  githubProfileUrl: string;
  username: string;
  role?: string;
  displayName: string;
  bio: string;
  publicRepos: number;
  followers: number;
  topLanguages: string[];
  topRepositories: Array<{
    name: string;
    description: string;
    stars: number;
    language: string;
    topics: string[];
    url: string;
  }>;
  contributionSummary: string;
  skillsFromRepos: string[];
}

async function githubFetch(endpoint: string, useAuth = true): Promise<any> {
  const config = getConfig();
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
  };
  if (useAuth && config.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${config.GITHUB_TOKEN}`;
  }

  const response = await fetch(`https://api.github.com${endpoint}`, {
    headers,
  });

  // Invalid/expired token -> retry unauthenticated (lower rate limit, but still works)
  if (response.status === 401 && useAuth && config.GITHUB_TOKEN) {
    return githubFetch(endpoint, false);
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`GitHub API ${response.status}: ${errorText}`);
  }

  return response.json();
}

export async function analyzeGithubProfiles(
  projectId: string,
  githubLinks: Array<{ githubProfileUrl: string; username: string; role?: string }>
): Promise<GithubProfileData[]> {
  if (githubLinks.length === 0) return [];

  emitEvent(
    projectId,
    "cto",
    "agent_started",
    `Analyzing ${githubLinks.length} GitHub profiles for team capabilities`
  );

  const results: GithubProfileData[] = [];

  for (const link of githubLinks) {
    try {
      const profile = await fetchAndAnalyzeProfile(link.username);
      if (profile) {
        profile.githubProfileUrl = link.githubProfileUrl;
        profile.role = link.role;
        results.push(profile);
      }
    } catch (err) {
      console.error(`[CTO_GITHUB] Failed to analyze ${link.username}:`, err);
    }
  }

  if (results.length > 0) {
    emitEvent(
      projectId,
      "cto",
      "agent_started",
      `GitHub analysis complete: ${results.length} profiles analyzed, ${results.reduce((sum, p) => sum + p.topRepositories.length, 0)} repos scanned`
    );
  }

  return results;
}

async function fetchAndAnalyzeProfile(
  username: string
): Promise<GithubProfileData | null> {
  try {
    const user = await githubFetch(`/users/${username}`);

    const repos = await githubFetch(
      `/users/${username}/repos?sort=stars&per_page=30&direction=desc`
    );

    const topRepos = (repos || [])
      .filter((r: any) => !r.fork)
      .slice(0, 10)
      .map((r: any) => ({
        name: r.name || "",
        description: r.description || "",
        stars: r.stargazers_count || 0,
        language: r.language || "Unknown",
        topics: r.topics || [],
        url: r.html_url || "",
      }));

    const langMap = new Map<string, number>();
    for (const repo of topRepos) {
      if (repo.language && repo.language !== "Unknown") {
        langMap.set(repo.language, (langMap.get(repo.language) || 0) + 1);
      }
    }

    const topLanguages = Array.from(langMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([lang]) => lang);

    const skillsFromRepos = extractSkillsFromRepos(topRepos);

    return {
      githubProfileUrl: `https://github.com/${username}`,
      username,
      displayName: user.name || username,
      bio: user.bio || "",
      publicRepos: user.public_repos || 0,
      followers: user.followers || 0,
      topLanguages,
      topRepositories: topRepos,
      contributionSummary: `${user.public_repos || 0} public repos, ${user.followers || 0} followers`,
      skillsFromRepos,
    };
  } catch (err) {
    console.error(`[CTO_GITHUB] Error fetching profile for ${username}:`, err);
    return null;
  }
}

function extractSkillsFromRepos(
  repos: Array<{ name: string; description: string; language: string; topics: string[] }>
): string[] {
  const skills = new Set<string>();

  for (const repo of repos) {
    if (repo.language) skills.add(repo.language);
    for (const topic of repo.topics) {
      skills.add(topic);
    }

    const desc = (repo.description || "").toLowerCase();
    const techKeywords = [
      "react", "vue", "angular", "nextjs", "nuxt", "svelte",
      "node", "express", "fastapi", "django", "flask", "spring",
      "typescript", "javascript", "python", "java", "go", "rust",
      "mongodb", "postgres", "mysql", "redis", "firebase", "supabase",
      "docker", "kubernetes", "aws", "gcp", "azure", "vercel",
      "tensorflow", "pytorch", "llm", "openai", "gemini",
      "graphql", "rest", "grpc",
      "tailwind", "bootstrap", "material",
      "prisma", "sequelize", "mongoose",
      "jwt", "oauth", "passport",
      "webpack", "vite", "esbuild",
      "jest", "mocha", "cypress",
    ];

    for (const kw of techKeywords) {
      if (desc.includes(kw) || repo.name.toLowerCase().includes(kw)) {
        skills.add(kw);
      }
    }
  }

  return Array.from(skills);
}
