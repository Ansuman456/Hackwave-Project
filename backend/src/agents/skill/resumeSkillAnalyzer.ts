import { ResumeProject, MemberSkillProfile } from "../../graph/state";
import { callStructured } from "./llm";
import {
  RESUME_PROJECT_SYSTEM_PROMPT,
  RESUME_PROJECT_USER_TEMPLATE,
  ResumeProjectExtractionSchema,
} from "../../prompts/skillAnalyzer";
import { normalizeSkill } from "./skillNormalizer";
import { EvidenceEntry } from "./types";

export interface MemberInput {
  memberId: string;
  name: string;
  resumeText?: string;
  parsedSkills: string[];
  primaryRole: string;
  proficiencyLevels: Record<string, string>;
  resumeSnippet: string;
  githubUsername?: string;
  yearsExperience?: number;
  portfolioUrl?: string;
}

export interface ResumeAnalysis {
  resumeProjects: ResumeProject[];
  resumeEvidence: EvidenceEntry[];
}

function proficiencyStrength(level?: string): number {
  switch (level) {
    case "expert":
      return 0.9;
    case "intermediate":
      return 0.65;
    case "beginner":
      return 0.4;
    default:
      return 0.5;
  }
}

export async function analyzeResume(member: MemberInput): Promise<ResumeAnalysis> {
  const resumeEvidence: EvidenceEntry[] = [];

  // 1. Declared skills -> resume_skill evidence (claimed, low-medium weight)
  for (const skill of member.parsedSkills || []) {
    const normalized = normalizeSkill(skill);
    if (!normalized) continue;
    resumeEvidence.push({
      skill: normalized,
      source: "resume_skill",
      referenceId: `resume_${member.memberId}`,
      description: `Resume lists "${skill}" as a skill`,
      strength: proficiencyStrength(
        member.proficiencyLevels?.[skill] || member.proficiencyLevels?.[normalized]
      ),
    });
  }

  // 2. LLM extraction of concrete projects -> resume_project evidence
  let resumeProjects: ResumeProject[] = [];
  if (member.resumeText && member.resumeText.trim().length > 20) {
    const extracted = await callStructured<{ projects: ResumeProject[] }>(
      "strategic_analysis",
      RESUME_PROJECT_SYSTEM_PROMPT,
      RESUME_PROJECT_USER_TEMPLATE(member.memberId, member.name, member.resumeText, member.parsedSkills),
      ResumeProjectExtractionSchema,
      "ResumeProjects"
    );
    resumeProjects = extracted?.projects || [];
  }

  // 3. Build resume_project evidence from projects
  for (const project of resumeProjects) {
    for (const tech of project.technologies || []) {
      const normalized = normalizeSkill(tech);
      if (!normalized) continue;
      resumeEvidence.push({
        skill: normalized,
        source: "resume_project",
        referenceId: project.name,
        description: `Used in project "${project.name}"`,
        strength: 0.8,
      });
    }
    for (const cap of project.relevantCapabilities || []) {
      const normalized = normalizeSkill(cap);
      if (!normalized) continue;
      resumeEvidence.push({
        skill: normalized,
        source: "resume_project",
        referenceId: project.name,
        description: `Demonstrated capability in project "${project.name}"`,
        strength: 0.7,
      });
    }
  }

  return { resumeProjects, resumeEvidence };
}

export function buildBaseProfile(
  member: MemberInput,
  resumeAnalysis: ResumeAnalysis
): MemberSkillProfile {
  return {
    memberId: member.memberId,
    memberName: member.name,
    primaryRole: member.primaryRole,
    githubUsername: member.githubUsername,
    portfolioUrl: member.portfolioUrl,
    yearsExperience: member.yearsExperience,
    declaredSkills: member.parsedSkills || [],
    resumeProjects: resumeAnalysis.resumeProjects,
    skillAssessments: [],
    strongestSkills: [],
    secondarySkills: [],
    skillGapAreas: [],
  };
}
