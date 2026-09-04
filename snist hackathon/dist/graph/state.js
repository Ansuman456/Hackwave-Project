"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsageMetricsSchema = exports.WorkflowErrorSchema = exports.ImprovementIterationSchema = exports.BuildResultSchema = exports.JudgeResultSchema = exports.ArchitectureResultSchema = exports.ImplementationPhaseSchema = exports.TaskDependencySchema = exports.TechnicalRiskSchema = exports.ExternalServiceSchema = exports.RagArchitectureSchema = exports.AiArchitectureSchema = exports.ApiContractSchema = exports.DatabaseModelSchema = exports.DataFlowStepSchema = exports.ComponentSchema = exports.TechChoiceSchema = exports.TeamAnalysisSchema = exports.TechStackOptionSchema = exports.DataAvailabilitySchema = exports.TeamSkillGapSchema = exports.RoleAssignmentSchema = exports.TeamMemberProfileSchema = exports.InnovationResultSchema = exports.ProjectCapabilityRequirementsSchema = exports.NoveltyAssessmentSchema = exports.CandidateIdeaSchema = exports.DifferentiatorSchema = exports.InnovationGapSchema = exports.FeatureLandscapeSchema = exports.SolutionClusterSchema = exports.ResearchResultSchema = exports.ContradictionSchema = exports.DiscoveredSolutionSchema = exports.WorkflowStepSchema = exports.FeatureSchema = exports.SourceSchema = exports.ProblemAnalysisSchema = exports.SearchConceptSchema = exports.ResearchDimensionSchema = exports.ResearchQuestionSchema = exports.AmbiguitySchema = exports.AssumptionSchema = exports.ConstraintSchema = exports.InferredRequirementSchema = exports.ExplicitRequirementSchema = exports.DesiredOutcomeSchema = exports.PainPointSchema = exports.TargetUserSchema = exports.StrategistInputSchema = void 0;
exports.HackathonStateAnnotation = exports.HackathonStateSchema = void 0;
exports.createInitialState = createInitialState;
const zod_1 = require("zod");
const langgraph_1 = require("@langchain/langgraph");
// ============================================================
// INPUT SCHEMAS
// ============================================================
exports.StrategistInputSchema = zod_1.z.object({
    problemStatement: zod_1.z
        .string()
        .min(10, "Problem statement must be at least 10 characters"),
    resumes: zod_1.z.array(zod_1.z.string()).optional().default([]),
    githubLinks: zod_1.z
        .array(zod_1.z.object({
        githubProfileUrl: zod_1.z.string().url(),
        username: zod_1.z.string().min(1),
        role: zod_1.z.string().optional(),
    }))
        .optional()
        .default([]),
    hackathon: zod_1.z
        .object({
        name: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        durationHours: zod_1.z.number().positive().optional(),
        judgingCriteria: zod_1.z
            .array(zod_1.z.object({
            name: zod_1.z.string(),
            weight: zod_1.z.number().optional(),
            description: zod_1.z.string().optional(),
        }))
            .optional(),
        rules: zod_1.z.array(zod_1.z.string()).optional(),
        restrictions: zod_1.z.array(zod_1.z.string()).optional(),
        allowedTechnologies: zod_1.z.array(zod_1.z.string()).optional(),
        forbiddenTechnologies: zod_1.z.array(zod_1.z.string()).optional(),
    })
        .optional(),
    userConstraints: zod_1.z.array(zod_1.z.string()).optional(),
    teamSize: zod_1.z.number().positive().optional(),
});
// ============================================================
// PROBLEM ANALYSIS OUTPUT SCHEMAS (Agent 1)
// ============================================================
exports.TargetUserSchema = zod_1.z.object({
    role: zod_1.z.string(),
    context: zod_1.z.string(),
    painLevel: zod_1.z.number().min(0).max(10).nullable().optional(),
    evidence: zod_1.z.enum(["explicit", "inferred"]),
    reason: zod_1.z.string(),
});
exports.PainPointSchema = zod_1.z.object({
    description: zod_1.z.string(),
    severity: zod_1.z.enum(["low", "medium", "high"]),
    evidence: zod_1.z.enum(["explicit", "inferred"]),
    reason: zod_1.z.string(),
});
exports.DesiredOutcomeSchema = zod_1.z.object({
    description: zod_1.z.string(),
    priority: zod_1.z.enum(["high", "medium", "low"]),
    measurable: zod_1.z.boolean().nullable().optional(),
});
exports.ExplicitRequirementSchema = zod_1.z.object({
    description: zod_1.z.string(),
    type: zod_1.z.enum(["functional", "non_functional"]),
    priority: zod_1.z.enum(["must", "should", "could"]),
    evidence: zod_1.z.enum(["explicit", "inferred"]),
    reason: zod_1.z.string(),
});
exports.InferredRequirementSchema = zod_1.z.object({
    description: zod_1.z.string(),
    type: zod_1.z.enum(["functional", "non_functional"]),
    priority: zod_1.z.enum(["must", "should", "could"]),
    evidence: zod_1.z.enum(["explicit", "inferred"]),
    reason: zod_1.z.string(),
});
exports.ConstraintSchema = zod_1.z.object({
    description: zod_1.z.string(),
    category: zod_1.z.enum([
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
    severity: zod_1.z.enum(["low", "medium", "high"]),
    evidence: zod_1.z.enum(["explicit", "inferred"]),
});
exports.AssumptionSchema = zod_1.z.object({
    statement: zod_1.z.string(),
    confidence: zod_1.z.number().min(0).max(1),
    reason: zod_1.z.string(),
});
exports.AmbiguitySchema = zod_1.z.object({
    issue: zod_1.z.string(),
    whyItMatters: zod_1.z.string(),
    possibleInterpretations: zod_1.z.array(zod_1.z.string()),
    severity: zod_1.z.enum(["low", "medium", "high"]),
});
exports.ResearchQuestionSchema = zod_1.z.object({
    question: zod_1.z.string(),
    category: zod_1.z.enum([
        "existing_solution",
        "technology",
        "user",
        "workflow",
        "market",
        "limitation",
        "hackathon",
        "open_source",
        "research",
        "technical_approaches",
        "other",
    ]),
    priority: zod_1.z.enum(["high", "medium", "low"]),
});
exports.ResearchDimensionSchema = zod_1.z.object({
    name: zod_1.z.enum([
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
    reason: zod_1.z.string(),
    priority: zod_1.z.enum(["high", "medium", "low"]),
    targetQueries: zod_1.z.array(zod_1.z.string()),
});
exports.SearchConceptSchema = zod_1.z.object({
    concept: zod_1.z.string(),
    category: zod_1.z.enum([
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
    priority: zod_1.z.enum(["high", "medium", "low"]),
    searchQueries: zod_1.z.array(zod_1.z.string()),
});
exports.ProblemAnalysisSchema = zod_1.z.object({
    coreProblem: zod_1.z.string().min(10),
    problemSummary: zod_1.z.string().min(20),
    targetUsers: zod_1.z.array(exports.TargetUserSchema).min(1),
    painPoints: zod_1.z.array(exports.PainPointSchema).min(1),
    desiredOutcomes: zod_1.z.array(exports.DesiredOutcomeSchema).min(1),
    explicitRequirements: zod_1.z.array(exports.ExplicitRequirementSchema),
    inferredRequirements: zod_1.z.array(exports.InferredRequirementSchema),
    constraints: zod_1.z.array(exports.ConstraintSchema),
    domainKeywords: zod_1.z.array(zod_1.z.string()).min(3),
    synonyms: zod_1.z.array(zod_1.z.string()),
    relatedConcepts: zod_1.z.array(zod_1.z.string()),
    mechanisms: zod_1.z.array(zod_1.z.string()),
    assumptions: zod_1.z.array(exports.AssumptionSchema),
    ambiguities: zod_1.z.array(exports.AmbiguitySchema),
    researchQuestions: zod_1.z.array(exports.ResearchQuestionSchema).min(4),
    researchDimensions: zod_1.z.array(exports.ResearchDimensionSchema).min(3),
    searchConcepts: zod_1.z.array(exports.SearchConceptSchema),
    successCriteria: zod_1.z.array(zod_1.z.string()),
    hackathonConsiderations: zod_1.z.array(zod_1.z.string()),
    analysisConfidence: zod_1.z.number().min(0).max(1),
});
// ============================================================
// RESEARCHER OUTPUT SCHEMAS (Agent 2) — FULL
// ============================================================
exports.SourceSchema = zod_1.z.object({
    id: zod_1.z.string(),
    title: zod_1.z.string(),
    url: zod_1.z.string().url(),
    canonicalUrl: zod_1.z.string(),
    domain: zod_1.z.string(),
    sourceType: zod_1.z.enum([
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
    discoveredBy: zod_1.z.array(zod_1.z.enum(["gemini", "tavily", "github"])),
    searchQueryIds: zod_1.z.array(zod_1.z.string()),
    snippet: zod_1.z.string().nullable().optional(),
    content: zod_1.z.string().nullable().optional(),
    publishedAt: zod_1.z.string().nullable().optional(),
    retrievedAt: zod_1.z.string(),
    relevanceScore: zod_1.z.number().min(0).max(1),
    authorityScore: zod_1.z.number().min(0).max(1),
    extractionStatus: zod_1.z.enum(["success", "partial", "failed"]),
    metadata: zod_1.z.record(zod_1.z.unknown()).default({}),
});
exports.FeatureSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    description: zod_1.z.string().min(5),
    category: zod_1.z.enum([
        "core",
        "ai",
        "automation",
        "workflow",
        "analytics",
        "collaboration",
        "integration",
        "other",
    ]),
    sourceIds: zod_1.z.array(zod_1.z.string()).min(1),
});
exports.WorkflowStepSchema = zod_1.z.object({
    step: zod_1.z.number().positive(),
    action: zod_1.z.string(),
    description: zod_1.z.string(),
    sourceIds: zod_1.z.array(zod_1.z.string()),
});
exports.DiscoveredSolutionSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    description: zod_1.z.string(),
    problemSolved: zod_1.z.string(),
    targetUsers: zod_1.z.array(zod_1.z.string()),
    approach: zod_1.z.string(),
    features: zod_1.z.array(exports.FeatureSchema),
    workflow: zod_1.z.array(exports.WorkflowStepSchema),
    inputs: zod_1.z.array(zod_1.z.string()),
    outputs: zod_1.z.array(zod_1.z.string()),
    technologies: zod_1.z.array(zod_1.z.string()),
    limitations: zod_1.z.array(zod_1.z.string()),
    website: zod_1.z.string().nullable().optional(),
    githubRepository: zod_1.z.string().nullable().optional(),
    sourceIds: zod_1.z.array(zod_1.z.string()).min(1),
    relationToProblem: zod_1.z.enum(["direct", "adjacent", "technical"]),
    confidence: zod_1.z.number().min(0).max(1),
    lastEnrichedAt: zod_1.z.string(),
});
exports.ContradictionSchema = zod_1.z.object({
    solutionId: zod_1.z.string(),
    field: zod_1.z.string(),
    conflictingValues: zod_1.z.array(zod_1.z.string()),
    sourceIds: zod_1.z.array(zod_1.z.string()),
    status: zod_1.z.enum(["unresolved", "resolved"]),
});
exports.ResearchResultSchema = zod_1.z.object({
    researchId: zod_1.z.string(),
    summary: zod_1.z.object({
        queriesRun: zod_1.z.number(),
        geminiSearchCalls: zod_1.z.number(),
        tavilySearchCalls: zod_1.z.number(),
        githubSearchCalls: zod_1.z.number(),
        sourcesFound: zod_1.z.number(),
        uniqueSources: zod_1.z.number(),
        candidateEntities: zod_1.z.number(),
        relevantSolutions: zod_1.z.number(),
        directSolutions: zod_1.z.number(),
        adjacentSolutions: zod_1.z.number(),
        technicalApproaches: zod_1.z.number(),
        enrichedSolutions: zod_1.z.number(),
        discoveryRounds: zod_1.z.number(),
        enrichmentRounds: zod_1.z.number(),
    }),
    sources: zod_1.z.array(exports.SourceSchema),
    discoveredSolutions: zod_1.z.array(exports.DiscoveredSolutionSchema),
    coverage: zod_1.z.object({
        commercialProducts: zod_1.z.boolean(),
        startups: zod_1.z.boolean(),
        githubRepos: zod_1.z.boolean(),
        hackathons: zod_1.z.boolean(),
        researchPapers: zod_1.z.boolean(),
    }),
    unresolvedQuestions: zod_1.z.array(zod_1.z.string()),
    contradictions: zod_1.z.array(exports.ContradictionSchema),
    stoppingReason: zod_1.z.enum([
        "coverage_sufficient",
        "diminishing_returns",
        "max_iterations",
        "budget_limit",
        "provider_failure",
    ]),
    quality: zod_1.z.object({
        evidenceQuality: zod_1.z.enum(["low", "medium", "high"]),
        coverageQuality: zod_1.z.enum(["low", "medium", "high"]),
    }),
});
// ============================================================
// INNOVATION OUTPUT SCHEMAS (Agent 3) — FULL
// ============================================================
exports.SolutionClusterSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    description: zod_1.z.string(),
    solutionIds: zod_1.z.array(zod_1.z.string()),
    commonFeatures: zod_1.z.array(zod_1.z.string()),
    distinguishingCharacteristics: zod_1.z.array(zod_1.z.string()),
});
exports.FeatureLandscapeSchema = zod_1.z.object({
    featureId: zod_1.z.string(),
    canonicalName: zod_1.z.string(),
    description: zod_1.z.string(),
    category: zod_1.z.string(),
    occurrenceCount: zod_1.z.number(),
    totalRelevantSolutions: zod_1.z.number(),
    frequency: zod_1.z.number(),
    solutionIds: zod_1.z.array(zod_1.z.string()),
    frequencyClass: zod_1.z.enum(["common", "moderate", "rare"]),
    variants: zod_1.z.array(zod_1.z.string()),
    evidenceSourceIds: zod_1.z.array(zod_1.z.string()),
});
exports.InnovationGapSchema = zod_1.z.object({
    id: zod_1.z.string(),
    type: zod_1.z.enum(["feature", "workflow", "user", "context", "constraint", "integration", "automation", "data", "other"]),
    title: zod_1.z.string(),
    description: zod_1.z.string(),
    supportingSolutionIds: zod_1.z.array(zod_1.z.string()),
    supportingSourceIds: zod_1.z.array(zod_1.z.string()),
    impact: zod_1.z.number(),
    confidence: zod_1.z.number(),
});
exports.DifferentiatorSchema = zod_1.z.object({
    statement: zod_1.z.string(),
    differenceType: zod_1.z.enum(["feature", "workflow", "user", "context", "integration", "constraint", "automation", "combination"]),
    comparedToSolutionIds: zod_1.z.array(zod_1.z.string()),
    evidenceSourceIds: zod_1.z.array(zod_1.z.string()),
    strength: zod_1.z.number(),
});
exports.CandidateIdeaSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    oneLineDescription: zod_1.z.string(),
    detailedDescription: zod_1.z.string(),
    targetUsers: zod_1.z.array(zod_1.z.string()),
    problemSolved: zod_1.z.string(),
    keyFeatures: zod_1.z.array(exports.FeatureSchema),
    workflow: zod_1.z.array(exports.WorkflowStepSchema),
    differentiators: zod_1.z.array(exports.DifferentiatorSchema),
    opportunityIds: zod_1.z.array(zod_1.z.string()),
    inspirationSources: zod_1.z.array(zod_1.z.string()),
    potentialRisks: zod_1.z.array(zod_1.z.string()),
    estimatedComplexity: zod_1.z.enum(["low", "medium", "high"]),
    estimatedHackathonFit: zod_1.z.number(),
    innovationScore: zod_1.z.number(),
    impactScore: zod_1.z.number(),
    differentiationScore: zod_1.z.number(),
    overallConceptScore: zod_1.z.number(),
});
exports.NoveltyAssessmentSchema = zod_1.z.object({
    classification: zod_1.z.enum(["high_differentiation", "moderate_differentiation", "low_differentiation"]),
    score: zod_1.z.number(),
    reasoning: zod_1.z.string(),
    strongestDifferentiators: zod_1.z.array(zod_1.z.string()),
    majorOverlapAreas: zod_1.z.array(zod_1.z.string()),
    closestExistingSolutions: zod_1.z.array(zod_1.z.string()),
    evidenceSourceIds: zod_1.z.array(zod_1.z.string()),
    confidence: zod_1.z.number(),
});
exports.ProjectCapabilityRequirementsSchema = zod_1.z.object({
    requiredCapabilities: zod_1.z.array(zod_1.z.string()),
    technicalCapabilities: zod_1.z.array(zod_1.z.string()),
    domainCapabilities: zod_1.z.array(zod_1.z.string()),
    likelyTeamRoles: zod_1.z.array(zod_1.z.string()),
    complexityAreas: zod_1.z.array(zod_1.z.string()),
    potentialSkillGaps: zod_1.z.array(zod_1.z.string()),
    criticalDependencies: zod_1.z.array(zod_1.z.string()),
});
exports.InnovationResultSchema = zod_1.z.object({
    innovationId: zod_1.z.string(),
    candidateIdeas: zod_1.z.array(exports.CandidateIdeaSchema),
    selectedIdea: exports.CandidateIdeaSchema.nullable().default(null),
    solutionLandscape: zod_1.z.object({
        totalSolutions: zod_1.z.number(),
        directSolutions: zod_1.z.number(),
        adjacentSolutions: zod_1.z.number(),
        dominantApproaches: zod_1.z.array(zod_1.z.string()),
        majorSolutionClusters: zod_1.z.array(exports.SolutionClusterSchema),
    }),
    featureLandscape: zod_1.z.array(exports.FeatureLandscapeSchema),
    identifiedGaps: zod_1.z.array(exports.InnovationGapSchema),
    differentiation: zod_1.z.object({
        summary: zod_1.z.string(),
        keyDifferentiators: zod_1.z.array(exports.DifferentiatorSchema),
    }),
    noveltyAssessment: exports.NoveltyAssessmentSchema,
    projectCapabilityRequirements: exports.ProjectCapabilityRequirementsSchema,
    validationQuestions: zod_1.z.array(zod_1.z.string()),
    confidence: zod_1.z.number(),
});
// ============================================================
// TEAM ANALYSIS SCHEMAS (Agent 4)
// ============================================================
exports.TeamMemberProfileSchema = zod_1.z.object({
    memberId: zod_1.z.string(),
    name: zod_1.z.string(),
    parsedSkills: zod_1.z.array(zod_1.z.string()),
    primaryRole: zod_1.z.string(),
    proficiencyLevels: zod_1.z.record(zod_1.z.enum(["beginner", "intermediate", "expert"])),
    resumeSnippet: zod_1.z.string(),
    githubUsername: zod_1.z.string().optional(),
    yearsExperience: zod_1.z.number().optional(),
});
exports.RoleAssignmentSchema = zod_1.z.object({
    roleTitle: zod_1.z.string(),
    assignedMemberId: zod_1.z.string(),
    assignedMemberName: zod_1.z.string(),
    assignedCapabilities: zod_1.z.array(zod_1.z.string()),
    assignedComponents: zod_1.z.array(zod_1.z.string()),
    workloadPercentage: zod_1.z.number().min(0).max(100),
    reasoning: zod_1.z.string(),
});
exports.TeamSkillGapSchema = zod_1.z.object({
    missingCapability: zod_1.z.string(),
    riskLevel: zod_1.z.enum(["low", "medium", "high"]),
    mitigationStrategy: zod_1.z.string(),
});
exports.DataAvailabilitySchema = zod_1.z.object({
    dataType: zod_1.z.string(),
    available: zod_1.z.boolean(),
    source: zod_1.z.string().optional(),
    acquisitionStrategy: zod_1.z.string().optional(),
});
exports.TechStackOptionSchema = zod_1.z.object({
    optionId: zod_1.z.string(),
    rank: zod_1.z.number(),
    name: zod_1.z.string(),
    description: zod_1.z.string(),
    frontend: zod_1.z.array(zod_1.z.string()),
    backend: zod_1.z.array(zod_1.z.string()),
    database: zod_1.z.array(zod_1.z.string()),
    aiMl: zod_1.z.array(zod_1.z.string()),
    infrastructure: zod_1.z.array(zod_1.z.string()),
    otherTools: zod_1.z.array(zod_1.z.string()),
    architectureOverview: zod_1.z.string(),
    setupComplexity: zod_1.z.enum(["low", "medium", "high"]),
    timeToPrototype: zod_1.z.string(),
    merits: zod_1.z.array(zod_1.z.string()),
    demerits: zod_1.z.array(zod_1.z.string()),
    teamFitScore: zod_1.z.number().min(0).max(10),
    overallScore: zod_1.z.number().min(0).max(10),
});
exports.TeamAnalysisSchema = zod_1.z.object({
    teamMembers: zod_1.z.array(exports.TeamMemberProfileSchema),
    roleAssignments: zod_1.z.array(exports.RoleAssignmentSchema),
    skillGaps: zod_1.z.array(exports.TeamSkillGapSchema),
    dataAvailability: zod_1.z.array(exports.DataAvailabilitySchema),
    expandedSolution: zod_1.z.object({
        name: zod_1.z.string(),
        description: zod_1.z.string(),
        problemSolved: zod_1.z.string(),
        targetUsers: zod_1.z.array(zod_1.z.string()),
        keyFeatures: zod_1.z.array(zod_1.z.string()),
        workflow: zod_1.z.array(zod_1.z.string()),
        requiredCapabilities: zod_1.z.array(zod_1.z.string()),
        technicalCapabilities: zod_1.z.array(zod_1.z.string()),
        complexityAreas: zod_1.z.array(zod_1.z.string()),
    }),
    feasibility: zod_1.z.object({
        score: zod_1.z.number().min(0).max(10),
        summary: zod_1.z.string(),
        teamStrengths: zod_1.z.array(zod_1.z.string()),
        teamWeaknesses: zod_1.z.array(zod_1.z.string()),
        timeRisk: zod_1.z.enum(["low", "medium", "high"]),
        technicalRisk: zod_1.z.enum(["low", "medium", "high"]),
        dataRisk: zod_1.z.enum(["low", "medium", "high"]),
        recommendations: zod_1.z.array(zod_1.z.string()),
    }),
    techStackOptions: zod_1.z.array(exports.TechStackOptionSchema),
    selectedTechStack: exports.TechStackOptionSchema.nullable().default(null),
    overallTeamStrategy: zod_1.z.string(),
});
// ============================================================
// ARCHITECTURE OUTPUT SCHEMAS (Agent 5 — CTO)
// ============================================================
exports.TechChoiceSchema = zod_1.z.object({
    optionId: zod_1.z.string(),
    name: zod_1.z.string(),
    rationale: zod_1.z.string(),
    teamFitScore: zod_1.z.number().min(0).max(10),
    components: zod_1.z.array(zod_1.z.string()),
});
exports.ComponentSchema = zod_1.z.object({
    name: zod_1.z.string(),
    type: zod_1.z.enum(["frontend", "backend", "ai_engine", "vector_db", "database", "cache", "background_service", "external_api", "other"]),
    technology: zod_1.z.string(),
    purpose: zod_1.z.string(),
    responsibilities: zod_1.z.array(zod_1.z.string()),
    ports: zod_1.z.array(zod_1.z.string()).optional(),
    dependencies: zod_1.z.array(zod_1.z.string()).optional(),
});
exports.DataFlowStepSchema = zod_1.z.object({
    step: zod_1.z.number().positive(),
    actor: zod_1.z.string(),
    action: zod_1.z.string(),
    system: zod_1.z.string(),
    description: zod_1.z.string(),
    dataPayload: zod_1.z.string().optional(),
});
exports.DatabaseModelSchema = zod_1.z.object({
    collectionName: zod_1.z.string(),
    purpose: zod_1.z.string(),
    fields: zod_1.z.array(zod_1.z.object({
        name: zod_1.z.string(),
        type: zod_1.z.string(),
        required: zod_1.z.boolean().optional(),
        indexed: zod_1.z.boolean().optional(),
        description: zod_1.z.string().optional(),
    })),
    indexes: zod_1.z.array(zod_1.z.object({
        fields: zod_1.z.array(zod_1.z.string()),
        type: zod_1.z.enum(["unique", "compound", "text", "single"]).optional(),
        reason: zod_1.z.string().optional(),
    })).optional(),
    relationships: zod_1.z.array(zod_1.z.object({
        type: zod_1.z.enum(["reference", "embedding", "embedded"]),
        targetCollection: zod_1.z.string(),
        description: zod_1.z.string(),
    })).optional(),
});
exports.ApiContractSchema = zod_1.z.object({
    method: zod_1.z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
    path: zod_1.z.string(),
    description: zod_1.z.string(),
    authRequired: zod_1.z.boolean().optional(),
    requestBody: zod_1.z.object({
        contentType: zod_1.z.string(),
        schema: zod_1.z.string(),
    }).optional(),
    responseSchema: zod_1.z.string(),
    rateLimit: zod_1.z.string().optional(),
});
exports.AiArchitectureSchema = zod_1.z.object({
    llmModels: zod_1.z.array(zod_1.z.object({
        provider: zod_1.z.string(),
        model: zod_1.z.string(),
        purpose: zod_1.z.string(),
        temperature: zod_1.z.number().optional(),
        maxTokens: zod_1.z.number().optional(),
    })),
    prompts: zod_1.z.array(zod_1.z.object({
        name: zod_1.z.string(),
        type: zod_1.z.enum(["system", "user", "few_shot", "chain_of_thought"]),
        purpose: zod_1.z.string(),
        template: zod_1.z.string().optional(),
    })),
    agentTools: zod_1.z.array(zod_1.z.object({
        name: zod_1.z.string(),
        type: zod_1.z.enum(["search", "code_execution", "web_scraping", "api_call", "file_operation", "other"]),
        purpose: zod_1.z.string(),
        integration: zod_1.z.string(),
    })),
    executionPipeline: zod_1.z.array(zod_1.z.object({
        stage: zod_1.z.number().positive(),
        name: zod_1.z.string(),
        description: zod_1.z.string(),
        inputs: zod_1.z.array(zod_1.z.string()),
        outputs: zod_1.z.array(zod_1.z.string()),
    })),
    fallbackPolicies: zod_1.z.array(zod_1.z.object({
        scenario: zod_1.z.string(),
        strategy: zod_1.z.string(),
    })),
});
exports.RagArchitectureSchema = zod_1.z.object({
    vectorDbProvider: zod_1.z.string(),
    embeddingModel: zod_1.z.string(),
    chunkSize: zod_1.z.number(),
    chunkOverlap: zod_1.z.number(),
    retrievalTopK: zod_1.z.number(),
    searchFilter: zod_1.z.string().optional(),
    indexingStrategy: zod_1.z.string().optional(),
    reranker: zod_1.z.string().optional(),
}).optional();
exports.ExternalServiceSchema = zod_1.z.object({
    name: zod_1.z.string(),
    purpose: zod_1.z.string(),
    authMethod: zod_1.z.string(),
    rateLimit: zod_1.z.string().optional(),
    fallbackStrategy: zod_1.z.string().optional(),
    costTier: zod_1.z.enum(["free", "low", "medium", "high"]).optional(),
});
exports.TechnicalRiskSchema = zod_1.z.object({
    id: zod_1.z.string(),
    description: zod_1.z.string(),
    likelihood: zod_1.z.enum(["low", "medium", "high"]),
    impact: zod_1.z.enum(["low", "medium", "high"]),
    severity: zod_1.z.enum(["low", "medium", "high", "critical"]),
    mitigationStrategy: zod_1.z.string(),
    affectedComponents: zod_1.z.array(zod_1.z.string()),
});
exports.TaskDependencySchema = zod_1.z.object({
    taskId: zod_1.z.string(),
    name: zod_1.z.string(),
    description: zod_1.z.string(),
    assignedRole: zod_1.z.string(),
    assignedMemberId: zod_1.z.string().optional(),
    estimatedHours: zod_1.z.number(),
    dependencies: zod_1.z.array(zod_1.z.string()),
    priority: zod_1.z.enum(["critical", "high", "medium", "low"]),
    phase: zod_1.z.number(),
});
exports.ImplementationPhaseSchema = zod_1.z.object({
    phase: zod_1.z.number().positive(),
    name: zod_1.z.string(),
    description: zod_1.z.string(),
    duration: zod_1.z.string(),
    deliverables: zod_1.z.array(zod_1.z.string()),
    tasks: zod_1.z.array(exports.TaskDependencySchema),
    exitCriteria: zod_1.z.array(zod_1.z.string()),
});
exports.ArchitectureResultSchema = zod_1.z.object({
    architectureId: zod_1.z.string(),
    projectId: zod_1.z.string(),
    selectedTechStack: exports.TechChoiceSchema,
    architectureOverview: zod_1.z.string(),
    components: zod_1.z.array(exports.ComponentSchema),
    dataFlow: zod_1.z.array(exports.DataFlowStepSchema),
    databaseSchema: zod_1.z.array(exports.DatabaseModelSchema),
    apiContracts: zod_1.z.array(exports.ApiContractSchema),
    aiArchitecture: exports.AiArchitectureSchema,
    ragArchitecture: exports.RagArchitectureSchema,
    externalServices: zod_1.z.array(exports.ExternalServiceSchema),
    risks: zod_1.z.array(exports.TechnicalRiskSchema),
    implementationPlan: zod_1.z.array(exports.ImplementationPhaseSchema),
    hackathonTimeline: zod_1.z.object({
        totalHours: zod_1.z.number(),
        phases: zod_1.z.array(zod_1.z.object({
            phase: zod_1.z.number(),
            name: zod_1.z.string(),
            hours: zod_1.z.number(),
            startHour: zod_1.z.number(),
        })),
    }),
    confidence: zod_1.z.number().min(0).max(1),
    estimatedDemoReadiness: zod_1.z.string(),
});
exports.JudgeResultSchema = zod_1.z.record(zod_1.z.unknown());
exports.BuildResultSchema = zod_1.z.record(zod_1.z.unknown());
// ============================================================
// WORKFLOW STATE
// ============================================================
exports.ImprovementIterationSchema = zod_1.z.object({
    version: zod_1.z.number(),
    score: zod_1.z.number(),
    changedBy: zod_1.z.array(zod_1.z.string()),
    weaknessesAddressed: zod_1.z.array(zod_1.z.string()),
    summary: zod_1.z.string(),
    timestamp: zod_1.z.string(),
});
exports.WorkflowErrorSchema = zod_1.z.object({
    agent: zod_1.z.string(),
    node: zod_1.z.string(),
    error: zod_1.z.string(),
    timestamp: zod_1.z.string(),
    recoverable: zod_1.z.boolean(),
});
exports.UsageMetricsSchema = zod_1.z.object({
    geminiCalls: zod_1.z.number().default(0),
    geminiSearchCalls: zod_1.z.number().default(0),
    deepseekCalls: zod_1.z.number().default(0),
    tavilyCalls: zod_1.z.number().default(0),
    githubCalls: zod_1.z.number().default(0),
    llmTokens: zod_1.z.number().default(0),
    cacheHits: zod_1.z.number().default(0),
    cacheMisses: zod_1.z.number().default(0),
});
exports.HackathonStateSchema = zod_1.z.object({
    projectId: zod_1.z.string(),
    input: exports.StrategistInputSchema,
    problemAnalysis: exports.ProblemAnalysisSchema.nullable().default(null),
    research: exports.ResearchResultSchema.nullable().default(null),
    innovation: exports.InnovationResultSchema.nullable().default(null),
    teamAnalysis: exports.TeamAnalysisSchema.nullable().default(null),
    architecture: exports.ArchitectureResultSchema.nullable().default(null),
    judging: exports.JudgeResultSchema.nullable().default(null),
    improvementHistory: zod_1.z.array(exports.ImprovementIterationSchema).default([]),
    selectedVersion: zod_1.z.number().default(0),
    build: exports.BuildResultSchema.nullable().default(null),
    status: zod_1.z
        .enum(["idle", "running", "paused", "completed", "failed", "cancel_requested", "awaiting_selection"])
        .default("idle"),
    errors: zod_1.z.array(exports.WorkflowErrorSchema).default([]),
    usage: exports.UsageMetricsSchema.default({
        geminiCalls: 0,
        geminiSearchCalls: 0,
        tavilyCalls: 0,
        githubCalls: 0,
        llmTokens: 0,
        cacheHits: 0,
        cacheMisses: 0,
    }),
});
function createInitialState(projectId, input) {
    return {
        projectId,
        input: {
            ...input,
            resumes: input.resumes || [],
            githubLinks: input.githubLinks || [],
        },
        problemAnalysis: null,
        research: null,
        innovation: null,
        teamAnalysis: null,
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
            deepseekCalls: 0,
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
const replaceReducer = (current, update) => (update ?? current);
exports.HackathonStateAnnotation = langgraph_1.Annotation.Root({
    projectId: (langgraph_1.Annotation),
    input: (langgraph_1.Annotation),
    problemAnalysis: (0, langgraph_1.Annotation)({
        reducer: replaceReducer,
        default: () => null,
    }),
    research: (0, langgraph_1.Annotation)({
        reducer: replaceReducer,
        default: () => null,
    }),
    innovation: (0, langgraph_1.Annotation)({
        reducer: replaceReducer,
        default: () => null,
    }),
    teamAnalysis: (0, langgraph_1.Annotation)({
        reducer: replaceReducer,
        default: () => null,
    }),
    architecture: (0, langgraph_1.Annotation)({
        reducer: replaceReducer,
        default: () => null,
    }),
    judging: (0, langgraph_1.Annotation)({
        reducer: replaceReducer,
        default: () => null,
    }),
    improvementHistory: (0, langgraph_1.Annotation)({
        reducer: (current, update) => [...(current || []), ...(update || [])],
        default: () => [],
    }),
    selectedVersion: (0, langgraph_1.Annotation)({
        reducer: replaceReducer,
        default: () => 0,
    }),
    build: (0, langgraph_1.Annotation)({
        reducer: replaceReducer,
        default: () => null,
    }),
    status: (0, langgraph_1.Annotation)({
        reducer: replaceReducer,
        default: () => "idle",
    }),
    errors: (0, langgraph_1.Annotation)({
        reducer: (current, update) => [...(current || []), ...(update || [])],
        default: () => [],
    }),
    usage: (0, langgraph_1.Annotation)({
        reducer: (current, update) => ({
            geminiCalls: (current?.geminiCalls || 0) + (update?.geminiCalls || 0),
            geminiSearchCalls: (current?.geminiSearchCalls || 0) + (update?.geminiSearchCalls || 0),
            deepseekCalls: (current?.deepseekCalls || 0) + (update?.deepseekCalls || 0),
            tavilyCalls: (current?.tavilyCalls || 0) + (update?.tavilyCalls || 0),
            githubCalls: (current?.githubCalls || 0) + (update?.githubCalls || 0),
            llmTokens: (current?.llmTokens || 0) + (update?.llmTokens || 0),
            cacheHits: (current?.cacheHits || 0) + (update?.cacheHits || 0),
            cacheMisses: (current?.cacheMisses || 0) + (update?.cacheMisses || 0),
        }),
        default: () => ({
            geminiCalls: 0,
            geminiSearchCalls: 0,
            deepseekCalls: 0,
            tavilyCalls: 0,
            githubCalls: 0,
            llmTokens: 0,
            cacheHits: 0,
            cacheMisses: 0,
        }),
    }),
});
//# sourceMappingURL=state.js.map