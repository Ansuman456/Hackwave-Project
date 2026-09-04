import {
  githubListUserRepositoriesTool,
  githubGetLanguagesTool,
  githubGetCommitsTool,
} from "../../tools/github/githubUserTools";
import {
  githubGetReadmeTool,
  githubGetContentsTool,
} from "../../tools/github/githubTools";
import {
  findCachedGitHubProfile,
  cacheGitHubProfile,
} from "../../models/GitHubProfileCache.model";
import { GITHUB_FILTER, GITHUB_AGENT } from "./skill.config";
import { normalizeSkill } from "./skillNormalizer";
import { EvidenceEntry } from "./types";
import { callStructured } from "./llm";
import {
  GITHUB_INTERPRET_SYSTEM_PROMPT,
  GITHUB_INTERPRET_USER_TEMPLATE,
  GithubProjectInterpretationSchema,
} from "../../prompts/skillAnalyzer";

interface RepoMeta {
  name: string;
  fullName: string;
  url: string;
  description: string;
  language: string;
  topics: string[];
  stars: number;
  isFork: boolean;
  pushedAt: string;
}

interface RepoDetail {
  readme: string;
  languages: Array<{ name: string; bytes: number }>;
  dependencyContent: string;
  dependencyFile: string;
  latestCommitDate: string;
  commitCount: number;
}

export interface GitHubAnalysis {
  githubEvidence: EvidenceEntry[];
  repoCount: number;
  reposAnalyzed: number;
  rateLimited: boolean;
}

function parseJson(value: string): any {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;

  const worker = async (): Promise<void> => {
    while (next < items.length) {
      const idx = next++;
      try {
        results[idx] = await fn(items[idx]);
      } catch {
        results[idx] = undefined as unknown as R;
      }
    }
  };

  const workers = Array.from({ length: Math.min(limit, items.length) }, worker);
  return Promise.all(workers).then(() => results.filter((r) => r !== undefined));
}

const DEPENDENCY_FILES = [
  "package.json",
  "requirements.txt",
  "pyproject.toml",
  "go.mod",
  "Cargo.toml",
  "pom.xml",
];

function pickDependencyFile(language: string): string | null {
  const lang = (language || "").toLowerCase();
  if (lang === "javascript" || lang === "typescript" || lang === "js") return "package.json";
  if (lang === "python") return "requirements.txt";
  if (lang === "go") return "go.mod";
  if (lang === "rust") return "Cargo.toml";
  if (lang === "java") return "pom.xml";
  return null;
}

function extractDependencyTech(content: string, filename: string): string[] {
  if (!content) return [];
  const techs: string[] = [];

  if (filename === "package.json") {
    try {
      const pkg = JSON.parse(content);
      for (const key of [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.devDependencies || {})]) {
        techs.push(key);
      }
    } catch {
      // fallthrough
    }
  } else if (filename === "requirements.txt") {
    for (const line of content.split("\n")) {
      const cleaned = line.split("==")[0].split(">=")[0].split("<=")[0].trim();
      if (cleaned && /^[a-zA-Z0-9._-]+$/.test(cleaned)) techs.push(cleaned);
    }
  } else if (filename === "go.mod") {
    const matches = content.match(/^\s*([a-zA-Z0-9./_-]+)\s+v?[0-9]/gm) || [];
    for (const m of matches) {
      const name = m.trim().split(/\s+/)[0];
      if (name) techs.push(name.split("/").slice(-1)[0]);
    }
  } else if (filename === "Cargo.toml") {
    const matches = content.match(/^([a-zA-Z0-9_-]+)\s*=/gm) || [];
    for (const m of matches) techs.push(m.replace("=", "").trim());
  } else if (filename === "pom.xml") {
    const matches = content.match(/<artifactId>([^<]+)<\/artifactId>/g) || [];
    for (const m of matches) {
      const name = m.replace(/<\/?artifactId>/g, "");
      if (name && !name.includes("${")) techs.push(name);
    }
  }

  return techs;
}

function repoRelevance(repo: RepoMeta, projectKeywords: string[]): number {
  let score = 0;
  const haystack = [
    repo.name,
    repo.description,
    repo.language,
    ...repo.topics,
  ]
    .join(" ")
    .toLowerCase();

  for (const kw of projectKeywords) {
    if (haystack.includes(kw)) score += 0.25;
  }

  // Recent activity
  if (repo.pushedAt) {
    const pushed = new Date(repo.pushedAt).getTime();
    const months = (Date.now() - pushed) / (1000 * 60 * 60 * 24 * 30);
    if (months < GITHUB_FILTER.minRecentActivityMonths) score += 0.2;
  }

  // Evidence quality
  if (repo.description && repo.description.length > 10) score += 0.1;
  if (!repo.isFork) score += 0.1;
  if (repo.topics.length >= 3) score += 0.1;

  return score;
}

async function fetchRepoDetail(owner: string, repo: string, language: string): Promise<RepoDetail | null> {
  const detail: RepoDetail = {
    readme: "",
    languages: [],
    dependencyContent: "",
    dependencyFile: "",
    latestCommitDate: "",
    commitCount: 0,
  };

  try {
    const readmeResult = parseJson(await githubGetReadmeTool.invoke({ owner, repo }));
    if (readmeResult?.success) detail.readme = readmeResult.content || "";
  } catch {
    /* ignore */
  }

  try {
    const langResult = parseJson(await githubGetLanguagesTool.invoke({ owner, repo }));
    if (langResult?.success) detail.languages = langResult.languages || [];
  } catch {
    /* ignore */
  }

  try {
    const commitResult = parseJson(await githubGetCommitsTool.invoke({ owner, repo, perPage: 20 }));
    if (commitResult?.success) {
      detail.latestCommitDate = commitResult.latestCommitDate || "";
      detail.commitCount = commitResult.commitCount || 0;
    }
  } catch {
    /* ignore */
  }

  const depFile = pickDependencyFile(language);
  if (depFile) {
    try {
      const contentResult = parseJson(
        await githubGetContentsTool.invoke({ owner, repo, path: depFile })
      );
      if (contentResult?.success && contentResult.content) {
        detail.dependencyContent = contentResult.content;
        detail.dependencyFile = depFile;
      }
    } catch {
      /* ignore */
    }
  }

  return detail;
}

export async function analyzeGithub(
  username: string,
  projectContext: string,
  projectId: string
): Promise<GitHubAnalysis> {
  const githubEvidence: EvidenceEntry[] = [];
  const projectKeywords = projectContext
    .toLowerCase()
    .split(/[^a-z0-9.#+/ -]+/)
    .filter((k) => k.length > 2)
    .slice(0, 30);

  let rateLimited = false;
  let repoCount = 0;
  let reposAnalyzed = 0;

  // 1. Try cache
  const cached = await findCachedGitHubProfile(username);

  let repos: RepoMeta[] = [];
  const repoDetailsCache: Record<string, RepoDetail> = {};

  if (cached && cached.repos && cached.repos.length > 0) {
    repos = cached.repos as RepoMeta[];
    Object.assign(repoDetailsCache, cached.repoDetails || {});
  } else {
    const listResult = parseJson(
      await githubListUserRepositoriesTool.invoke({ username, perPage: 100 })
    );

    if (!listResult?.success) {
      // Rate limited or user not found — mark and return empty
      rateLimited = true;
      return { githubEvidence, repoCount: 0, reposAnalyzed: 0, rateLimited };
    }

    repos = (listResult.repos || [])
      .filter((r: RepoMeta) => !r.isFork)
      .map((r: any) => ({
        name: r.name,
        fullName: r.fullName,
        url: r.url,
        description: r.description,
        language: r.language,
        topics: r.topics,
        stars: r.stars,
        isFork: r.isFork,
        pushedAt: r.pushedAt,
      }));

    repoCount = repos.length;
  }

  // 2. Rank repositories by relevance
  const ranked = repos
    .map((r) => ({ repo: r, relevance: repoRelevance(r, projectKeywords) }))
    .sort((a, b) => b.relevance - a.relevance);

  const topRepos = ranked
    .slice(0, GITHUB_FILTER.strongestForDeepAnalysis)
    .map((r) => r.repo);

  // 3. Deeply inspect the strongest repositories (bounded concurrency)
  const owner = username;
  const details = await mapWithConcurrency(
    topRepos,
    GITHUB_AGENT.concurrency,
    async (repo) => {
      const key = repo.fullName;
      if (repoDetailsCache[key]) return { repo, detail: repoDetailsCache[key], key };
      const detail = await fetchRepoDetail(owner, repo.name, repo.language);
      if (detail) repoDetailsCache[key] = detail;
      return { repo, detail, key };
    }
  );

  reposAnalyzed = details.filter((d) => d.detail).length;

  // 4. Build evidence deterministically from repos + details
  for (const { repo, detail } of details) {
    if (!detail) continue;

    // Repository-level evidence
    if (repo.description && repo.description.length > 10) {
      const normalized = normalizeSkill(repo.name);
      if (normalized) {
        githubEvidence.push({
          skill: normalized,
          source: "github_repository",
          referenceId: repo.fullName,
          description: `Built "${repo.name}" — ${repo.description.substring(0, 120)}`,
          strength: 0.6,
        });
      }
    }

    // Language evidence
    for (const lang of detail.languages) {
      const normalized = normalizeSkill(lang.name);
      if (!normalized) continue;
      githubEvidence.push({
        skill: normalized,
        source: "github_language",
        referenceId: repo.fullName,
        description: `Language used in ${repo.fullName}`,
        strength: 0.6,
      });
    }

    // Dependency evidence
    const depTechs = extractDependencyTech(detail.dependencyContent, detail.dependencyFile);
    for (const tech of depTechs) {
      const normalized = normalizeSkill(tech);
      if (!normalized) continue;
      githubEvidence.push({
        skill: normalized,
        source: "github_dependency",
        referenceId: repo.fullName,
        description: `Dependency in ${repo.fullName}`,
        strength: 0.7,
      });
    }

    // Commit evidence (recent activity)
    if (detail.commitCount > 0) {
      const normalized = normalizeSkill(repo.language);
      if (normalized) {
        githubEvidence.push({
          skill: normalized,
          source: "github_commits",
          referenceId: repo.fullName,
          description: `${detail.commitCount} recent commits in ${repo.fullName}`,
          strength: 0.5,
        });
      }
    }
  }

  // 5. LLM interpretation of READMEs (top 3) for capabilities
  const llmRepos = details.slice(0, 3).filter((d) => d.detail && d.detail.readme.length > 50);
  for (const { repo, detail } of llmRepos) {
    if (!detail) continue;
    const metadata = `Language: ${repo.language}. Topics: ${repo.topics.join(", ")}. Description: ${repo.description}`;
    const dependencies = detail.dependencyContent
      ? `${detail.dependencyFile}:\n${detail.dependencyContent.substring(0, 1500)}`
      : "";

    const interpreted = await callStructured<{
      demonstratedTechnologies: string[];
      demonstratedCapabilities: string[];
    }>(
      "research",
      GITHUB_INTERPRET_SYSTEM_PROMPT,
      GITHUB_INTERPRET_USER_TEMPLATE(repo.fullName, metadata, detail.readme.substring(0, 4000), dependencies),
      GithubProjectInterpretationSchema,
      "GithubInterpretation"
    );

    if (interpreted) {
      for (const tech of interpreted.demonstratedTechnologies || []) {
        const normalized = normalizeSkill(tech);
        if (!normalized) continue;
        githubEvidence.push({
          skill: normalized,
          source: "github_readme",
          referenceId: repo.fullName,
          description: `README demonstrates ${tech} in ${repo.fullName}`,
          strength: 0.7,
        });
      }
      for (const cap of interpreted.demonstratedCapabilities || []) {
        const normalized = normalizeSkill(cap);
        if (!normalized) continue;
        githubEvidence.push({
          skill: normalized,
          source: "github_readme",
          referenceId: repo.fullName,
          description: `README demonstrates capability "${cap}" in ${repo.fullName}`,
          strength: 0.7,
        });
      }
    }
  }

  // 6. Cache for reuse
  if (!cached && repos.length > 0) {
    await cacheGitHubProfile(username, {}, repos, repoDetailsCache).catch(() => {});
  }

  return { githubEvidence, repoCount, reposAnalyzed, rateLimited };
}
