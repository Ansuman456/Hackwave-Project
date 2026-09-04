import {
  ProjectTask,
  MemberSkillProfile,
  CompatibilityScore,
  TaskAssignment,
  MemberWorkload,
  TaskContribution,
} from "../../graph/state";
import { COMPATIBILITY_THRESHOLDS, WORKLOAD } from "./skill.config";

export interface AssignmentResult {
  assignments: TaskAssignment[];
  workloads: MemberWorkload[];
  integrationOwnerId?: string;
  demoOwnerId?: string;
  bottlenecks: string[];
  backupCoverage: string[];
  status: "completed" | "conditionally_feasible" | "infeasible";
}

interface MemberState {
  memberId: string;
  assignedHours: number;
  availableHours: number;
  taskIds: string[];
  criticalTaskCount: number;
  categories: Set<string>;
}

interface Candidate {
  memberId: string;
  finalScore: number;
  skillMatchScore: number;
  experienceScore: number;
  confidenceScore: number;
  roleCoherenceScore: number;
}

const PRIORITY_RANK: Record<string, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

function skillScarcity(task: ProjectTask, profiles: MemberSkillProfile[]): number {
  // Higher = scarcer (fewer members can do the required skills)
  if (task.requiredSkills.length === 0) return 0;

  const scarcityPerSkill = task.requiredSkills.map((req) => {
    const capable = profiles.filter((p) =>
      p.skillAssessments.some(
        (a) => a.normalizedSkill === req.skill && a.score >= req.requiredLevel * 0.6
      )
    ).length;
    const ratio = 1 - capable / Math.max(profiles.length, 1);
    return ratio;
  });

  return Math.max(...scarcityPerSkill);
}

function adjustHours(base: number, skillMatch: number): number {
  const factor = 1 + (1 - skillMatch) * 0.5;
  const adjusted = base * Math.min(factor, 1.8);
  return Math.max(0.5, Math.round(adjusted * 4) / 4);
}

export function optimizeAssignments(
  tasks: ProjectTask[],
  profiles: MemberSkillProfile[],
  compatibility: CompatibilityScore[],
  criticalPath: string[],
  perMemberAvailable: number
): AssignmentResult {
  const criticalSet = new Set(criticalPath);

  // Compatibility lookup: taskId -> sorted candidates
  const compatByTask = new Map<string, Candidate[]>();
  for (const c of compatibility) {
    if (!compatByTask.has(c.taskId)) compatByTask.set(c.taskId, []);
    compatByTask.get(c.taskId)!.push({
      memberId: c.memberId,
      finalScore: c.finalScore,
      skillMatchScore: c.skillMatchScore,
      experienceScore: c.experienceScore,
      confidenceScore: c.confidenceScore,
      roleCoherenceScore: c.roleCoherenceScore,
    });
  }
  for (const [, list] of compatByTask) {
    list.sort((a, b) => b.finalScore - a.finalScore);
  }

  // Member workload state
  const memberStates = new Map<string, MemberState>();
  for (const p of profiles) {
    memberStates.set(p.memberId, {
      memberId: p.memberId,
      assignedHours: 0,
      availableHours: perMemberAvailable,
      taskIds: [],
      criticalTaskCount: 0,
      categories: new Set(),
    });
  }

  const taskById = new Map<string, ProjectTask>(tasks.map((t) => [t.id, t]));
  const assignments = new Map<string, TaskAssignment>();
  const assignedTaskIds = new Set<string>();

  // Ready queue (dependency-aware greedy with critical-path priority)
  const remaining = new Set(tasks.map((t) => t.id));

  const isReady = (taskId: string): boolean => {
    const task = taskById.get(taskId)!;
    return (task.dependencies || []).every((dep) => assignedTaskIds.has(dep));
  };

  const pickNextTask = (): string | null => {
    let best: string | null = null;
    let bestKey = -Infinity;

    for (const id of remaining) {
      if (!isReady(id)) continue;
      const task = taskById.get(id)!;
      const scarcity = skillScarcity(task, profiles);
      const key =
        (criticalSet.has(id) ? 100 : 0) +
        PRIORITY_RANK[task.priority] * 10 +
        scarcity * 5;
      if (key > bestKey) {
        bestKey = key;
        best = id;
      }
    }
    return best;
  };

  // Assign loop
  while (remaining.size > 0) {
    const nextId = pickNextTask();
    if (nextId === null) {
      // Cycle or unresolved deps — assign remaining by priority anyway
      const remainingList = Array.from(remaining).sort((a, b) => {
        const ta = taskById.get(a)!;
        const tb = taskById.get(b)!;
        return PRIORITY_RANK[tb.priority] - PRIORITY_RANK[ta.priority];
      });
      for (const id of remainingList) {
        const task = taskById.get(id)!;
        const candidate = bestCandidate(task, id, compatByTask, memberStates);
        if (candidate) applyAssignment(task, candidate, id, compatByTask, memberStates, assignments, assignedTaskIds, criticalSet);
      }
      break;
    }

    const task = taskById.get(nextId)!;
    remaining.delete(nextId);

    const candidate = bestCandidate(task, nextId, compatByTask, memberStates);
    if (candidate) {
      applyAssignment(task, candidate, nextId, compatByTask, memberStates, assignments, assignedTaskIds, criticalSet);
    } else {
      // No suitable owner found — mark conditionally feasible with best-effort
      const best = (compatByTask.get(nextId) || [])[0];
      if (best) {
        applyAssignment(task, best, nextId, compatByTask, memberStates, assignments, assignedTaskIds, criticalSet, true);
      }
    }
  }

  // Detect overload and rebalance (up to 3 iterations)
  for (let iter = 0; iter < WORKLOAD.maxOptimizationIterations; iter++) {
    const overloaded = Array.from(memberStates.values()).filter(
      (m) => m.assignedHours > m.availableHours * WORKLOAD.maxUtilization
    );
    if (overloaded.length === 0) break;

    let rebalanced = false;
    for (const m of overloaded) {
      // Find a non-critical task owned by this member to move
      const movableTask = m.taskIds
        .map((id) => taskById.get(id)!)
        .filter((t) => !criticalSet.has(t.id))
        .sort((a, b) => b.estimatedHours - a.estimatedHours)[0];

      if (!movableTask) continue;

      const candidates = (compatByTask.get(movableTask.id) || [])
        .filter((c) => c.memberId !== m.memberId)
        .sort((a, b) => b.finalScore - a.finalScore);

      const target = candidates.find((c) => {
        const ms = memberStates.get(c.memberId)!;
        return ms.assignedHours + movableTask.estimatedHours <= ms.availableHours * WORKLOAD.maxUtilization;
      });

      if (!target) continue;

      // Move the task
      reassignTask(movableTask.id, m.memberId, target.memberId, taskById, memberStates, assignments);
      rebalanced = true;
    }
    if (!rebalanced) break;
  }

  // Assign backup owners for critical tasks
  const backupCoverage: string[] = [];
  for (const [taskId, assignment] of assignments) {
    const task = taskById.get(taskId)!;
    if (!criticalSet.has(taskId)) continue;

    const backup = (compatByTask.get(taskId) || []).find(
      (c) => c.memberId !== assignment.primaryOwnerId && c.skillMatchScore >= 0.5
    );
    if (backup) {
      assignment.backupOwnerId = backup.memberId;
      const backupName = profiles.find((p) => p.memberId === backup.memberId)?.memberName || backup.memberId;
      backupCoverage.push(`${task.name} (backup: ${backupName})`);
    }
  }

  // Single-point-of-failure detection
  const bottlenecks: string[] = [];
  for (const m of memberStates.values()) {
    if (m.criticalTaskCount >= WORKLOAD.maxCriticalTasksPerMember) {
      const name = profiles.find((p) => p.memberId === m.memberId)?.memberName || m.memberId;
      bottlenecks.push(`${name} owns ${m.criticalTaskCount} critical tasks — single-point-of-failure risk`);
    }
  }

  // Build workloads
  const workloads: MemberWorkload[] = Array.from(memberStates.values()).map((m) => {
    const utilization = m.availableHours > 0 ? m.assignedHours / m.availableHours : 1;
    const risk =
      utilization > WORKLOAD.maxUtilization ? "high" : utilization > WORKLOAD.warnUtilization ? "medium" : "low";
    return {
      memberId: m.memberId,
      availableHours: m.availableHours,
      assignedHours: Math.round(m.assignedHours * 100) / 100,
      utilization: Math.round(utilization * 100) / 100,
      taskIds: m.taskIds,
      criticalTaskCount: m.criticalTaskCount,
      risk,
    };
  });

  // Integration owner: best backend/fullstack with highest confidence
  const integrationOwner = pickOwnerByCategory(profiles, memberStates, ["backend", "database", "ai"]);

  // Demo owner: best design/frontend
  const demoOwner = pickOwnerByCategory(profiles, memberStates, ["design", "frontend"]);

  // Feasibility
  let status: AssignmentResult["status"] = "completed";
  const incapableAssignments = Array.from(assignments.values()).filter(
    (a) => a.skillMatchScore < COMPATIBILITY_THRESHOLDS.minimumAcceptable
  );
  if (incapableAssignments.length > 0) {
    status = "conditionally_feasible";
  }
  if (workloads.some((w) => w.utilization > WORKLOAD.maxUtilization)) {
    status = "conditionally_feasible";
  }

  return {
    assignments: Array.from(assignments.values()),
    workloads,
    integrationOwnerId: integrationOwner,
    demoOwnerId: demoOwner,
    bottlenecks,
    backupCoverage,
    status,
  };
}

function bestCandidate(
  task: ProjectTask,
  taskId: string,
  compatByTask: Map<string, Candidate[]>,
  memberStates: Map<string, MemberState>
): Candidate | null {
  const candidates = (compatByTask.get(taskId) || [])
    .filter((c) => c.skillMatchScore >= COMPATIBILITY_THRESHOLDS.minimumAcceptable)
    .sort((a, b) => {
      // Context-switching penalty: prefer members with fewer distinct categories
      const ac = memberStates.get(a.memberId)!.categories.size;
      const bc = memberStates.get(b.memberId)!.categories.size;
      const aScore = a.finalScore - (ac > 2 ? 0.1 : 0);
      const bScore = b.finalScore - (bc > 2 ? 0.1 : 0);
      return bScore - aScore;
    });

  return candidates[0] || null;
}

function applyAssignment(
  task: ProjectTask,
  candidate: Candidate,
  taskId: string,
  compatByTask: Map<string, Candidate[]>,
  memberStates: Map<string, MemberState>,
  assignments: Map<string, TaskAssignment>,
  assignedTaskIds: Set<string>,
  criticalSet: Set<string>,
  forced = false
): void {
  const ms = memberStates.get(candidate.memberId)!;
  const hours = adjustHours(task.estimatedHours, candidate.skillMatchScore);

  const contributions: TaskContribution[] = [
    { memberId: candidate.memberId, role: "primary", estimatedHours: hours },
  ];

  const assignment: TaskAssignment = {
    taskId,
    primaryOwnerId: candidate.memberId,
    assignedHours: hours,
    skillMatchScore: candidate.skillMatchScore,
    experienceMatchScore: candidate.experienceScore,
    confidence: candidate.confidenceScore,
    assignmentReason: forced
      ? "Best available match (no member fully satisfies skill requirements)"
      : "Highest compatibility score with sufficient skill match",
    dependenciesSatisfied: (task.dependencies || []).every((dep) => assignedTaskIds.has(dep)),
    contributions,
  };

  assignments.set(taskId, assignment);
  assignedTaskIds.add(taskId);

  ms.assignedHours += hours;
  ms.taskIds.push(taskId);
  ms.categories.add(task.category);
  if (criticalSet.has(taskId)) ms.criticalTaskCount++;
}

function reassignTask(
  taskId: string,
  fromMemberId: string,
  toMemberId: string,
  taskById: Map<string, ProjectTask>,
  memberStates: Map<string, MemberState>,
  assignments: Map<string, TaskAssignment>
): void {
  const task = taskById.get(taskId)!;
  const assignment = assignments.get(taskId);
  if (!assignment) return;

  const from = memberStates.get(fromMemberId)!;
  const to = memberStates.get(toMemberId)!;

  from.assignedHours -= assignment.assignedHours;
  from.taskIds = from.taskIds.filter((id) => id !== taskId);

  to.assignedHours += assignment.assignedHours;
  to.taskIds.push(taskId);
  to.categories.add(task.category);

  assignment.primaryOwnerId = toMemberId;
  assignment.assignmentReason = "Reassigned during workload rebalancing";
}

function pickOwnerByCategory(
  profiles: MemberSkillProfile[],
  memberStates: Map<string, MemberState>,
  categories: string[]
): string | undefined {
  const ranked = profiles
    .map((p) => {
      const hasSkill = p.skillAssessments.filter((a) =>
        categories.some((c) => categoryOfAssessment(a.normalizedSkill) === c && a.score >= 6)
      ).length;
      const ms = memberStates.get(p.memberId)!;
      const loadPenalty = ms.assignedHours / ms.availableHours;
      return { memberId: p.memberId, score: hasSkill * 2 - loadPenalty };
    })
    .sort((a, b) => b.score - a.score);

  return ranked[0]?.memberId;
}

function categoryOfAssessment(skill: string): string {
  const s = skill.toLowerCase();
  if (["react", "vue", "angular", "css", "html", "next.js", "frontend"].some((k) => s.includes(k))) return "frontend";
  if (["figma", "ui/ux", "design", "ui design", "ux design"].some((k) => s.includes(k))) return "design";
  if (["node", "express", "django", "flask", "fastapi", "backend", "api", "go"].some((k) => s.includes(k))) return "backend";
  if (["mongodb", "postgres", "sql", "database", "mysql", "redis"].some((k) => s.includes(k))) return "database";
  if (["ai", "langchain", "langgraph", "rag", "llm", "ml", "pytorch", "tensorflow", "python"].some((k) => s.includes(k))) return "ai";
  return "other";
}
