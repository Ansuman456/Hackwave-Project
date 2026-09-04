// Type definitions mirroring the HackBuddy backend schemas.
// Only the fields surfaced in the UI are typed fully; the rest are kept loose.

export interface GithubLink {
  githubProfileUrl: string
  username: string
  role?: string
}

export interface JudgingCriteria {
  name: string
  weight?: number
  description?: string
}

export interface HackathonDetails {
  name?: string
  description?: string
  durationHours?: number
  judgingCriteria?: JudgingCriteria[]
  rules?: string[]
  restrictions?: string[]
  allowedTechnologies?: string[]
  forbiddenTechnologies?: string[]
}

export interface HackathonInput {
  problemStatement: string
  resumes?: string[]
  githubLinks?: GithubLink[]
  hackathon?: HackathonDetails
  userConstraints?: string[]
  teamSize?: number
}

export type ProjectStatus =
  | "idle"
  | "running"
  | "paused"
  | "completed"
  | "failed"
  | "cancel_requested"
  | "awaiting_selection"

export interface AuthUser {
  _id?: string
  id?: string
  name: string
  email: string
}

export interface ProjectStages {
  strategist: boolean
  researcher: boolean
  innovation: boolean
  team: boolean
  architecture: boolean
}

export interface ProjectSummary {
  projectId: string
  problemStatement: string
  status: ProjectStatus
  teamSize?: number
  hackathonName?: string
  createdAt?: string
  updatedAt?: string
  stages?: ProjectStages
}

export interface ApiEnvelope<T> {
  success: boolean
  data?: T
  error?: string
  details?: string
  message?: string
}

// ---------------------------------------------------------------
// Agent 1 — Problem Analysis
// ---------------------------------------------------------------
export interface TargetUser {
  role: string
  context: string
  painLevel?: number | null
}

export interface PainPoint {
  description: string
  severity: "low" | "medium" | "high"
  reason?: string
}

export interface DesiredOutcome {
  description: string
  priority: "high" | "medium" | "low"
}

export interface Requirement {
  description: string
  type: "functional" | "non_functional"
  priority: "must" | "should" | "could"
}

export interface Constraint {
  description: string
  category: string
  severity: "low" | "medium" | "high"
}

export interface Ambiguity {
  issue: string
  whyItMatters?: string
  severity: "low" | "medium" | "high"
}

export interface ProblemAnalysis {
  coreProblem: string
  problemSummary: string
  targetUsers: TargetUser[]
  painPoints: PainPoint[]
  desiredOutcomes: DesiredOutcome[]
  explicitRequirements: Requirement[]
  inferredRequirements: Requirement[]
  constraints: Constraint[]
  domainKeywords: string[]
  successCriteria: string[]
  hackathonConsiderations: string[]
  ambiguities?: Ambiguity[]
  analysisConfidence: number
}

// ---------------------------------------------------------------
// Agent 2 — Research
// ---------------------------------------------------------------
export interface DiscoveredSolution {
  id: string
  name: string
  description: string
  problemSolved?: string
  technologies?: string[]
  limitations?: string[]
  website?: string | null
  githubRepository?: string | null
  relationToProblem?: "direct" | "adjacent" | "technical"
  confidence?: number
}

export interface ResearchSummary {
  queriesRun: number
  sourcesFound: number
  uniqueSources: number
  relevantSolutions: number
  directSolutions: number
  adjacentSolutions: number
}

export interface ResearchResult {
  researchId: string
  summary: ResearchSummary
  sources?: unknown[]
  discoveredSolutions: DiscoveredSolution[]
  coverage?: {
    commercialProducts: boolean
    startups: boolean
    githubRepos: boolean
    hackathons: boolean
    researchPapers: boolean
  }
  unresolvedQuestions?: string[]
  contradictions?: Array<{ solutionId: string; field: string; status: string }>
}

// ---------------------------------------------------------------
// Agent 3 — Innovation
// ---------------------------------------------------------------
export interface CandidateIdea {
  id: string
  name: string
  oneLineDescription: string
  detailedDescription: string
  targetUsers: string[]
  problemSolved: string
  keyFeatures: Array<{ name: string; description: string }>
  estimatedComplexity: "low" | "medium" | "high"
  estimatedHackathonFit: number
  innovationScore: number
  impactScore: number
  differentiationScore: number
  overallConceptScore: number
  potentialRisks?: string[]
}

export interface InnovationResult {
  innovationId: string
  candidateIdeas: CandidateIdea[]
  selectedIdea?: CandidateIdea | null
  solutionLandscape?: {
    totalSolutions: number
    directSolutions: number
    adjacentSolutions: number
    dominantApproaches: string[]
  }
  differentiation?: {
    summary: string
    keyDifferentiators?: Array<{ statement: string; strength?: number }>
  }
  noveltyAssessment?: {
    classification: string
    score: number
    reasoning: string
    strongestDifferentiators: string[]
  }
  validationQuestions?: string[]
  confidence?: number
}

// ---------------------------------------------------------------
// Agent 4 — Team Analysis
// ---------------------------------------------------------------
export interface TeamMemberProfile {
  memberId: string
  name: string
  parsedSkills: string[]
  primaryRole: string
  proficiencyLevels?: Record<string, "beginner" | "intermediate" | "expert">
  resumeSnippet: string
  githubUsername?: string
  yearsExperience?: number
}

export interface RoleAssignment {
  roleTitle: string
  assignedMemberId: string
  assignedMemberName: string
  workloadPercentage: number
  reasoning?: string
}

export interface SkillGap {
  missingCapability: string
  riskLevel: "low" | "medium" | "high"
  mitigationStrategy: string
}

export interface Feasibility {
  score: number
  summary: string
  teamStrengths: string[]
  teamWeaknesses: string[]
  timeRisk: "low" | "medium" | "high"
  technicalRisk: "low" | "medium" | "high"
  dataRisk: "low" | "medium" | "high"
  recommendations: string[]
}

export interface TechStackOption {
  optionId: string
  rank: number
  name: string
  description: string
  frontend: string[]
  backend: string[]
  database: string[]
  aiMl: string[]
  infrastructure: string[]
  otherTools?: string[]
  merits: string[]
  demerits: string[]
  teamFitScore: number
  overallScore: number
}

export interface TeamAnalysis {
  teamMembers: TeamMemberProfile[]
  roleAssignments: RoleAssignment[]
  skillGaps: SkillGap[]
  feasibility: Feasibility
  techStackOptions: TechStackOption[]
  selectedTechStack?: TechStackOption | null
  overallTeamStrategy: string
}

// ---------------------------------------------------------------
// Agent 5 — Architecture
// ---------------------------------------------------------------
export interface ArchitectureComponent {
  name: string
  type: string
  technology: string
  purpose: string
  responsibilities?: string[]
}

export interface ApiContract {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
  path: string
  description: string
}

export interface DatabaseModel {
  collectionName: string
  purpose: string
}

export interface ImplementationPhase {
  phase: number
  name: string
  description: string
  duration: string
  tasks?: Array<{ taskId: string; name: string; assignedRole?: string }>
}

export interface ArchitectureResult {
  architectureId: string
  selectedTechStack: {
    name: string
    rationale: string
    teamFitScore: number
  }
  architectureOverview: string
  components: ArchitectureComponent[]
  databaseSchema?: DatabaseModel[]
  apiContracts?: ApiContract[]
  aiArchitecture?: {
    llmModels?: Array<{ provider: string; model: string; purpose: string }>
    agentTools?: Array<{ name: string; purpose: string }>
  }
  risks?: Array<{
    id: string
    description: string
    severity: string
    mitigationStrategy: string
  }>
  implementationPlan?: ImplementationPhase[]
  hackathonTimeline?: {
    totalHours: number
    phases?: Array<{ phase: number; name: string; hours: number }>
  }
  confidence?: number
  estimatedDemoReadiness?: string
}
