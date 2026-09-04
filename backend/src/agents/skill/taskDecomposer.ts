import {
  ProjectTask,
  ProjectSkillRequirement,
  TaskDependencyEdge,
} from "../../graph/state";
import { callStructured } from "./llm";
import {
  TASK_DECOMPOSITION_SYSTEM_PROMPT,
  TASK_DECOMPOSITION_USER_TEMPLATE,
  TaskDecompositionSchema,
} from "../../prompts/skillAnalyzer";
import { TASK_BOUNDS } from "./skill.config";
import { normalizeSkill } from "./skillNormalizer";

export interface TaskDecompositionResult {
  tasks: ProjectTask[];
  projectSkillRequirements: ProjectSkillRequirement[];
  dependencyEdges: TaskDependencyEdge[];
}

export interface DecompositionContext {
  solutionName: string;
  solutionDescription: string;
  features: string[];
  workflow: string[];
  requiredCapabilities: string[];
  technicalCapabilities: string[];
  selectedTechStack: string[];
}

export async function decomposeProjectTasks(
  context: DecompositionContext,
  projectId: string
): Promise<TaskDecompositionResult> {
  const result = await callStructured<{
    tasks: ProjectTask[];
    projectSkillRequirements: ProjectSkillRequirement[];
    taskDependencyEdges: TaskDependencyEdge[];
  }>(
    "research",
    TASK_DECOMPOSITION_SYSTEM_PROMPT,
    TASK_DECOMPOSITION_USER_TEMPLATE(
      context.solutionName,
      context.solutionDescription,
      context.features,
      context.workflow,
      context.requiredCapabilities,
      context.technicalCapabilities,
      context.selectedTechStack
    ),
    TaskDecompositionSchema,
    "TaskDecomposition"
  );

  if (!result || !result.tasks || result.tasks.length === 0) {
    return fallbackDecomposition(context);
  }

  // Normalize + clamp task count
  const tasks = result.tasks
    .slice(0, TASK_BOUNDS.maxTasks)
    .map((t) => ({
      ...t,
      requiredSkills: t.requiredSkills.map((rs) => ({
        ...rs,
        skill: normalizeSkill(rs.skill),
      })),
      estimatedHours: Math.max(0.5, t.estimatedHours || 2),
    }));

  const requirements = (result.projectSkillRequirements || []).map((r) => ({
    ...r,
    skill: normalizeSkill(r.skill),
  }));

  return {
    tasks,
    projectSkillRequirements: requirements,
    dependencyEdges: result.taskDependencyEdges || [],
  };
}

function fallbackDecomposition(context: DecompositionContext): TaskDecompositionResult {
  const capabilities = [...context.requiredCapabilities, ...context.technicalCapabilities];
  const tasks: ProjectTask[] = [];
  const requirements: ProjectSkillRequirement[] = [];

  // Deterministic fallback: one task per capability + integration + testing
  capabilities.slice(0, 20).forEach((cap, i) => {
    tasks.push({
      id: `task_${i + 1}`,
      name: `Implement ${cap}`,
      description: `Build the ${cap} component of the MVP.`,
      category: categorizeCapability(cap),
      requiredSkills: [{ skill: normalizeSkill(cap), category: categorizeCapability(cap), requiredLevel: 5, importance: "high" }],
      estimatedHours: 3,
      priority: i < 3 ? "critical" : "high",
      dependencies: i === 0 ? [] : [`task_${i}`],
      parallelizable: false,
      deliverable: `Working ${cap}`,
      acceptanceCriteria: [`${cap} is functional and demoable`],
    });
  });

  tasks.push({
    id: `task_${capabilities.length + 1}`,
    name: "Integration & end-to-end testing",
    description: "Integrate all components and run end-to-end tests.",
    category: "integration",
    requiredSkills: [{ skill: "integration", category: "integration", requiredLevel: 5, importance: "critical" }],
    estimatedHours: 3,
    priority: "critical",
    dependencies: tasks.map((t) => t.id),
    parallelizable: false,
    deliverable: "Integrated MVP",
    acceptanceCriteria: ["Full happy-path demo works end to end"],
  });

  requirements.push({
    id: "req_1",
    skill: "full-stack development",
    category: "general",
    importance: "critical",
    requiredLevel: 6,
    minimumCoverage: 1,
    relatedTasks: tasks.map((t) => t.id),
  });

  return { tasks, projectSkillRequirements: requirements, dependencyEdges: [] };
}

function categorizeCapability(cap: string): ProjectTask["category"] {
  const c = cap.toLowerCase();
  if (c.includes("ai") || c.includes("ml") || c.includes("model") || c.includes("rag") || c.includes("llm")) return "ai";
  if (c.includes("data") || c.includes("database") || c.includes("mongo") || c.includes("sql")) return "database";
  if (c.includes("api") || c.includes("backend") || c.includes("server") || c.includes("auth")) return "backend";
  if (c.includes("front") || c.includes("ui") || c.includes("react") || c.includes("web")) return "frontend";
  if (c.includes("deploy") || c.includes("docker") || c.includes("ci")) return "devops";
  return "other";
}
