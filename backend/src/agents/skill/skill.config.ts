import { SkillEvidenceSource } from "../../graph/state";

// ============================================================
// AGENT 5 CONFIG — Skill graph & task allocation weights/budgets
// ============================================================

export const SKILL_WEIGHTS: Record<SkillEvidenceSource, number> = {
  resume_skill: 0.4,
  resume_project: 0.6,
  github_repository: 0.7,
  github_readme: 0.7,
  github_language: 0.65,
  github_dependency: 0.7,
  github_commits: 0.6,
};

// Compatibility score component weights (section 38 / 100)
export const COMPATIBILITY_WEIGHTS = {
  skillMatch: 0.35,
  demonstratedExperience: 0.25,
  projectRelevance: 0.15,
  confidence: 0.1,
  availability: 0.1,
  roleCoherence: 0.05,
};

// Assignment optimization objective weights (section 101)
export const ASSIGNMENT_WEIGHTS = {
  taskSkillMatch: 0.3,
  demonstratedExperience: 0.2,
  projectRelevance: 0.15,
  confidence: 0.1,
  availability: 0.1,
  roleCoherence: 0.05,
  teamBalance: 0.05,
  dependencyFit: 0.05,
};

// Skill level thresholds
export const SKILL_LEVEL_THRESHOLDS = {
  advanced: 8.5,
  strong: 7.0,
  intermediate: 5.5,
  basic: 4.0,
  beginner: 2.0,
};

// GitHub repository inspection funnel (section 11)
export const GITHUB_FILTER = {
  maxRepositoriesToConsider: 100,
  relevantAfterMetadataFilter: 20,
  strongestForDeepAnalysis: 8,
  minRecentActivityMonths: 12,
};

// Task decomposition bounds (section 89)
export const TASK_BOUNDS = {
  minTasks: 15,
  maxTasks: 40,
  defaultTasks: 25,
};

// Time budget allocation ratios (section 42) — must sum to 1.0
export const TIME_BUDGET_RATIOS = {
  development: 0.66,
  testing: 0.08,
  integration: 0.08,
  deployment: 0.04,
  presentation: 0.04,
  buffer: 0.1,
};

// Qualitative capacity when hackathon duration is unknown (section 43)
export const QUALITATIVE_HOURS = {
  small: 8,
  medium: 12,
  large: 16,
};

// Workload safety thresholds
export const WORKLOAD = {
  maxUtilization: 0.9,
  warnUtilization: 0.75,
  maxCriticalTasksPerMember: 3,
  maxOptimizationIterations: 3,
};

// Compatibility thresholds
export const COMPATIBILITY_THRESHOLDS = {
  unsuitable: 0.3,
  minimumAcceptable: 0.5,
};

// GitHub rate limiting / concurrency
export const GITHUB_AGENT = {
  concurrency: 2,
  maxReposDeepAnalyzed: 8,
  cacheTtlMs: 24 * 60 * 60 * 1000,
};
