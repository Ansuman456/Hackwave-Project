import { v4 as uuidv4 } from "uuid";
import {
  HackathonState,
  TeamSkillAnalysis,
  MemberSkillProfile,
  SkillGraph,
  ProjectTask,
  ProjectSkillRequirement,
  TaskDependencyGraph,
  CompatibilityScore,
  TaskAssignment,
  MemberWorkload,
  TeamExecutionPlan,
  TeamFitAnalysis,
  TeamCapabilitySummary,
  SkillGap,
  TeamBottleneck,
  Recommendation,
  Workstream,
  TeamRole,
} from "../../graph/state";
import { emitEvent } from "../../utils/sseStreamer";
import { analyzeResume, MemberInput } from "./resumeSkillAnalyzer";
import { analyzeGithub } from "./githubSkillAnalyzer";
import { buildMemberProfile } from "./skillEvidenceMerger";
import { buildSkillGraph } from "./skillGraphBuilder";
import { decomposeProjectTasks } from "./taskDecomposer";
import { buildTaskDependencyGraph } from "./taskDependencyBuilder";
import { calculateCompatibility } from "./compatibilityCalculator";
import { computeTimeBudget } from "./workloadModel";
import { optimizeAssignments } from "./assignmentOptimizer";

export interface SkillAgentResult {
  success: boolean;
  teamSkillAnalysis?: TeamSkillAnalysis;
  error?: string;
}

export async function runSkillAllocator(
  projectId: string,
  state: HackathonState
): Promise<SkillAgentResult> {
  emitEvent(projectId, "skillAllocator", "team_analysis_started", "Team Skill Graph agent starting");

  try {
    const { innovation, teamAnalysis, input } = state;

    if (!innovation || !teamAnalysis) {
      return {
        success: false,
        error: "Missing innovation or team analysis. Agent 5 requires prior agent outputs.",
      };
    }

    const selectedIdea = innovation.selectedIdea;
    if (!selectedIdea) {
      return { success: false, error: "No selected idea. User must select a candidate first." };
    }

    const projectRequirements = innovation.projectCapabilityRequirements;

    // ============================================================
    // STAGE 1+2: Resume + GitHub analysis per member
    // ============================================================
    const resumes = (input.resumes || []) as string[];
    const teamMembers = teamAnalysis.teamMembers || [];

    emitEvent(projectId, "skillAllocator", "resume_analysis_started", `Analyzing ${teamMembers.length} team members`);

    const memberInputs: MemberInput[] = teamMembers.map((tm, i) => ({
      memberId: tm.memberId,
      name: tm.name,
      resumeText: resumes[i] || tm.resumeSnippet || "",
      parsedSkills: tm.parsedSkills || [],
      primaryRole: tm.primaryRole,
      proficiencyLevels: (tm.proficiencyLevels as Record<string, string>) || {},
      resumeSnippet: tm.resumeSnippet,
      githubUsername: tm.githubUsername,
      yearsExperience: tm.yearsExperience,
    }));

    const projectContext = buildProjectContext(selectedIdea, projectRequirements);

    const memberProfiles: MemberSkillProfile[] = [];
    for (const member of memberInputs) {
      emitEvent(projectId, "skillAllocator", "resume_analysis_started", `Analyzing resume: ${member.name}`);

      const resumeAnalysis = await analyzeResume(member);

      let githubEvidence: any[] = [];
      if (member.githubUsername) {
        emitEvent(projectId, "skillAllocator", "github_analysis_started", `Analyzing GitHub: ${member.githubUsername}`);
        const gh = await analyzeGithub(member.githubUsername, projectContext, projectId);
        githubEvidence = gh.githubEvidence;
        emitEvent(projectId, "skillAllocator", "github_analysis_completed", `GitHub analysis: ${gh.reposAnalyzed} repos analyzed`);
      }

      const profile = buildMemberProfile(
        member,
        resumeAnalysis.resumeProjects,
        resumeAnalysis.resumeEvidence,
        githubEvidence
      );
      memberProfiles.push(profile);
    }

    emitEvent(projectId, "skillAllocator", "resume_analysis_completed", `Skill profiles built for ${memberProfiles.length} members`);

    // ============================================================
    // STAGE 3: Skill graph
    // ============================================================
    const skillGraph = buildSkillGraph(memberProfiles);
    emitEvent(projectId, "skillAllocator", "skill_graph_created", `Skill graph: ${skillGraph.skills.length} skills, ${skillGraph.memberSkillEdges.length} edges`);

    // ============================================================
    // STAGE 4: Task decomposition + requirements
    // ============================================================
    emitEvent(projectId, "skillAllocator", "project_tasks_generated", "Decomposing project into tasks");

    const selectedTechStack = teamAnalysis.selectedTechStack || teamAnalysis.techStackOptions?.[0];
    const techStackNames = selectedTechStack
      ? [
          ...(selectedTechStack.frontend || []),
          ...(selectedTechStack.backend || []),
          ...(selectedTechStack.database || []),
          ...(selectedTechStack.aiMl || []),
        ]
      : [];

    const decomposition = await decomposeProjectTasks(
      {
        solutionName: selectedIdea.name,
        solutionDescription: selectedIdea.detailedDescription || selectedIdea.oneLineDescription,
        features: selectedIdea.keyFeatures.map((f) => f.name),
        workflow: selectedIdea.workflow.map((w) => w.action),
        requiredCapabilities: projectRequirements.requiredCapabilities || [],
        technicalCapabilities: projectRequirements.technicalCapabilities || [],
        selectedTechStack: techStackNames,
      },
      projectId
    );

    const tasks = decomposition.tasks;
    const projectSkillRequirements = decomposition.projectSkillRequirements;

    // ============================================================
    // STAGE 5: Dependency graph + critical path
    // ============================================================
    const taskDependencyGraph = buildTaskDependencyGraph(tasks, decomposition.dependencyEdges);
    emitEvent(projectId, "skillAllocator", "task_dependency_graph_created", `Dependency graph: ${taskDependencyGraph.edges.length} edges, critical path: ${taskDependencyGraph.criticalPath.length} tasks`);

    // ============================================================
    // STAGE 6: Compatibility matrix
    // ============================================================
    const compatibilityMatrix = calculateCompatibility(tasks, memberProfiles);
    emitEvent(projectId, "skillAllocator", "compatibility_matrix_created", `Compatibility matrix: ${compatibilityMatrix.length} task-member pairs`);

    // ============================================================
    // STAGE 7: Assignment + workload
    // ============================================================
    const hackathonDuration = input.hackathon?.durationHours;
    const budget = computeTimeBudget(hackathonDuration);

    emitEvent(projectId, "skillAllocator", "initial_assignment_created", "Optimizing task assignment");
    const assignmentResult = optimizeAssignments(
      tasks,
      memberProfiles,
      compatibilityMatrix,
      taskDependencyGraph.criticalPath,
      budget.perMemberAvailable
    );

    // ============================================================
    // STAGE 8: Fit / gaps / bottlenecks / recommendations
    // ============================================================
    const teamFit = buildTeamFit(projectSkillRequirements, memberProfiles, teamAnalysis);
    const capabilitySummary = buildCapabilitySummary(projectSkillRequirements, memberProfiles);
    const skillGaps = buildSkillGaps(projectSkillRequirements, memberProfiles, tasks);
    const bottlenecks = buildBottlenecks(assignmentResult, skillGaps, taskDependencyGraph);
    const recommendations = buildRecommendations(skillGaps, capabilitySummary, assignmentResult);

    const workstreams = buildWorkstreams(tasks, assignmentResult.assignments, taskDependencyGraph);
    const teamRoles = buildTeamRoles(memberProfiles, assignmentResult.workloads);

    const teamExecutionPlan: TeamExecutionPlan = {
      assignments: assignmentResult.assignments,
      memberWorkloads: assignmentResult.workloads,
      criticalPath: taskDependencyGraph.criticalPath,
      bottlenecks: assignmentResult.bottlenecks,
      backupCoverage: assignmentResult.backupCoverage,
      parallelWorkstreams: workstreams,
      recommendedTeamStructure: teamRoles,
    };

    const teamSkillAnalysis: TeamSkillAnalysis = {
      teamSkillAnalysisId: `skill_${uuidv4().substring(0, 8)}`,
      memberProfiles,
      skillGraph,
      projectSkillRequirements,
      projectTasks: tasks,
      taskDependencyGraph,
      compatibilityMatrix,
      assignments: assignmentResult.assignments,
      workloads: assignmentResult.workloads,
      teamExecutionPlan,
      teamFit,
      capabilitySummary,
      skillGaps,
      bottlenecks,
      recommendations,
      integrationOwnerId: assignmentResult.integrationOwnerId,
      demoOwnerId: assignmentResult.demoOwnerId,
      status: assignmentResult.status,
      confidence: computeOverallConfidence(memberProfiles, assignmentResult),
    };

    emitEvent(
      projectId,
      "skillAllocator",
      "team_plan_validated",
      `Team plan: ${assignmentResult.assignments.length} tasks assigned, status ${assignmentResult.status}`
    );
    emitEvent(
      projectId,
      "skillAllocator",
      "team_analysis_completed",
      `Team Skill Graph complete: fit ${teamFit.score}/10, ${skillGaps.length} skill gaps`
    );

    return { success: true, teamSkillAnalysis };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Agent 5 (skill allocator) failed";
    console.error("[SkillAllocator] Fatal error:", err);
    emitEvent(projectId, "skillAllocator", "agent_failed", msg);
    return { success: false, error: msg };
  }
}

function buildProjectContext(selectedIdea: any, projectRequirements: any): string {
  return [
    selectedIdea.name,
    selectedIdea.oneLineDescription,
    ...(selectedIdea.keyFeatures || []).map((f: any) => f.name),
    ...(projectRequirements?.requiredCapabilities || []),
    ...(projectRequirements?.technicalCapabilities || []),
  ].join(" ");
}

// ============================================================
// Deterministic fit / gap / recommendation builders
// ============================================================

function buildTeamFit(
  requirements: ProjectSkillRequirement[],
  profiles: MemberSkillProfile[],
  teamAnalysis: any
): TeamFitAnalysis {
  const critical = requirements.filter((r) => r.importance === "critical" || r.importance === "high");

  let covered = 0;
  let criticalCovered = 0;
  for (const req of requirements) {
    const best = bestScoreForSkill(profiles, req.skill);
    if (best >= req.requiredLevel) {
      covered++;
      if (req.importance === "critical") criticalCovered++;
    }
  }

  const skillCoverage = requirements.length > 0 ? covered / requirements.length : 0.5;
  const criticalCoverage =
    critical.filter((r) => r.importance === "critical").length > 0
      ? criticalCovered / Math.max(critical.filter((r) => r.importance === "critical").length, 1)
      : 0.5;

  const allAssessments = profiles.flatMap((p) => p.skillAssessments);
  const avgConfidence = allAssessments.length > 0
    ? allAssessments.reduce((s, a) => s + a.confidence, 0) / allAssessments.length
    : 0.4;

  const feasibilityScore = teamAnalysis?.feasibility?.score || 6;
  const dataCapability = teamAnalysis?.feasibility?.dataRisk === "high" ? 0.4 : 0.7;

  const score =
    skillCoverage * 0.35 +
    avgConfidence * 0.25 +
    criticalCoverage * 0.2 +
    dataCapability * 0.1 +
    (feasibilityScore / 10) * 0.1;

  return {
    score: Math.round(score * 10) / 10,
    skillCoverageScore: Math.round(skillCoverage * 10) / 10,
    skillConfidenceScore: Math.round(avgConfidence * 10) / 10,
    criticalSkillAvailabilityScore: Math.round(criticalCoverage * 10) / 10,
    dataCapabilityScore: dataCapability,
    implementationTimeScore: Math.round(feasibilityScore / 10 * 10) / 10,
    summary: `Team fit ${Math.round(score * 10)}/10. ${covered}/${requirements.length} requirements covered.`,
  };
}

function buildCapabilitySummary(
  requirements: ProjectSkillRequirement[],
  profiles: MemberSkillProfile[]
): TeamCapabilitySummary {
  const covered: string[] = [];
  const uncovered: string[] = [];
  const criticalAvailable: string[] = [];
  const criticalMissing: string[] = [];
  const bottleneckSkills: string[] = [];

  for (const req of requirements) {
    const best = bestScoreForSkill(profiles, req.skill);
    const capableCount = profiles.filter((p) =>
      p.skillAssessments.some((a) => a.normalizedSkill === req.skill && a.score >= req.requiredLevel)
    ).length;

    if (best >= req.requiredLevel) {
      covered.push(req.skill);
    } else {
      uncovered.push(req.skill);
    }

    if (req.importance === "critical") {
      if (best >= req.requiredLevel) criticalAvailable.push(req.skill);
      else criticalMissing.push(req.skill);
    }

    if (capableCount === 1 && req.importance !== "low") {
      bottleneckSkills.push(req.skill);
    }
  }

  const strongest = Array.from(
    new Set(profiles.flatMap((p) => p.strongestSkills))
  ).slice(0, 10);

  return {
    strongestCapabilities: strongest,
    coveredRequirements: covered,
    uncoveredRequirements: uncovered,
    criticalSkillsAvailable: criticalAvailable,
    criticalSkillsMissing: criticalMissing,
    bottleneckSkills,
    overallTeamFitScore: requirements.length > 0
      ? Math.round((covered.length / requirements.length) * 10) / 10
      : 0,
  };
}

function buildSkillGaps(
  requirements: ProjectSkillRequirement[],
  profiles: MemberSkillProfile[],
  tasks: ProjectTask[]
): SkillGap[] {
  const gaps: SkillGap[] = [];
  for (const req of requirements) {
    const best = bestScoreForSkill(profiles, req.skill);
    if (best >= req.requiredLevel) continue;

    const affectedTasks = tasks
      .filter((t) => t.requiredSkills.some((rs) => rs.skill === req.skill))
      .map((t) => t.id);

    const diff = req.requiredLevel - best;
    const severity: SkillGap["severity"] =
      req.importance === "critical"
        ? diff >= 5
          ? "blocking"
          : "high"
        : diff >= 5
          ? "high"
          : diff >= 2
            ? "medium"
            : "low";

    gaps.push({
      skill: req.skill,
      requiredLevel: req.requiredLevel,
      currentTeamLevel: best,
      severity,
      affectedTasks,
      mitigation: suggestMitigation(req.skill, best),
    });
  }
  return gaps.sort(bySeverity);
}

function buildBottlenecks(
  assignmentResult: ReturnType<typeof optimizeAssignments>,
  skillGaps: SkillGap[],
  depGraph: TaskDependencyGraph
): TeamBottleneck[] {
  const bottlenecks: TeamBottleneck[] = [];

  for (const gap of skillGaps.filter((g) => g.severity === "blocking" || g.severity === "high")) {
    bottlenecks.push({
      type: "skill",
      description: `Missing capability: ${gap.skill} (team ${gap.currentTeamLevel}/10 vs required ${gap.requiredLevel})`,
      affectedTasks: gap.affectedTasks,
      severity: gap.severity === "blocking" ? "high" : "medium",
      mitigation: gap.mitigation,
    });
  }

  const criticalByOwner = new Map<string, number>();
  for (const a of assignmentResult.assignments) {
    if (a.taskId && assignmentResult.workloads.some((w) => w.memberId === a.primaryOwnerId && w.criticalTaskCount > 0)) {
      criticalByOwner.set(a.primaryOwnerId, (criticalByOwner.get(a.primaryOwnerId) || 0) + 1);
    }
  }
  for (const [ownerId, count] of criticalByOwner) {
    if (count >= 3) {
      bottlenecks.push({
        type: "person",
        description: `Member ${ownerId} owns ${count} critical tasks (single point of failure)`,
        affectedTasks: assignmentResult.assignments.filter((a) => a.primaryOwnerId === ownerId).map((a) => a.taskId),
        severity: "high",
        mitigation: "Distribute critical tasks or assign backup owners.",
      });
    }
  }

  if (depGraph.criticalPath.length > 0) {
    bottlenecks.push({
      type: "dependency",
      description: `Critical path has ${depGraph.criticalPath.length} sequential tasks`,
      affectedTasks: depGraph.criticalPath,
      severity: "medium",
      mitigation: "Parallelize independent workstreams where possible.",
    });
  }

  return bottlenecks;
}

function buildRecommendations(
  skillGaps: SkillGap[],
  summary: TeamCapabilitySummary,
  assignmentResult: ReturnType<typeof optimizeAssignments>
): Recommendation[] {
  const recommendations: Recommendation[] = [];

  for (const gap of skillGaps.filter((g) => g.severity === "blocking" || g.severity === "high")) {
    recommendations.push({
      type: "skill_gap",
      description: `Address ${gap.skill} gap: ${gap.mitigation}`,
      priority: gap.severity === "blocking" ? "high" : "medium",
    });
  }

  const overloaded = assignmentResult.workloads.filter((w) => w.utilization > 0.9);
  for (const w of overloaded) {
    recommendations.push({
      type: "workload",
      description: `Member ${w.memberId} is overloaded (${Math.round(w.utilization * 100)}% utilization). Rebalance tasks.`,
      priority: "high",
    });
  }

  if (assignmentResult.status === "conditionally_feasible") {
    recommendations.push({
      type: "scope",
      description: "Reduce MVP scope or simplify tasks to match team capabilities.",
      priority: "high",
    });
  }

  return recommendations;
}

function buildWorkstreams(
  tasks: ProjectTask[],
  assignments: TaskAssignment[],
  depGraph: TaskDependencyGraph
): Workstream[] {
  const byCategory = new Map<string, ProjectTask[]>();
  for (const task of tasks) {
    if (!byCategory.has(task.category)) byCategory.set(task.category, []);
    byCategory.get(task.category)!.push(task);
  }

  const workstreams: Workstream[] = [];
  let order = 1;
  for (const [category, categoryTasks] of byCategory) {
    const taskIds = categoryTasks.map((t) => t.id);
    const ownerIds = Array.from(
      new Set(
        assignments.filter((a) => taskIds.includes(a.taskId)).map((a) => a.primaryOwnerId)
      )
    );
    workstreams.push({
      id: `ws_${category}`,
      name: category,
      taskIds,
      ownerIds,
      startOrder: order++,
      dependsOnWorkstreams: [],
    });
  }
  return workstreams;
}

function buildTeamRoles(
  profiles: MemberSkillProfile[],
  workloads: MemberWorkload[]
): TeamRole[] {
  return profiles.map((p) => {
    const primary = p.primaryRole || p.strongestSkills[0] || "Contributor";
    const secondary = p.secondarySkills[0];
    return {
      memberId: p.memberId,
      primaryRole: primary,
      secondaryRole: secondary,
      justification: `Strongest skills: ${p.strongestSkills.slice(0, 3).join(", ") || "none"}`,
      confidence: Math.round((p.skillAssessments[0]?.confidence || 0.5) * 100) / 100,
    };
  });
}

function computeOverallConfidence(
  profiles: MemberSkillProfile[],
  assignmentResult: ReturnType<typeof optimizeAssignments>
): number {
  const assignmentConf = assignmentResult.assignments.length > 0
    ? assignmentResult.assignments.reduce((s, a) => s + a.confidence, 0) / assignmentResult.assignments.length
    : 0.5;
  const profileConf = profiles.flatMap((p) => p.skillAssessments).length > 0
    ? profiles.flatMap((p) => p.skillAssessments).reduce((s, a) => s + a.confidence, 0) /
      profiles.flatMap((p) => p.skillAssessments).length
    : 0.4;

  return Math.round(((assignmentConf + profileConf) / 2) * 100) / 100;
}

function bestScoreForSkill(profiles: MemberSkillProfile[], skill: string): number {
  let best = 0;
  for (const p of profiles) {
    const assessment = p.skillAssessments.find((a) => a.normalizedSkill === skill);
    if (assessment && assessment.score > best) best = assessment.score;
  }
  return best;
}

function suggestMitigation(skill: string, level: number): string {
  if (level < 1) {
    return `No team member demonstrates ${skill}. Use a managed service, an existing library, or reduce this feature from MVP scope.`;
  }
  return `Team ${skill} level is low (${level}/10). Use simpler technology, pair two members, or allocate a short learning task.`;
}

function bySeverity(a: SkillGap, b: SkillGap): number {
  const order: Record<string, number> = { blocking: 0, high: 1, medium: 2, low: 3 };
  return (order[a.severity] || 4) - (order[b.severity] || 4);
}
