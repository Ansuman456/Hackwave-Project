import { z } from "zod";

// ============================================================
// RESUME PROJECT EXTRACTION (Stage 1)
// ============================================================

export const ResumeProjectExtractionSchema = z.object({
  projects: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      technologies: z.array(z.string()),
      responsibilities: z.array(z.string()),
      relevantCapabilities: z.array(z.string()),
    })
  ),
});

export const RESUME_PROJECT_SYSTEM_PROMPT = `
You are the Resume Experience Analyzer node of Agent 5 (Team Skill Graph) in HackForge.

ROLE:
Senior technical hiring evaluator. You extract CONCRETE project experience from resumes to build trustworthy skill evidence.

OBJECTIVE:
From a team member's resume text, extract the projects and concrete experiences that demonstrate technical capability. Do NOT simply repeat the "skills" section — extract projects that show the person actually used technologies.

RULES:
1. Extract real projects (work, internships, hackathons, personal projects, research).
2. For each project, list the concrete technologies used (languages, frameworks, libraries, tools, databases, cloud).
3. List the person's responsibilities (what they built/owned).
4. Derive "relevantCapabilities" — engineering capabilities demonstrated (e.g., "REST API development", "real-time communication", "RAG pipeline").
5. A project with concrete technology + responsibility is STRONG evidence. A vague bullet is WEAK.
6. Do NOT invent projects or technologies that are not mentioned.

OUTPUT: Return ONLY valid JSON matching the ResumeProjectExtractionSchema.
`;

export const RESUME_PROJECT_USER_TEMPLATE = (
  memberId: string,
  name: string,
  resumeText: string,
  declaredSkills: string[]
): string => `
MEMBER: ${name} (${memberId})
DECLARED SKILLS (claimed): ${declaredSkills.join(", ") || "none"}

RESUME TEXT:
${resumeText || "(no resume text available)"}

Extract the concrete projects and experiences from this resume. Map each project to its technologies and responsibilities.

Return ONLY valid JSON matching the ResumeProjectExtractionSchema.
`;

// ============================================================
// GITHUB PROJECT INTERPRETATION (Stage 2)
// ============================================================

export const GithubProjectInterpretationSchema = z.object({
  projectPurpose: z.string(),
  demonstratedTechnologies: z.array(z.string()),
  demonstratedCapabilities: z.array(z.string()),
  complexity: z.enum(["small", "medium", "large"]),
  looksLikeTutorialOrCourse: z.boolean(),
  relevanceScore: z.number().min(0).max(1),
  evidenceNotes: z.string(),
});

export const GITHUB_INTERPRET_SYSTEM_PROMPT = `
You are the GitHub Evidence Interpreter node of Agent 5 (Team Skill Graph) in HackForge.

ROLE:
Senior software architect and GitHub codebase analyst. You interpret a repository's README and metadata to determine what technologies and engineering capabilities the author actually demonstrated.

OBJECTIVE:
Given repository metadata + README + dependency info, determine what skills are genuinely demonstrated (not merely mentioned).

RULES:
1. Extract demonstratedTechnologies — technologies the author clearly used to build this project.
2. Extract demonstratedCapabilities — engineering capabilities (e.g., "REST API", "database design", "ML model training", "real-time communication").
3. Estimate complexity: small / medium / large based on scope, tech breadth, architecture, depth.
4. Detect tutorial/course/boilerplate repositories (looksLikeTutorialOrCourse) — low evidence value.
5. A fork or a copied tutorial is weak evidence of independent ability.
6. relevanceScore: how relevant this repo is to a hackathon engineering task (0-1), NOT how popular it is. Ignore stars.

OUTPUT: Return ONLY valid JSON matching the GithubProjectInterpretationSchema.
`;

export const GITHUB_INTERPRET_USER_TEMPLATE = (
  repoName: string,
  metadata: string,
  readme: string,
  dependencies: string
): string => `
REPOSITORY: ${repoName}

METADATA:
${metadata}

README (truncated):
${readme || "(no README)"}

DEPENDENCY FILES:
${dependencies || "(none found)"}

Interpret what technologies and capabilities are demonstrated by this repository.

Return ONLY valid JSON matching the GithubProjectInterpretationSchema.
`;

// ============================================================
// TASK DECOMPOSITION (Stage 4)
// ============================================================

export const TaskDecompositionSchema = z.object({
  tasks: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      description: z.string(),
      category: z.enum([
        "frontend",
        "backend",
        "ai",
        "database",
        "devops",
        "integration",
        "testing",
        "design",
        "documentation",
        "other",
      ]),
      requiredSkills: z.array(
        z.object({
          skill: z.string(),
          category: z.string(),
          requiredLevel: z.number().min(0).max(10),
          importance: z.enum(["critical", "high", "medium", "low"]),
        })
      ),
      estimatedHours: z.number(),
      priority: z.enum(["critical", "high", "medium", "low"]),
      dependencies: z.array(z.string()),
      parallelizable: z.boolean(),
      deliverable: z.string(),
      acceptanceCriteria: z.array(z.string()),
    })
  ),
  projectSkillRequirements: z.array(
    z.object({
      id: z.string(),
      skill: z.string(),
      category: z.string(),
      importance: z.enum(["critical", "high", "medium", "low"]),
      requiredLevel: z.number(),
      minimumCoverage: z.number(),
      relatedTasks: z.array(z.string()),
    })
  ),
  taskDependencyEdges: z.array(
    z.object({
      fromTaskId: z.string(),
      toTaskId: z.string(),
      type: z.enum([
        "required_before",
        "data_dependency",
        "integration_dependency",
        "soft_dependency",
      ]),
    })
  ),
});

export const TASK_DECOMPOSITION_SYSTEM_PROMPT = `
You are the Task Decomposition node of Agent 5 (Team Skill Graph & Task Allocation) in HackForge.

ROLE:
Senior engineering manager and hackathon mentor. You convert a selected project solution into concrete, assignable engineering tasks.

OBJECTIVE:
Decompose the selected solution into executable MVP tasks with required skills and dependency relationships.

TASK RULES:
1. Generate meaningful tasks only for the SELECTED solution. Do NOT add generic tasks that the project does not need.
2. If the solution uses RAG, include document ingestion, embedding, retrieval, evaluation. If not, do NOT add them.
3. Task granularity: small enough to assign, large enough to matter. Avoid "Build backend". Prefer "Create authentication API", "Implement login endpoint".
4. 15-40 meaningful tasks for a hackathon MVP.
5. Every task needs requiredSkills with requiredLevel (0-10), importance, and priority.
6. Every task needs a deliverable and acceptance criteria.
7. estimatedHours: effort for a competent engineer (before skill adjustment).

DEPENDENCY RULES:
8. Model task order (e.g., database -> backend API -> AI integration -> frontend integration -> e2e testing).
9. Mark which tasks can run in parallel (parallelizable).
10. Provide taskDependencyEdges with type required_before / data_dependency / integration_dependency / soft_dependency.

REQUIREMENT RULES:
11. Also produce projectSkillRequirements: the overall skills the project needs, with importance and requiredLevel, and which tasks relate to each skill.

OUTPUT: Return ONLY valid JSON matching the TaskDecompositionSchema.
`;

export const TASK_DECOMPOSITION_USER_TEMPLATE = (
  solutionName: string,
  solutionDescription: string,
  features: string[],
  workflow: string[],
  requiredCapabilities: string[],
  technicalCapabilities: string[],
  selectedTechStack: string[]
): string => `
SELECTED SOLUTION: ${solutionName}
DESCRIPTION: ${solutionDescription}

KEY FEATURES:
${features.map((f) => `- ${f}`).join("\n")}

WORKFLOW:
${workflow.map((w) => `- ${w}`).join("\n")}

REQUIRED CAPABILITIES:
${requiredCapabilities.join(", ") || "none"}

TECHNICAL CAPABILITIES:
${technicalCapabilities.join(", ") || "none"}

SELECTED TECH STACK:
${selectedTechStack.join(", ") || "not selected"}

Decompose this solution into concrete hackathon MVP tasks, skill requirements, and dependency edges.

Return ONLY valid JSON matching the TaskDecompositionSchema.
`;
