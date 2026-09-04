import {
  MemberSkillProfile,
  SkillGraph,
  SkillNode,
  MemberSkillEdge,
  TeamCapability,
} from "../../graph/state";
import { skillCategory } from "./skillNormalizer";

export function buildSkillGraph(profiles: MemberSkillProfile[]): SkillGraph {
  const skillNodeMap = new Map<string, SkillNode>();
  const skillMemberCount = new Map<string, number>();
  const edges: MemberSkillEdge[] = [];

  const categoryMembers = new Map<string, Map<string, number>>();

  for (const profile of profiles) {
    for (const assessment of profile.skillAssessments) {
      if (assessment.score < 3) continue;

      const name = assessment.normalizedSkill;
      const category = skillCategory(name);
      const skillId = `skill_${name.replace(/[^a-z0-9]+/g, "_")}`;

      if (!skillNodeMap.has(skillId)) {
        skillNodeMap.set(skillId, {
          id: skillId,
          name,
          category,
          teamCoverage: 0,
        });
      }
      skillMemberCount.set(skillId, (skillMemberCount.get(skillId) || 0) + 1);

      edges.push({
        memberId: profile.memberId,
        skillId,
        strength: assessment.score,
        confidence: assessment.confidence,
        evidenceCount: assessment.evidence.length,
        evidenceTypes: Array.from(
          new Set(assessment.evidence.map((e) => e.source))
        ),
      });

      // Track category coverage for team capabilities
      if (!categoryMembers.has(category)) {
        categoryMembers.set(category, new Map());
      }
      const catMap = categoryMembers.get(category)!;
      catMap.set(
        profile.memberId,
        Math.max(catMap.get(profile.memberId) || 0, assessment.score)
      );
    }
  }

  // Finalize skill nodes with team coverage (0-100)
  const skills: SkillNode[] = [];
  for (const [skillId, node] of skillNodeMap) {
    const count = skillMemberCount.get(skillId) || 0;
    const coverage = Math.min(100, Math.round((count / Math.max(profiles.length, 1)) * 100));
    skills.push({ ...node, teamCoverage: coverage });
  }
  skills.sort((a, b) => b.teamCoverage - a.teamCoverage);

  // Build team capabilities grouped by category
  const teamCapabilities: TeamCapability[] = [];
  for (const [category, memberScoreMap] of categoryMembers) {
    const members = Array.from(memberScoreMap.keys());
    let strongestMemberId: string | undefined;
    let strongestScore = -1;
    let totalScore = 0;
    let totalConfidence = 0;

    for (const memberId of members) {
      const score = memberScoreMap.get(memberId) || 0;
      totalScore += score;
      if (score > strongestScore) {
        strongestScore = score;
        strongestMemberId = memberId;
      }
      const profile = profiles.find((p) => p.memberId === memberId);
      const assessment = profile?.skillAssessments.find(
        (a) => skillCategory(a.normalizedSkill) === category
      );
      totalConfidence += assessment?.confidence || 0.5;
    }

    const coverageScore = Math.min(
      100,
      Math.round((strongestScore / 10) * 60 + (members.length / Math.max(profiles.length, 1)) * 40)
    );
    const confidence = members.length > 0 ? totalConfidence / members.length : 0;
    const risk = strongestScore >= 8 && members.length >= 1 ? "low" : strongestScore >= 5 ? "medium" : "high";

    teamCapabilities.push({
      capability: categoryLabel(category),
      members,
      strongestMemberId,
      coverageScore,
      confidence: Math.round(confidence * 100) / 100,
      risk,
    });
  }

  return {
    members: profiles.map((p) => ({
      memberId: p.memberId,
      memberName: p.memberName,
      strongestSkills: p.strongestSkills,
      secondarySkills: p.secondarySkills,
      skillGapAreas: p.skillGapAreas,
    })),
    skills,
    memberSkillEdges: edges,
    teamCapabilities,
  };
}

function categoryLabel(category: string): string {
  const labels: Record<string, string> = {
    frontend: "Frontend Development",
    backend: "Backend Development",
    database: "Database Management",
    ai: "AI / LLM Engineering",
    ml: "Machine Learning",
    devops: "DevOps / Deployment",
    mobile: "Mobile Development",
    design: "UI / UX Design",
    testing: "Testing",
    general: "General Engineering",
    other: "Other",
  };
  return labels[category] || category;
}
