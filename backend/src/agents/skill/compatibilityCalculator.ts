import {
  ProjectTask,
  MemberSkillProfile,
  CompatibilityScore,
  SkillAssessment,
} from "../../graph/state";
import { COMPATIBILITY_WEIGHTS } from "./skill.config";
import { normalizeSkill, skillCategory } from "./skillNormalizer";

const IMPORTANCE_WEIGHT: Record<string, number> = {
  critical: 1.0,
  high: 0.8,
  medium: 0.6,
  low: 0.4,
};

function findAssessment(profile: MemberSkillProfile, skill: string): SkillAssessment | undefined {
  const normalized = normalizeSkill(skill);
  return profile.skillAssessments.find((a) => a.normalizedSkill === normalized);
}

function skillMatchScore(task: ProjectTask, profile: MemberSkillProfile): number {
  const required = task.requiredSkills;
  if (required.length === 0) return 0.5;

  let weightedSum = 0;
  let totalWeight = 0;

  for (const req of required) {
    const w = IMPORTANCE_WEIGHT[req.importance] || 0.6;
    const assessment = findAssessment(profile, req.skill);

    let match: number;
    if (!assessment || assessment.score === 0) {
      match = 0;
    } else if (assessment.score >= req.requiredLevel) {
      match = 1;
    } else {
      match = assessment.score / req.requiredLevel;
    }

    weightedSum += match * w;
    totalWeight += w;
  }

  return totalWeight > 0 ? weightedSum / totalWeight : 0;
}

function experienceScore(task: ProjectTask, profile: MemberSkillProfile): number {
  const required = task.requiredSkills;
  if (required.length === 0) return 0.3;

  let totalEvidence = 0;
  for (const req of required) {
    const assessment = findAssessment(profile, req.skill);
    if (assessment) totalEvidence += assessment.evidence.length;
  }

  return Math.min(1, totalEvidence / (required.length * 3));
}

function projectRelevanceScore(task: ProjectTask, profile: MemberSkillProfile): number {
  const required = task.requiredSkills;
  if (required.length === 0) return 0.3;

  const strongSet = new Set(profile.strongestSkills.map(normalizeSkill));
  const secondarySet = new Set(profile.secondarySkills.map(normalizeSkill));

  let hits = 0;
  for (const req of required) {
    const n = normalizeSkill(req.skill);
    if (strongSet.has(n)) hits += 1;
    else if (secondarySet.has(n)) hits += 0.5;
  }

  return Math.min(1, hits / required.length);
}

function confidenceScore(task: ProjectTask, profile: MemberSkillProfile): number {
  const required = task.requiredSkills;
  if (required.length === 0) return 0.3;

  let totalConf = 0;
  let count = 0;
  for (const req of required) {
    const assessment = findAssessment(profile, req.skill);
    if (assessment) {
      totalConf += assessment.confidence;
      count++;
    }
  }

  return count > 0 ? totalConf / count : 0.15;
}

const ROLE_TO_CATEGORY: Record<string, string[]> = {
  "frontend developer": ["frontend", "design"],
  "backend developer": ["backend", "database"],
  "fullstack engineer": ["frontend", "backend", "database"],
  "full-stack developer": ["frontend", "backend", "database"],
  "ml engineer": ["ai", "ml"],
  "ai engineer": ["ai", "ml"],
  "ml/ai engineer": ["ai", "ml"],
  "data scientist": ["ai", "ml", "database"],
  "devops engineer": ["devops"],
  "ui/ux designer": ["design"],
  "mobile developer": ["mobile"],
  "cloud engineer": ["devops", "backend"],
  "research scientist": ["ai", "ml"],
};

function roleCoherenceScore(task: ProjectTask, profile: MemberSkillProfile): number {
  const role = profile.primaryRole.toLowerCase();
  const taskCat = task.category;

  for (const [knownRole, categories] of Object.entries(ROLE_TO_CATEGORY)) {
    if (role.includes(knownRole)) {
      return categories.includes(taskCat) ? 1 : 0.4;
    }
  }
  return 0.5;
}

export function calculateCompatibility(
  tasks: ProjectTask[],
  profiles: MemberSkillProfile[]
): CompatibilityScore[] {
  const matrix: CompatibilityScore[] = [];

  for (const task of tasks) {
    for (const profile of profiles) {
      const sm = skillMatchScore(task, profile);
      const exp = experienceScore(task, profile);
      const pr = projectRelevanceScore(task, profile);
      const conf = confidenceScore(task, profile);
      const rc = roleCoherenceScore(task, profile);
      const availability = 1;

      const finalScore =
        sm * COMPATIBILITY_WEIGHTS.skillMatch +
        exp * COMPATIBILITY_WEIGHTS.demonstratedExperience +
        pr * COMPATIBILITY_WEIGHTS.projectRelevance +
        conf * COMPATIBILITY_WEIGHTS.confidence +
        availability * COMPATIBILITY_WEIGHTS.availability +
        rc * COMPATIBILITY_WEIGHTS.roleCoherence;

      const reasons: string[] = [];
      if (sm >= 0.8) reasons.push("Strong skill match");
      if (exp >= 0.6) reasons.push("Demonstrated experience on GitHub");
      if (pr >= 0.6) reasons.push("Relevant project experience");
      if (conf >= 0.6) reasons.push("High evidence confidence");
      if (rc >= 0.8) reasons.push("Role coherence");
      if (reasons.length === 0) reasons.push("Limited evidence for required skills");

      matrix.push({
        taskId: task.id,
        memberId: profile.memberId,
        skillMatchScore: round(sm),
        experienceScore: round(exp),
        projectRelevanceScore: round(pr),
        confidenceScore: round(conf),
        availabilityScore: availability,
        roleCoherenceScore: round(rc),
        finalScore: round(finalScore),
        reasons,
      });
    }
  }

  return matrix;
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}
