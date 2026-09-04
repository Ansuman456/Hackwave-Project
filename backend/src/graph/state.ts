import { z } from "zod";
import { Annotation } from "@langchain/langgraph";

// ============================================================
// INPUT SCHEMAS
// ============================================================

export const StrategistInputSchema = z.object({
  problemStatement: z
    .string()
    .min(10, "Problem statement must be at least 10 characters"),
  resumes: z.array(z.string()).optional().default([]),
  hackathon: z
    .object({
      name: z.string().optional(),
      description: z.string().optional(),
      durationHours: z.number().positive().optional(),
      judgingCriteria: z
        .array(
          z.object({
            name: z.string(),
            weight: z.number().optional(),
            description: z.string().optional(),
          })
        )
        .optional(),
      rules: z.array(z.string()).optional(),
      restrictions: z.array(z.string()).optional(),
      allowedTechnologies: z.array(z.string()).optional(),
      forbiddenTechnologies: z.array(z.string()).optional(),
    })
    .optional(),
  userConstraints: z.array(z.string()).optional(),
  teamSize: z.number().positive().optional(),
});

export type StrategistInput = z.infer<typeof StrategistInputSchema>;

// ============================================================
// PROBLEM ANALYSIS OUTPUT SCHEMAS (Agent 1)
// ============================================================

export const TargetUserSchema = z.object({
  role: z.string(),
  context: z.string(),
  painLevel: z.number().min(0).max(10).optional(),
  evidence: z.enum(["explicit", "inferred"]),
  reason: z.string(),
});

export const PainPointSchema = z.object({
  description: z.string(),
  severity: z.enum(["low", "medium", "high"]),
  evidence: z.enum(["explicit", "inferred"]),
  reason: z.string(),
});

export const DesiredOutcomeSchema = z.object({
  description: z.string(),
  priority: z.enum(["high", "medium", "low"]),
  measurable: z.boolean().optional(),
});

export const ExplicitRequirementSchema = z.object({
  description: z.string(),
  type: z.enum(["functional", "non_functional"]),
  priority: z.enum(["must", "should", "could"]),
  evidence: z.enum(["explicit", "inferred"]),
  reason: z.string(),
});

export const InferredRequirementSchema = z.object({
  description: z.string(),
  type: z.enum(["functional", "non_functional"]),
  priority: z.enum(["must", "should", "could"]),
  evidence: z.enum(["explicit", "inferred"]),
  reason: z.string(),
});

export const ConstraintSchema = z.object({
  description: z.string(),
  category: z.enum([
    "time",
    "budget",
    "technical",
    "data",
    "hardware",
    "platform",
    "user",
    "regulatory",
    "hackathon",
    "other",
  ]),
  severity: z.enum(["low", "medium", "high"]),
  evidence: z.enum(["explicit", "inferred"]),
});

export const AssumptionSchema = z.object({
  statement: z.string(),
  confidence: z.number().min(0).max(1),
  reason: z.string(),
});

export const AmbiguitySchema = z.object({
  issue: z.string(),
  whyItMatters: z.string(),
  possibleInterpretations: z.array(z.string()),
  severity: z.enum(["low", "medium", "high"]),
});

export const ResearchQuestionSchema = z.object({
  question: z.string(),
  category: z.enum([
    "existing_solution",
    "technology",
    "user",
    "workflow",
    "market",
    "limitation",
    "hackathon",
    "open_source",
    "research",
    "other",
  ]),
  priority: z.enum(["high", "medium", "low"]),
});

export const ResearchDimensionSchema = z.object({
  name: z.enum([
    "commercial_products",
    "startups",
    "github",
    "open_source",
    "hackathons",
    "research",
    "blogs",
    "technical_approaches",
    "adjacent_solutions",
  ]),
  reason: z.string(),
  priority: z.enum(["high", "medium", "low"]),
  targetQueries: z.array(z.string()),
});

export const SearchConceptSchema = z.object({
  concept: z.string(),
  category: z.enum([
    "problem",
    "user",
    "domain",
    "mechanism",
    "technology",
    "product",
    "startup",
    "hackathon",
    "open_source",
    "research",
  ]),
  priority: z.enum(["high", "medium", "low"]),
  searchQueries: z.array(z.string()),
});

export const ProblemAnalysisSchema = z.object({
  coreProblem: z.string().min(10),
  problemSummary: z.string().min(20),
  targetUsers: z.array(TargetUserSchema).min(1),
  painPoints: z.array(PainPointSchema).min(1),
  desiredOutcomes: z.array(DesiredOutcomeSchema).min(1),
  explicitRequirements: z.array(ExplicitRequirementSchema),
  inferredRequirements: z.array(InferredRequirementSchema),
  constraints: z.array(ConstraintSchema),
  domainKeywords: z.array(z.string()).min(3),
  synonyms: z.array(z.string()),
  relatedConcepts: z.array(z.string()),
  mechanisms: z.array(z.string()),
  assumptions: z.array(AssumptionSchema),
  ambiguities: z.array(AmbiguitySchema),
  researchQuestions: z.array(ResearchQuestionSchema).min(4),
  researchDimensions: z.array(ResearchDimensionSchema).min(3),
  searchConcepts: z.array(SearchConceptSchema),
  successCriteria: z.array(z.string()),
  hackathonConsiderations: z.array(z.string()),
  analysisConfidence: z.number().min(0).max(1),
});

export type ProblemAnalysis = z.infer<typeof ProblemAnalysisSchema>;

// ============================================================
// RESEARCHER OUTPUT SCHEMAS (Agent 2) — FULL
// ============================================================

export const SourceSchema = z.object({
  id: z.string(),
  title: z.string(),
  url: z.string().url(),
  canonicalUrl: z.string(),
  domain: z.string(),
  sourceType: z.enum([
    "web",
    "product",
    "startup",
    "github",
    "open_source",
    "hackathon",
    "research",
    "blog",
    "other",
  ]),
  discoveredBy: z.array(z.enum(["gemini", "tavily", "github"])),
  searchQueryIds: z.array(z.string()),
  snippet: z.string().optional(),
  content: z.string().optional(),
  publishedAt: z.string().optional(),
  retrievedAt: z.string(),
  relevanceScore: z.number().min(0).max(1),
  authorityScore: z.number().min(0).max(1),
  extractionStatus: z.enum(["success", "partial", "failed"]),
  metadata: z.record(z.unknown()).default({}),
});

export type Source = z.infer<typeof SourceSchema>;

export const FeatureSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(5),
  category: z.enum([
    "core",
    "ai",
    "automation",
    "workflow",
    "analytics",
    "collaboration",
    "integration",
    "other",
  ]),
  sourceIds: z.array(z.string()).min(1),
});

export type Feature = z.infer<typeof FeatureSchema>;

export const WorkflowStepSchema = z.object({
  step: z.number().positive(),
  action: z.string(),
  description: z.string(),
  sourceIds: z.array(z.string()),
});

export type WorkflowStep = z.infer<typeof WorkflowStepSchema>;

export const DiscoveredSolutionSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  problemSolved: z.string(),
  targetUsers: z.array(z.string()),
  approach: z.string(),
  features: z.array(FeatureSchema),
  workflow: z.array(WorkflowStepSchema),
  inputs: z.array(z.string()),
  outputs: z.array(z.string()),
  technologies: z.array(z.string()),
  limitations: z.array(z.string()),
  website: z.string().optional(),
  githubRepository: z.string().optional(),
  sourceIds: z.array(z.string()).min(1),
  relationToProblem: z.enum(["direct", "adjacent", "technical"]),
  confidence: z.number().min(0).max(1),
  lastEnrichedAt: z.string(),
});

export type DiscoveredSolution = z.infer<typeof DiscoveredSolutionSchema>;

export const ContradictionSchema = z.object({
  solutionId: z.string(),
  field: z.string(),
  conflictingValues: z.array(z.string()),
  sourceIds: z.array(z.string()),
  status: z.enum(["unresolved", "resolved"]),
});

export type Contradiction = z.infer<typeof ContradictionSchema>;

export const ResearchResultSchema = z.object({
  researchId: z.string(),
  summary: z.object({
    queriesRun: z.number(),
    geminiSearchCalls: z.number(),
    tavilySearchCalls: z.number(),
    githubSearchCalls: z.number(),
    sourcesFound: z.number(),
    uniqueSources: z.number(),
    candidateEntities: z.number(),
    relevantSolutions: z.number(),
    directSolutions: z.number(),
    adjacentSolutions: z.number(),
    technicalApproaches: z.number(),
    enrichedSolutions: z.number(),
    discoveryRounds: z.number(),
    enrichmentRounds: z.number(),
  }),
  sources: z.array(SourceSchema),
  discoveredSolutions: z.array(DiscoveredSolutionSchema),
  coverage: z.object({
    commercialProducts: z.boolean(),
    startups: z.boolean(),
    githubRepos: z.boolean(),
    hackathons: z.boolean(),
    researchPapers: z.boolean(),
  }),
  unresolvedQuestions: z.array(z.string()),
  contradictions: z.array(ContradictionSchema),
  stoppingReason: z.enum([
    "coverage_sufficient",
    "diminishing_returns",
    "max_iterations",
    "budget_limit",
    "provider_failure",
  ]),
  quality: z.object({
    evidenceQuality: z.enum(["low", "medium", "high"]),
    coverageQuality: z.enum(["low", "medium", "high"]),
  }),
});

export type ResearchResult = z.infer<typeof ResearchResultSchema>;

// ============================================================
// INNOVATION OUTPUT SCHEMAS (Agent 3) — FULL
// ============================================================

export const SolutionClusterSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  solutionIds: z.array(z.string()),
  commonFeatures: z.array(z.string()),
  distinguishingCharacteristics: z.array(z.string()),
});

export type SolutionCluster = z.infer<typeof SolutionClusterSchema>;

export const FeatureLandscapeSchema = z.object({
  featureId: z.string(),
  canonicalName: z.string(),
  description: z.string(),
  category: z.string(),
  occurrenceCount: z.number(),
  totalRelevantSolutions: z.number(),
  frequency: z.number(),
  solutionIds: z.array(z.string()),
  frequencyClass: z.enum(["common", "moderate", "rare"]),
  variants: z.array(z.string()),
  evidenceSourceIds: z.array(z.string()),
});

export type FeatureLandscape = z.infer<typeof FeatureLandscapeSchema>;

export const InnovationGapSchema = z.object({
  id: z.string(),
  type: z.enum(["feature", "workflow", "user", "context", "constraint", "integration", "automation", "data", "other"]),
  title: z.string(),
  description: z.string(),
  supportingSolutionIds: z.array(z.string()),
  supportingSourceIds: z.array(z.string()),
  impact: z.number(),
  confidence: z.number(),
});

export type InnovationGap = z.infer<typeof InnovationGapSchema>;

export const DifferentiatorSchema = z.object({
  statement: z.string(),
  differenceType: z.enum(["feature", "workflow", "user", "context", "integration", "constraint", "automation", "combination"]),
  comparedToSolutionIds: z.array(z.string()),
  evidenceSourceIds: z.array(z.string()),
  strength: z.number(),
});

export type Differentiator = z.infer<typeof DifferentiatorSchema>;

export const CandidateIdeaSchema = z.object({
  id: z.string(),
  name: z.string(),
  oneLineDescription: z.string(),
  detailedDescription: z.string(),
  targetUsers: z.array(z.string()),
  problemSolved: z.string(),
  keyFeatures: z.array(FeatureSchema),
  workflow: z.array(WorkflowStepSchema),
  differentiators: z.array(DifferentiatorSchema),
  opportunityIds: z.array(z.string()),
  inspirationSources: z.array(z.string()),
  potentialRisks: z.array(z.string()),
  estimatedComplexity: z.enum(["low", "medium", "high"]),
  estimatedHackathonFit: z.number(),
  innovationScore: z.number(),
  impactScore: z.number(),
  differentiationScore: z.number(),
  overallConceptScore: z.number(),
});

export type CandidateIdea = z.infer<typeof CandidateIdeaSchema>;

export const NoveltyAssessmentSchema = z.object({
  classification: z.enum(["high_differentiation", "moderate_differentiation", "low_differentiation"]),
  score: z.number(),
  reasoning: z.string(),
  strongestDifferentiators: z.array(z.string()),
  majorOverlapAreas: z.array(z.string()),
  closestExistingSolutions: z.array(z.string()),
  evidenceSourceIds: z.array(z.string()),
  confidence: z.number(),
});

export const ProjectCapabilityRequirementsSchema = z.object({
  requiredCapabilities: z.array(z.string()),
  technicalCapabilities: z.array(z.string()),
  domainCapabilities: z.array(z.string()),
  likelyTeamRoles: z.array(z.string()),
  complexityAreas: z.array(z.string()),
  potentialSkillGaps: z.array(z.string()),
  criticalDependencies: z.array(z.string()),
});

export const InnovationResultSchema = z.object({
  innovationId: z.string(),
  candidateIdeas: z.array(CandidateIdeaSchema),
  selectedIdea: CandidateIdeaSchema.nullable().default(null),
  solutionLandscape: z.object({
    totalSolutions: z.number(),
    directSolutions: z.number(),
    adjacentSolutions: z.number(),
    dominantApproaches: z.array(z.string()),
    majorSolutionClusters: z.array(SolutionClusterSchema),
  }),
  featureLandscape: z.array(FeatureLandscapeSchema),
  identifiedGaps: z.array(InnovationGapSchema),
  differentiation: z.object({
    summary: z.string(),
    keyDifferentiators: z.array(DifferentiatorSchema),
  }),
  noveltyAssessment: NoveltyAssessmentSchema,
  projectCapabilityRequirements: ProjectCapabilityRequirementsSchema,
  validationQuestions: z.array(z.string()),
  confidence: z.number(),
});

export type InnovationResult = z.infer<typeof InnovationResultSchema>;

// ============================================================
// TEAM ANALYSIS SCHEMAS (Agent 4)
// ============================================================

export const TeamMemberProfileSchema = z.object({
  memberId: z.string(),
  name: z.string(),
  parsedSkills: z.array(z.string()),
  primaryRole: z.string(),
  proficiencyLevels: z.record(
    z.enum(["beginner", "intermediate", "expert"])
  ),
  resumeSnippet: z.string(),
  githubUsername: z.string().optional(),
  yearsExperience: z.number().optional(),
});

export const RoleAssignmentSchema = z.object({
  roleTitle: z.string(),
  assignedMemberId: z.string(),
  assignedMemberName: z.string(),
  assignedCapabilities: z.array(z.string()),
  assignedComponents: z.array(z.string()),
  workloadPercentage: z.number().min(0).max(100),
  reasoning: z.string(),
});

export const TeamSkillGapSchema = z.object({
  missingCapability: z.string(),
  riskLevel: z.enum(["low", "medium", "high"]),
  mitigationStrategy: z.string(),
});

export const DataAvailabilitySchema = z.object({
  dataType: z.string(),
  available: z.boolean(),
  source: z.string().optional(),
  acquisitionStrategy: z.string().optional(),
});

export const TechStackOptionSchema = z.object({
  optionId: z.string(),
  rank: z.number(),
  name: z.string(),
  description: z.string(),
  frontend: z.array(z.string()),
  backend: z.array(z.string()),
  database: z.array(z.string()),
  aiMl: z.array(z.string()),
  infrastructure: z.array(z.string()),
  otherTools: z.array(z.string()),
  architectureOverview: z.string(),
  setupComplexity: z.enum(["low", "medium", "high"]),
  timeToPrototype: z.string(),
  merits: z.array(z.string()),
  demerits: z.array(z.string()),
  teamFitScore: z.number().min(0).max(10),
  overallScore: z.number().min(0).max(10),
});

export const TeamAnalysisSchema = z.object({
  teamMembers: z.array(TeamMemberProfileSchema),
  roleAssignments: z.array(RoleAssignmentSchema),
  skillGaps: z.array(TeamSkillGapSchema),
  dataAvailability: z.array(DataAvailabilitySchema),
  expandedSolution: z.object({
    name: z.string(),
    description: z.string(),
    problemSolved: z.string(),
    targetUsers: z.array(z.string()),
    keyFeatures: z.array(z.string()),
    workflow: z.array(z.string()),
    requiredCapabilities: z.array(z.string()),
    technicalCapabilities: z.array(z.string()),
    complexityAreas: z.array(z.string()),
  }),
  feasibility: z.object({
    score: z.number().min(0).max(10),
    summary: z.string(),
    teamStrengths: z.array(z.string()),
    teamWeaknesses: z.array(z.string()),
    timeRisk: z.enum(["low", "medium", "high"]),
    technicalRisk: z.enum(["low", "medium", "high"]),
    dataRisk: z.enum(["low", "medium", "high"]),
    recommendations: z.array(z.string()),
  }),
  techStackOptions: z.array(TechStackOptionSchema),
  selectedTechStack: TechStackOptionSchema.nullable().default(null),
  overallTeamStrategy: z.string(),
});

export type TeamAnalysis = z.infer<typeof TeamAnalysisSchema>;
export type TeamMemberProfile = z.infer<typeof TeamMemberProfileSchema>;
export type RoleAssignment = z.infer<typeof RoleAssignmentSchema>;
export type TeamSkillGap = z.infer<typeof TeamSkillGapSchema>;
export type DataAvailability = z.infer<typeof DataAvailabilitySchema>;
export type TechStackOption = z.infer<typeof TechStackOptionSchema>;
export type ProjectCapabilityRequirements = z.infer<typeof ProjectCapabilityRequirementsSchema>;

// ============================================================
// AGENT 5 — TEAM SKILL GRAPH & TASK ALLOCATION
// ============================================================

export const SkillEvidenceSourceSchema = z.enum([
  "resume_skill",
  "resume_project",
  "github_repository",
  "github_readme",
  "github_language",
  "github_dependency",
  "github_commits",
]);
export type SkillEvidenceSource = z.infer<typeof SkillEvidenceSourceSchema>;

export const SkillEvidenceSchema = z.object({
  source: SkillEvidenceSourceSchema,
  referenceId: z.string(),
  description: z.string(),
  strength: z.number(),
});
export type SkillEvidence = z.infer<typeof SkillEvidenceSchema>;

export const SkillAssessmentSchema = z.object({
  skill: z.string(),
  normalizedSkill: z.string(),
  score: z.number().min(0).max(10),
  level: z.enum(["none", "beginner", "basic", "intermediate", "strong", "advanced"]),
  confidence: z.number().min(0).max(1),
  evidence: z.array(SkillEvidenceSchema),
  claimedByResume: z.boolean(),
  demonstratedOnGitHub: z.boolean(),
  evidenceAgreement: z.enum(["strong", "moderate", "weak", "conflicting"]),
});
export type SkillAssessment = z.infer<typeof SkillAssessmentSchema>;

export const ResumeProjectSchema = z.object({
  name: z.string(),
  description: z.string(),
  technologies: z.array(z.string()),
  responsibilities: z.array(z.string()),
  relevantCapabilities: z.array(z.string()),
});
export type ResumeProject = z.infer<typeof ResumeProjectSchema>;

export const MemberSkillProfileSchema = z.object({
  memberId: z.string(),
  memberName: z.string(),
  primaryRole: z.string(),
  githubUsername: z.string().optional(),
  portfolioUrl: z.string().optional(),
  yearsExperience: z.number().optional(),
  declaredSkills: z.array(z.string()),
  resumeProjects: z.array(ResumeProjectSchema),
  skillAssessments: z.array(SkillAssessmentSchema),
  strongestSkills: z.array(z.string()),
  secondarySkills: z.array(z.string()),
  skillGapAreas: z.array(z.string()),
});
export type MemberSkillProfile = z.infer<typeof MemberSkillProfileSchema>;

export const SkillGraphMemberSchema = z.object({
  memberId: z.string(),
  memberName: z.string(),
  strongestSkills: z.array(z.string()),
  secondarySkills: z.array(z.string()),
  skillGapAreas: z.array(z.string()),
});
export type SkillGraphMember = z.infer<typeof SkillGraphMemberSchema>;

export const SkillNodeSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.enum([
    "frontend",
    "backend",
    "database",
    "ai",
    "ml",
    "devops",
    "mobile",
    "design",
    "testing",
    "general",
    "other",
  ]),
  teamCoverage: z.number(),
});
export type SkillNode = z.infer<typeof SkillNodeSchema>;

export const MemberSkillEdgeSchema = z.object({
  memberId: z.string(),
  skillId: z.string(),
  strength: z.number(),
  confidence: z.number(),
  evidenceCount: z.number(),
  evidenceTypes: z.array(z.string()),
});
export type MemberSkillEdge = z.infer<typeof MemberSkillEdgeSchema>;

export const TeamCapabilitySchema = z.object({
  capability: z.string(),
  members: z.array(z.string()),
  strongestMemberId: z.string().optional(),
  coverageScore: z.number(),
  confidence: z.number(),
  risk: z.enum(["low", "medium", "high"]),
});
export type TeamCapability = z.infer<typeof TeamCapabilitySchema>;

export const SkillGraphSchema = z.object({
  members: z.array(SkillGraphMemberSchema),
  skills: z.array(SkillNodeSchema),
  memberSkillEdges: z.array(MemberSkillEdgeSchema),
  teamCapabilities: z.array(TeamCapabilitySchema),
});
export type SkillGraph = z.infer<typeof SkillGraphSchema>;

export const RequiredTaskSkillSchema = z.object({
  skill: z.string(),
  category: z.string(),
  requiredLevel: z.number().min(0).max(10),
  importance: z.enum(["critical", "high", "medium", "low"]),
});
export type RequiredTaskSkill = z.infer<typeof RequiredTaskSkillSchema>;

export const ProjectSkillRequirementSchema = z.object({
  id: z.string(),
  skill: z.string(),
  category: z.string(),
  importance: z.enum(["critical", "high", "medium", "low"]),
  requiredLevel: z.number(),
  minimumCoverage: z.number(),
  relatedTasks: z.array(z.string()),
});
export type ProjectSkillRequirement = z.infer<typeof ProjectSkillRequirementSchema>;

export const ProjectTaskSchema = z.object({
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
  requiredSkills: z.array(RequiredTaskSkillSchema),
  estimatedHours: z.number(),
  priority: z.enum(["critical", "high", "medium", "low"]),
  dependencies: z.array(z.string()),
  parallelizable: z.boolean(),
  deliverable: z.string(),
  acceptanceCriteria: z.array(z.string()),
});
export type ProjectTask = z.infer<typeof ProjectTaskSchema>;

export const TaskDependencyEdgeSchema = z.object({
  fromTaskId: z.string(),
  toTaskId: z.string(),
  type: z.enum(["required_before", "data_dependency", "integration_dependency", "soft_dependency"]),
});
export type TaskDependencyEdge = z.infer<typeof TaskDependencyEdgeSchema>;

export const TaskDependencyGraphSchema = z.object({
  tasks: z.array(z.string()),
  edges: z.array(TaskDependencyEdgeSchema),
  criticalPath: z.array(z.string()),
});
export type TaskDependencyGraph = z.infer<typeof TaskDependencyGraphSchema>;

export const CompatibilityScoreSchema = z.object({
  taskId: z.string(),
  memberId: z.string(),
  skillMatchScore: z.number(),
  experienceScore: z.number(),
  projectRelevanceScore: z.number(),
  confidenceScore: z.number(),
  availabilityScore: z.number(),
  roleCoherenceScore: z.number(),
  finalScore: z.number(),
  reasons: z.array(z.string()),
});
export type CompatibilityScore = z.infer<typeof CompatibilityScoreSchema>;

export const TaskContributionSchema = z.object({
  memberId: z.string(),
  role: z.enum(["primary", "secondary", "reviewer"]),
  estimatedHours: z.number(),
});
export type TaskContribution = z.infer<typeof TaskContributionSchema>;

export const TaskAssignmentSchema = z.object({
  taskId: z.string(),
  primaryOwnerId: z.string(),
  backupOwnerId: z.string().optional(),
  assignedHours: z.number(),
  skillMatchScore: z.number(),
  experienceMatchScore: z.number(),
  confidence: z.number(),
  assignmentReason: z.string(),
  dependenciesSatisfied: z.boolean(),
  contributions: z.array(TaskContributionSchema).default([]),
});
export type TaskAssignment = z.infer<typeof TaskAssignmentSchema>;

export const MemberWorkloadSchema = z.object({
  memberId: z.string(),
  availableHours: z.number(),
  assignedHours: z.number(),
  utilization: z.number(),
  taskIds: z.array(z.string()),
  criticalTaskCount: z.number(),
  risk: z.enum(["low", "medium", "high"]),
});
export type MemberWorkload = z.infer<typeof MemberWorkloadSchema>;

export const WorkstreamSchema = z.object({
  id: z.string(),
  name: z.string(),
  taskIds: z.array(z.string()),
  ownerIds: z.array(z.string()),
  startOrder: z.number(),
  dependsOnWorkstreams: z.array(z.string()),
});
export type Workstream = z.infer<typeof WorkstreamSchema>;

export const TeamRoleSchema = z.object({
  memberId: z.string(),
  primaryRole: z.string(),
  secondaryRole: z.string().optional(),
  justification: z.string(),
  confidence: z.number(),
});
export type TeamRole = z.infer<typeof TeamRoleSchema>;

export const TeamExecutionPlanSchema = z.object({
  assignments: z.array(TaskAssignmentSchema),
  memberWorkloads: z.array(MemberWorkloadSchema),
  criticalPath: z.array(z.string()),
  bottlenecks: z.array(z.string()),
  backupCoverage: z.array(z.string()),
  parallelWorkstreams: z.array(WorkstreamSchema),
  recommendedTeamStructure: z.array(TeamRoleSchema),
});
export type TeamExecutionPlan = z.infer<typeof TeamExecutionPlanSchema>;

export const SkillGapSchema = z.object({
  skill: z.string(),
  requiredLevel: z.number(),
  currentTeamLevel: z.number(),
  severity: z.enum(["low", "medium", "high", "blocking"]),
  affectedTasks: z.array(z.string()),
  mitigation: z.string(),
});
export type SkillGap = z.infer<typeof SkillGapSchema>;

export const TeamBottleneckSchema = z.object({
  type: z.enum(["skill", "person", "dependency", "time", "integration"]),
  description: z.string(),
  affectedTasks: z.array(z.string()),
  severity: z.enum(["low", "medium", "high"]),
  mitigation: z.string(),
});
export type TeamBottleneck = z.infer<typeof TeamBottleneckSchema>;

export const RecommendationSchema = z.object({
  type: z.string(),
  description: z.string(),
  priority: z.enum(["low", "medium", "high"]),
});
export type Recommendation = z.infer<typeof RecommendationSchema>;

export const TeamCapabilitySummarySchema = z.object({
  strongestCapabilities: z.array(z.string()),
  coveredRequirements: z.array(z.string()),
  uncoveredRequirements: z.array(z.string()),
  criticalSkillsAvailable: z.array(z.string()),
  criticalSkillsMissing: z.array(z.string()),
  bottleneckSkills: z.array(z.string()),
  overallTeamFitScore: z.number(),
});
export type TeamCapabilitySummary = z.infer<typeof TeamCapabilitySummarySchema>;

export const TeamFitAnalysisSchema = z.object({
  score: z.number().min(0).max(10),
  skillCoverageScore: z.number(),
  skillConfidenceScore: z.number(),
  criticalSkillAvailabilityScore: z.number(),
  dataCapabilityScore: z.number(),
  implementationTimeScore: z.number(),
  summary: z.string(),
});
export type TeamFitAnalysis = z.infer<typeof TeamFitAnalysisSchema>;

export const TeamSkillAnalysisSchema = z.object({
  teamSkillAnalysisId: z.string(),
  memberProfiles: z.array(MemberSkillProfileSchema),
  skillGraph: SkillGraphSchema,
  projectSkillRequirements: z.array(ProjectSkillRequirementSchema),
  projectTasks: z.array(ProjectTaskSchema),
  taskDependencyGraph: TaskDependencyGraphSchema,
  compatibilityMatrix: z.array(CompatibilityScoreSchema),
  assignments: z.array(TaskAssignmentSchema),
  workloads: z.array(MemberWorkloadSchema),
  teamExecutionPlan: TeamExecutionPlanSchema,
  teamFit: TeamFitAnalysisSchema,
  capabilitySummary: TeamCapabilitySummarySchema,
  skillGaps: z.array(SkillGapSchema),
  bottlenecks: z.array(TeamBottleneckSchema),
  recommendations: z.array(RecommendationSchema),
  integrationOwnerId: z.string().optional(),
  demoOwnerId: z.string().optional(),
  status: z.enum(["completed", "conditionally_feasible", "infeasible"]),
  confidence: z.number().min(0).max(1),
});
export type TeamSkillAnalysis = z.infer<typeof TeamSkillAnalysisSchema>;

// ============================================================
// ARCHITECTURE, JUDGE, BUILD — PLACEHOLDERS
// ============================================================

export const ArchitectureResultSchema = z.record(z.unknown());
export type ArchitectureResult = z.infer<typeof ArchitectureResultSchema>;

export const JudgeResultSchema = z.record(z.unknown());
export type JudgeResult = z.infer<typeof JudgeResultSchema>;

export const BuildResultSchema = z.record(z.unknown());
export type BuildResult = z.infer<typeof BuildResultSchema>;

// ============================================================
// WORKFLOW STATE
// ============================================================

export const ImprovementIterationSchema = z.object({
  version: z.number(),
  score: z.number(),
  changedBy: z.array(z.string()),
  weaknessesAddressed: z.array(z.string()),
  summary: z.string(),
  timestamp: z.string(),
});

export const WorkflowErrorSchema = z.object({
  agent: z.string(),
  node: z.string(),
  error: z.string(),
  timestamp: z.string(),
  recoverable: z.boolean(),
});

export const UsageMetricsSchema = z.object({
  geminiCalls: z.number().default(0),
  geminiSearchCalls: z.number().default(0),
  tavilyCalls: z.number().default(0),
  githubCalls: z.number().default(0),
  llmTokens: z.number().default(0),
  cacheHits: z.number().default(0),
  cacheMisses: z.number().default(0),
});

export const HackathonStateSchema = z.object({
  projectId: z.string(),
  input: StrategistInputSchema,
  problemAnalysis: ProblemAnalysisSchema.nullable().default(null),
  research: ResearchResultSchema.nullable().default(null),
  innovation: InnovationResultSchema.nullable().default(null),
  teamAnalysis: TeamAnalysisSchema.nullable().default(null),
  teamSkillAnalysis: TeamSkillAnalysisSchema.nullable().default(null),
  architecture: ArchitectureResultSchema.nullable().default(null),
  judging: JudgeResultSchema.nullable().default(null),
  improvementHistory: z.array(ImprovementIterationSchema).default([]),
  selectedVersion: z.number().default(0),
  build: BuildResultSchema.nullable().default(null),
  status: z
    .enum(["idle", "running", "paused", "completed", "failed", "cancel_requested", "awaiting_selection"])
    .default("idle"),
  errors: z.array(WorkflowErrorSchema).default([]),
  usage: UsageMetricsSchema.default({
    geminiCalls: 0,
    geminiSearchCalls: 0,
    tavilyCalls: 0,
    githubCalls: 0,
    llmTokens: 0,
    cacheHits: 0,
    cacheMisses: 0,
  }),
});

export type HackathonState = z.infer<typeof HackathonStateSchema>;

export function createInitialState(
  projectId: string,
  input: StrategistInput
): HackathonState {
  return {
    projectId,
    input: {
      ...input,
      resumes: input.resumes || [],
    },
    problemAnalysis: null,
    research: null,
    innovation: null,
    teamAnalysis: null,
    teamSkillAnalysis: null,
    architecture: null,
    judging: null,
    improvementHistory: [],
    selectedVersion: 0,
    build: null,
    status: "running",
    errors: [],
    usage: {
      geminiCalls: 0,
      geminiSearchCalls: 0,
      tavilyCalls: 0,
      githubCalls: 0,
      llmTokens: 0,
      cacheHits: 0,
      cacheMisses: 0,
    },
  };
}

// ============================================================
// LANGGRAPH ANNOTATION (for StateGraph)
// ============================================================

// Generic replace-on-update reducer
const replaceReducer = <T>(current: T, update: T | null | undefined): T =>
  (update ?? current) as T;

export const HackathonStateAnnotation = Annotation.Root({
  projectId: Annotation<string>,
  input: Annotation<StrategistInput>,
  problemAnalysis: Annotation<ProblemAnalysis | null>({
    reducer: replaceReducer,
    default: () => null,
  }),
  research: Annotation<ResearchResult | null>({
    reducer: replaceReducer,
    default: () => null,
  }),
  innovation: Annotation<InnovationResult | null>({
    reducer: replaceReducer,
    default: () => null,
  }),
  teamAnalysis: Annotation<TeamAnalysis | null>({
    reducer: replaceReducer,
    default: () => null,
  }),
  teamSkillAnalysis: Annotation<TeamSkillAnalysis | null>({
    reducer: replaceReducer,
    default: () => null,
  }),
  architecture: Annotation<ArchitectureResult | null>({
    reducer: replaceReducer,
    default: () => null,
  }),
  judging: Annotation<JudgeResult | null>({
    reducer: replaceReducer,
    default: () => null,
  }),
  improvementHistory: Annotation<z.infer<typeof ImprovementIterationSchema>[]>({
    reducer: (current, update) => [...(current || []), ...(update || [])],
    default: () => [],
  }),
  selectedVersion: Annotation<number>({
    reducer: replaceReducer,
    default: () => 0,
  }),
  build: Annotation<BuildResult | null>({
    reducer: replaceReducer,
    default: () => null,
  }),
  status: Annotation<
    "idle" | "running" | "paused" | "completed" | "failed" | "cancel_requested" | "awaiting_selection"
  >({
    reducer: replaceReducer,
    default: () => "idle" as const,
  }),
  errors: Annotation<z.infer<typeof WorkflowErrorSchema>[]>({
    reducer: (current, update) => [...(current || []), ...(update || [])],
    default: () => [],
  }),
  usage: Annotation<z.infer<typeof UsageMetricsSchema>>({
    reducer: (current, update) => ({
      geminiCalls: (current?.geminiCalls || 0) + (update?.geminiCalls || 0),
      geminiSearchCalls: (current?.geminiSearchCalls || 0) + (update?.geminiSearchCalls || 0),
      tavilyCalls: (current?.tavilyCalls || 0) + (update?.tavilyCalls || 0),
      githubCalls: (current?.githubCalls || 0) + (update?.githubCalls || 0),
      llmTokens: (current?.llmTokens || 0) + (update?.llmTokens || 0),
      cacheHits: (current?.cacheHits || 0) + (update?.cacheHits || 0),
      cacheMisses: (current?.cacheMisses || 0) + (update?.cacheMisses || 0),
    }),
    default: () => ({
      geminiCalls: 0,
      geminiSearchCalls: 0,
      tavilyCalls: 0,
      githubCalls: 0,
      llmTokens: 0,
      cacheHits: 0,
      cacheMisses: 0,
    }),
  }),
});
