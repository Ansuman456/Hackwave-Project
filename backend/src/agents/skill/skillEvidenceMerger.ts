import {
  SkillEvidence,
  SkillAssessment,
  MemberSkillProfile,
  ResumeProject,
} from "../../graph/state";
import { SKILL_WEIGHTS, SKILL_LEVEL_THRESHOLDS } from "./skill.config";
import { normalizeSkill } from "./skillNormalizer";
import { MemberInput } from "./resumeSkillAnalyzer";
import { EvidenceEntry } from "./types";

export interface MergedSkill {
  normalized: string;
  display: string;
  evidence: SkillEvidence[];
  claimedByResume: boolean;
  demonstratedOnGitHub: boolean;
}

export function mergeEvidence(
  resumeEvidence: EvidenceEntry[],
  githubEvidence: EvidenceEntry[]
): MergedSkill[] {
  const map = new Map<string, MergedSkill>();

  for (const entry of [...resumeEvidence, ...githubEvidence]) {
    const normalized = normalizeSkill(entry.skill);
    if (!normalized) continue;

    if (!map.has(normalized)) {
      map.set(normalized, {
        normalized,
        display: entry.skill,
        evidence: [],
        claimedByResume: false,
        demonstratedOnGitHub: false,
      });
    }

    const merged = map.get(normalized)!;
    merged.evidence.push({
      source: entry.source,
      referenceId: entry.referenceId,
      description: entry.description,
      strength: entry.strength,
    });

    if (entry.source === "resume_skill" || entry.source === "resume_project") {
      merged.claimedByResume = true;
    }
    if (entry.source.startsWith("github_")) {
      merged.demonstratedOnGitHub = true;
    }
  }

  return Array.from(map.values());
}

function scoreSkill(merged: MergedSkill): number {
  if (merged.evidence.length === 0) return 0;

  let weightedSum = 0;
  let totalWeight = 0;
  for (const ev of merged.evidence) {
    const w = SKILL_WEIGHTS[ev.source] || 0.4;
    weightedSum += w * ev.strength;
    totalWeight += w;
  }

  const base = totalWeight > 0 ? (weightedSum / totalWeight) * 10 : 0;

  let bonus = 0;
  if (merged.evidence.length >= 3) bonus += 0.5;
  if (merged.demonstratedOnGitHub) bonus += 0.5;
  if (merged.evidence.length >= 6) bonus += 0.5;

  return Math.min(10, Math.round((base + bonus) * 10) / 10);
}

function confidenceScore(merged: MergedSkill): number {
  const n = merged.evidence.length;
  let conf = 0.25 + n * 0.12;
  if (merged.demonstratedOnGitHub) conf += 0.2;
  if (merged.claimedByResume) conf += 0.05;
  return Math.min(1, Math.round(conf * 100) / 100);
}

function levelFromScore(score: number): SkillAssessment["level"] {
  if (score >= SKILL_LEVEL_THRESHOLDS.advanced) return "advanced";
  if (score >= SKILL_LEVEL_THRESHOLDS.strong) return "strong";
  if (score >= SKILL_LEVEL_THRESHOLDS.intermediate) return "intermediate";
  if (score >= SKILL_LEVEL_THRESHOLDS.basic) return "basic";
  if (score >= SKILL_LEVEL_THRESHOLDS.beginner) return "beginner";
  return "none";
}

function evidenceAgreement(merged: MergedSkill, score: number): SkillAssessment["evidenceAgreement"] {
  if (merged.claimedByResume && merged.demonstratedOnGitHub) {
    const resumeStrong = merged.evidence.some(
      (e) => (e.source === "resume_skill" || e.source === "resume_project") && e.strength >= 0.8
    );
    const githubWeak = merged.evidence.every(
      (e) => !e.source.startsWith("github_") || e.strength < 0.6
    );
    if (resumeStrong && githubWeak) return "conflicting";
    return score >= 7 ? "strong" : "moderate";
  }
  if (merged.demonstratedOnGitHub && !merged.claimedByResume) return "strong";
  if (merged.claimedByResume && !merged.demonstratedOnGitHub) return "weak";
  return "weak";
}

export function buildSkillAssessments(
  resumeEvidence: EvidenceEntry[],
  githubEvidence: EvidenceEntry[]
): SkillAssessment[] {
  const merged = mergeEvidence(resumeEvidence, githubEvidence);

  return merged
    .map((m) => {
      const score = scoreSkill(m);
      return {
        skill: m.display,
        normalizedSkill: m.normalized,
        score,
        level: levelFromScore(score),
        confidence: confidenceScore(m),
        evidence: m.evidence,
        claimedByResume: m.claimedByResume,
        demonstratedOnGitHub: m.demonstratedOnGitHub,
        evidenceAgreement: evidenceAgreement(m, score),
      };
    })
    .sort((a, b) => b.score - a.score);
}

export function buildMemberProfile(
  member: MemberInput,
  resumeProjects: ResumeProject[],
  resumeEvidence: EvidenceEntry[],
  githubEvidence: EvidenceEntry[]
): MemberSkillProfile {
  const assessments = buildSkillAssessments(resumeEvidence, githubEvidence);

  const strong = assessments.filter((a) => a.score >= 6.5);
  const moderate = assessments.filter((a) => a.score >= 4 && a.score < 6.5);
  const weak = assessments.filter((a) => a.score < 4);

  return {
    memberId: member.memberId,
    memberName: member.name,
    primaryRole: member.primaryRole,
    githubUsername: member.githubUsername,
    portfolioUrl: member.portfolioUrl,
    yearsExperience: member.yearsExperience,
    declaredSkills: member.parsedSkills || [],
    resumeProjects,
    skillAssessments: assessments,
    strongestSkills: strong.slice(0, 6).map((a) => a.normalizedSkill),
    secondarySkills: moderate.slice(0, 6).map((a) => a.normalizedSkill),
    skillGapAreas: weak.map((a) => a.normalizedSkill),
  };
}
