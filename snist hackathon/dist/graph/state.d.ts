import { z } from "zod";
export declare const StrategistInputSchema: z.ZodObject<{
    problemStatement: z.ZodString;
    resumes: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    githubLinks: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
        githubProfileUrl: z.ZodString;
        username: z.ZodString;
        role: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        githubProfileUrl: string;
        username: string;
        role?: string | undefined;
    }, {
        githubProfileUrl: string;
        username: string;
        role?: string | undefined;
    }>, "many">>>;
    hackathon: z.ZodOptional<z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        durationHours: z.ZodOptional<z.ZodNumber>;
        judgingCriteria: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            weight: z.ZodOptional<z.ZodNumber>;
            description: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            description?: string | undefined;
            weight?: number | undefined;
        }, {
            name: string;
            description?: string | undefined;
            weight?: number | undefined;
        }>, "many">>;
        rules: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        restrictions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        allowedTechnologies: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        forbiddenTechnologies: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        name?: string | undefined;
        description?: string | undefined;
        durationHours?: number | undefined;
        judgingCriteria?: {
            name: string;
            description?: string | undefined;
            weight?: number | undefined;
        }[] | undefined;
        rules?: string[] | undefined;
        restrictions?: string[] | undefined;
        allowedTechnologies?: string[] | undefined;
        forbiddenTechnologies?: string[] | undefined;
    }, {
        name?: string | undefined;
        description?: string | undefined;
        durationHours?: number | undefined;
        judgingCriteria?: {
            name: string;
            description?: string | undefined;
            weight?: number | undefined;
        }[] | undefined;
        rules?: string[] | undefined;
        restrictions?: string[] | undefined;
        allowedTechnologies?: string[] | undefined;
        forbiddenTechnologies?: string[] | undefined;
    }>>;
    userConstraints: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    teamSize: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    problemStatement: string;
    resumes: string[];
    githubLinks: {
        githubProfileUrl: string;
        username: string;
        role?: string | undefined;
    }[];
    hackathon?: {
        name?: string | undefined;
        description?: string | undefined;
        durationHours?: number | undefined;
        judgingCriteria?: {
            name: string;
            description?: string | undefined;
            weight?: number | undefined;
        }[] | undefined;
        rules?: string[] | undefined;
        restrictions?: string[] | undefined;
        allowedTechnologies?: string[] | undefined;
        forbiddenTechnologies?: string[] | undefined;
    } | undefined;
    userConstraints?: string[] | undefined;
    teamSize?: number | undefined;
}, {
    problemStatement: string;
    resumes?: string[] | undefined;
    githubLinks?: {
        githubProfileUrl: string;
        username: string;
        role?: string | undefined;
    }[] | undefined;
    hackathon?: {
        name?: string | undefined;
        description?: string | undefined;
        durationHours?: number | undefined;
        judgingCriteria?: {
            name: string;
            description?: string | undefined;
            weight?: number | undefined;
        }[] | undefined;
        rules?: string[] | undefined;
        restrictions?: string[] | undefined;
        allowedTechnologies?: string[] | undefined;
        forbiddenTechnologies?: string[] | undefined;
    } | undefined;
    userConstraints?: string[] | undefined;
    teamSize?: number | undefined;
}>;
export type StrategistInput = z.infer<typeof StrategistInputSchema>;
export type GithubLink = z.infer<typeof StrategistInputSchema>["githubLinks"][number];
export declare const TargetUserSchema: z.ZodObject<{
    role: z.ZodString;
    context: z.ZodString;
    painLevel: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    evidence: z.ZodEnum<["explicit", "inferred"]>;
    reason: z.ZodString;
}, "strip", z.ZodTypeAny, {
    role: string;
    context: string;
    evidence: "explicit" | "inferred";
    reason: string;
    painLevel?: number | null | undefined;
}, {
    role: string;
    context: string;
    evidence: "explicit" | "inferred";
    reason: string;
    painLevel?: number | null | undefined;
}>;
export declare const PainPointSchema: z.ZodObject<{
    description: z.ZodString;
    severity: z.ZodEnum<["low", "medium", "high"]>;
    evidence: z.ZodEnum<["explicit", "inferred"]>;
    reason: z.ZodString;
}, "strip", z.ZodTypeAny, {
    description: string;
    evidence: "explicit" | "inferred";
    reason: string;
    severity: "low" | "medium" | "high";
}, {
    description: string;
    evidence: "explicit" | "inferred";
    reason: string;
    severity: "low" | "medium" | "high";
}>;
export declare const DesiredOutcomeSchema: z.ZodObject<{
    description: z.ZodString;
    priority: z.ZodEnum<["high", "medium", "low"]>;
    measurable: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    description: string;
    priority: "low" | "medium" | "high";
    measurable?: boolean | null | undefined;
}, {
    description: string;
    priority: "low" | "medium" | "high";
    measurable?: boolean | null | undefined;
}>;
export declare const ExplicitRequirementSchema: z.ZodObject<{
    description: z.ZodString;
    type: z.ZodEnum<["functional", "non_functional"]>;
    priority: z.ZodEnum<["must", "should", "could"]>;
    evidence: z.ZodEnum<["explicit", "inferred"]>;
    reason: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "functional" | "non_functional";
    description: string;
    evidence: "explicit" | "inferred";
    reason: string;
    priority: "must" | "should" | "could";
}, {
    type: "functional" | "non_functional";
    description: string;
    evidence: "explicit" | "inferred";
    reason: string;
    priority: "must" | "should" | "could";
}>;
export declare const InferredRequirementSchema: z.ZodObject<{
    description: z.ZodString;
    type: z.ZodEnum<["functional", "non_functional"]>;
    priority: z.ZodEnum<["must", "should", "could"]>;
    evidence: z.ZodEnum<["explicit", "inferred"]>;
    reason: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "functional" | "non_functional";
    description: string;
    evidence: "explicit" | "inferred";
    reason: string;
    priority: "must" | "should" | "could";
}, {
    type: "functional" | "non_functional";
    description: string;
    evidence: "explicit" | "inferred";
    reason: string;
    priority: "must" | "should" | "could";
}>;
export declare const ConstraintSchema: z.ZodObject<{
    description: z.ZodString;
    category: z.ZodEnum<["time", "budget", "technical", "data", "hardware", "platform", "user", "regulatory", "hackathon", "other"]>;
    severity: z.ZodEnum<["low", "medium", "high"]>;
    evidence: z.ZodEnum<["explicit", "inferred"]>;
}, "strip", z.ZodTypeAny, {
    description: string;
    evidence: "explicit" | "inferred";
    severity: "low" | "medium" | "high";
    category: "hackathon" | "time" | "budget" | "technical" | "data" | "hardware" | "platform" | "user" | "regulatory" | "other";
}, {
    description: string;
    evidence: "explicit" | "inferred";
    severity: "low" | "medium" | "high";
    category: "hackathon" | "time" | "budget" | "technical" | "data" | "hardware" | "platform" | "user" | "regulatory" | "other";
}>;
export declare const AssumptionSchema: z.ZodObject<{
    statement: z.ZodString;
    confidence: z.ZodNumber;
    reason: z.ZodString;
}, "strip", z.ZodTypeAny, {
    reason: string;
    statement: string;
    confidence: number;
}, {
    reason: string;
    statement: string;
    confidence: number;
}>;
export declare const AmbiguitySchema: z.ZodObject<{
    issue: z.ZodString;
    whyItMatters: z.ZodString;
    possibleInterpretations: z.ZodArray<z.ZodString, "many">;
    severity: z.ZodEnum<["low", "medium", "high"]>;
}, "strip", z.ZodTypeAny, {
    severity: "low" | "medium" | "high";
    issue: string;
    whyItMatters: string;
    possibleInterpretations: string[];
}, {
    severity: "low" | "medium" | "high";
    issue: string;
    whyItMatters: string;
    possibleInterpretations: string[];
}>;
export declare const ResearchQuestionSchema: z.ZodObject<{
    question: z.ZodString;
    category: z.ZodEnum<["existing_solution", "technology", "user", "workflow", "market", "limitation", "hackathon", "open_source", "research", "technical_approaches", "other"]>;
    priority: z.ZodEnum<["high", "medium", "low"]>;
}, "strip", z.ZodTypeAny, {
    priority: "low" | "medium" | "high";
    category: "hackathon" | "user" | "other" | "existing_solution" | "technology" | "workflow" | "market" | "limitation" | "open_source" | "research" | "technical_approaches";
    question: string;
}, {
    priority: "low" | "medium" | "high";
    category: "hackathon" | "user" | "other" | "existing_solution" | "technology" | "workflow" | "market" | "limitation" | "open_source" | "research" | "technical_approaches";
    question: string;
}>;
export declare const ResearchDimensionSchema: z.ZodObject<{
    name: z.ZodEnum<["commercial_products", "startups", "github", "open_source", "hackathons", "research", "blogs", "technical_approaches", "adjacent_solutions"]>;
    reason: z.ZodString;
    priority: z.ZodEnum<["high", "medium", "low"]>;
    targetQueries: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    name: "open_source" | "research" | "technical_approaches" | "commercial_products" | "startups" | "github" | "hackathons" | "blogs" | "adjacent_solutions";
    reason: string;
    priority: "low" | "medium" | "high";
    targetQueries: string[];
}, {
    name: "open_source" | "research" | "technical_approaches" | "commercial_products" | "startups" | "github" | "hackathons" | "blogs" | "adjacent_solutions";
    reason: string;
    priority: "low" | "medium" | "high";
    targetQueries: string[];
}>;
export declare const SearchConceptSchema: z.ZodObject<{
    concept: z.ZodString;
    category: z.ZodEnum<["problem", "user", "domain", "mechanism", "technology", "product", "startup", "hackathon", "open_source", "research"]>;
    priority: z.ZodEnum<["high", "medium", "low"]>;
    searchQueries: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    priority: "low" | "medium" | "high";
    category: "hackathon" | "user" | "technology" | "open_source" | "research" | "problem" | "domain" | "mechanism" | "product" | "startup";
    concept: string;
    searchQueries: string[];
}, {
    priority: "low" | "medium" | "high";
    category: "hackathon" | "user" | "technology" | "open_source" | "research" | "problem" | "domain" | "mechanism" | "product" | "startup";
    concept: string;
    searchQueries: string[];
}>;
export declare const ProblemAnalysisSchema: z.ZodObject<{
    coreProblem: z.ZodString;
    problemSummary: z.ZodString;
    targetUsers: z.ZodArray<z.ZodObject<{
        role: z.ZodString;
        context: z.ZodString;
        painLevel: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        evidence: z.ZodEnum<["explicit", "inferred"]>;
        reason: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        role: string;
        context: string;
        evidence: "explicit" | "inferred";
        reason: string;
        painLevel?: number | null | undefined;
    }, {
        role: string;
        context: string;
        evidence: "explicit" | "inferred";
        reason: string;
        painLevel?: number | null | undefined;
    }>, "many">;
    painPoints: z.ZodArray<z.ZodObject<{
        description: z.ZodString;
        severity: z.ZodEnum<["low", "medium", "high"]>;
        evidence: z.ZodEnum<["explicit", "inferred"]>;
        reason: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        description: string;
        evidence: "explicit" | "inferred";
        reason: string;
        severity: "low" | "medium" | "high";
    }, {
        description: string;
        evidence: "explicit" | "inferred";
        reason: string;
        severity: "low" | "medium" | "high";
    }>, "many">;
    desiredOutcomes: z.ZodArray<z.ZodObject<{
        description: z.ZodString;
        priority: z.ZodEnum<["high", "medium", "low"]>;
        measurable: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    }, "strip", z.ZodTypeAny, {
        description: string;
        priority: "low" | "medium" | "high";
        measurable?: boolean | null | undefined;
    }, {
        description: string;
        priority: "low" | "medium" | "high";
        measurable?: boolean | null | undefined;
    }>, "many">;
    explicitRequirements: z.ZodArray<z.ZodObject<{
        description: z.ZodString;
        type: z.ZodEnum<["functional", "non_functional"]>;
        priority: z.ZodEnum<["must", "should", "could"]>;
        evidence: z.ZodEnum<["explicit", "inferred"]>;
        reason: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: "functional" | "non_functional";
        description: string;
        evidence: "explicit" | "inferred";
        reason: string;
        priority: "must" | "should" | "could";
    }, {
        type: "functional" | "non_functional";
        description: string;
        evidence: "explicit" | "inferred";
        reason: string;
        priority: "must" | "should" | "could";
    }>, "many">;
    inferredRequirements: z.ZodArray<z.ZodObject<{
        description: z.ZodString;
        type: z.ZodEnum<["functional", "non_functional"]>;
        priority: z.ZodEnum<["must", "should", "could"]>;
        evidence: z.ZodEnum<["explicit", "inferred"]>;
        reason: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: "functional" | "non_functional";
        description: string;
        evidence: "explicit" | "inferred";
        reason: string;
        priority: "must" | "should" | "could";
    }, {
        type: "functional" | "non_functional";
        description: string;
        evidence: "explicit" | "inferred";
        reason: string;
        priority: "must" | "should" | "could";
    }>, "many">;
    constraints: z.ZodArray<z.ZodObject<{
        description: z.ZodString;
        category: z.ZodEnum<["time", "budget", "technical", "data", "hardware", "platform", "user", "regulatory", "hackathon", "other"]>;
        severity: z.ZodEnum<["low", "medium", "high"]>;
        evidence: z.ZodEnum<["explicit", "inferred"]>;
    }, "strip", z.ZodTypeAny, {
        description: string;
        evidence: "explicit" | "inferred";
        severity: "low" | "medium" | "high";
        category: "hackathon" | "time" | "budget" | "technical" | "data" | "hardware" | "platform" | "user" | "regulatory" | "other";
    }, {
        description: string;
        evidence: "explicit" | "inferred";
        severity: "low" | "medium" | "high";
        category: "hackathon" | "time" | "budget" | "technical" | "data" | "hardware" | "platform" | "user" | "regulatory" | "other";
    }>, "many">;
    domainKeywords: z.ZodArray<z.ZodString, "many">;
    synonyms: z.ZodArray<z.ZodString, "many">;
    relatedConcepts: z.ZodArray<z.ZodString, "many">;
    mechanisms: z.ZodArray<z.ZodString, "many">;
    assumptions: z.ZodArray<z.ZodObject<{
        statement: z.ZodString;
        confidence: z.ZodNumber;
        reason: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        reason: string;
        statement: string;
        confidence: number;
    }, {
        reason: string;
        statement: string;
        confidence: number;
    }>, "many">;
    ambiguities: z.ZodArray<z.ZodObject<{
        issue: z.ZodString;
        whyItMatters: z.ZodString;
        possibleInterpretations: z.ZodArray<z.ZodString, "many">;
        severity: z.ZodEnum<["low", "medium", "high"]>;
    }, "strip", z.ZodTypeAny, {
        severity: "low" | "medium" | "high";
        issue: string;
        whyItMatters: string;
        possibleInterpretations: string[];
    }, {
        severity: "low" | "medium" | "high";
        issue: string;
        whyItMatters: string;
        possibleInterpretations: string[];
    }>, "many">;
    researchQuestions: z.ZodArray<z.ZodObject<{
        question: z.ZodString;
        category: z.ZodEnum<["existing_solution", "technology", "user", "workflow", "market", "limitation", "hackathon", "open_source", "research", "technical_approaches", "other"]>;
        priority: z.ZodEnum<["high", "medium", "low"]>;
    }, "strip", z.ZodTypeAny, {
        priority: "low" | "medium" | "high";
        category: "hackathon" | "user" | "other" | "existing_solution" | "technology" | "workflow" | "market" | "limitation" | "open_source" | "research" | "technical_approaches";
        question: string;
    }, {
        priority: "low" | "medium" | "high";
        category: "hackathon" | "user" | "other" | "existing_solution" | "technology" | "workflow" | "market" | "limitation" | "open_source" | "research" | "technical_approaches";
        question: string;
    }>, "many">;
    researchDimensions: z.ZodArray<z.ZodObject<{
        name: z.ZodEnum<["commercial_products", "startups", "github", "open_source", "hackathons", "research", "blogs", "technical_approaches", "adjacent_solutions"]>;
        reason: z.ZodString;
        priority: z.ZodEnum<["high", "medium", "low"]>;
        targetQueries: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        name: "open_source" | "research" | "technical_approaches" | "commercial_products" | "startups" | "github" | "hackathons" | "blogs" | "adjacent_solutions";
        reason: string;
        priority: "low" | "medium" | "high";
        targetQueries: string[];
    }, {
        name: "open_source" | "research" | "technical_approaches" | "commercial_products" | "startups" | "github" | "hackathons" | "blogs" | "adjacent_solutions";
        reason: string;
        priority: "low" | "medium" | "high";
        targetQueries: string[];
    }>, "many">;
    searchConcepts: z.ZodArray<z.ZodObject<{
        concept: z.ZodString;
        category: z.ZodEnum<["problem", "user", "domain", "mechanism", "technology", "product", "startup", "hackathon", "open_source", "research"]>;
        priority: z.ZodEnum<["high", "medium", "low"]>;
        searchQueries: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        priority: "low" | "medium" | "high";
        category: "hackathon" | "user" | "technology" | "open_source" | "research" | "problem" | "domain" | "mechanism" | "product" | "startup";
        concept: string;
        searchQueries: string[];
    }, {
        priority: "low" | "medium" | "high";
        category: "hackathon" | "user" | "technology" | "open_source" | "research" | "problem" | "domain" | "mechanism" | "product" | "startup";
        concept: string;
        searchQueries: string[];
    }>, "many">;
    successCriteria: z.ZodArray<z.ZodString, "many">;
    hackathonConsiderations: z.ZodArray<z.ZodString, "many">;
    analysisConfidence: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    coreProblem: string;
    problemSummary: string;
    targetUsers: {
        role: string;
        context: string;
        evidence: "explicit" | "inferred";
        reason: string;
        painLevel?: number | null | undefined;
    }[];
    painPoints: {
        description: string;
        evidence: "explicit" | "inferred";
        reason: string;
        severity: "low" | "medium" | "high";
    }[];
    desiredOutcomes: {
        description: string;
        priority: "low" | "medium" | "high";
        measurable?: boolean | null | undefined;
    }[];
    explicitRequirements: {
        type: "functional" | "non_functional";
        description: string;
        evidence: "explicit" | "inferred";
        reason: string;
        priority: "must" | "should" | "could";
    }[];
    inferredRequirements: {
        type: "functional" | "non_functional";
        description: string;
        evidence: "explicit" | "inferred";
        reason: string;
        priority: "must" | "should" | "could";
    }[];
    constraints: {
        description: string;
        evidence: "explicit" | "inferred";
        severity: "low" | "medium" | "high";
        category: "hackathon" | "time" | "budget" | "technical" | "data" | "hardware" | "platform" | "user" | "regulatory" | "other";
    }[];
    domainKeywords: string[];
    synonyms: string[];
    relatedConcepts: string[];
    mechanisms: string[];
    assumptions: {
        reason: string;
        statement: string;
        confidence: number;
    }[];
    ambiguities: {
        severity: "low" | "medium" | "high";
        issue: string;
        whyItMatters: string;
        possibleInterpretations: string[];
    }[];
    researchQuestions: {
        priority: "low" | "medium" | "high";
        category: "hackathon" | "user" | "other" | "existing_solution" | "technology" | "workflow" | "market" | "limitation" | "open_source" | "research" | "technical_approaches";
        question: string;
    }[];
    researchDimensions: {
        name: "open_source" | "research" | "technical_approaches" | "commercial_products" | "startups" | "github" | "hackathons" | "blogs" | "adjacent_solutions";
        reason: string;
        priority: "low" | "medium" | "high";
        targetQueries: string[];
    }[];
    searchConcepts: {
        priority: "low" | "medium" | "high";
        category: "hackathon" | "user" | "technology" | "open_source" | "research" | "problem" | "domain" | "mechanism" | "product" | "startup";
        concept: string;
        searchQueries: string[];
    }[];
    successCriteria: string[];
    hackathonConsiderations: string[];
    analysisConfidence: number;
}, {
    coreProblem: string;
    problemSummary: string;
    targetUsers: {
        role: string;
        context: string;
        evidence: "explicit" | "inferred";
        reason: string;
        painLevel?: number | null | undefined;
    }[];
    painPoints: {
        description: string;
        evidence: "explicit" | "inferred";
        reason: string;
        severity: "low" | "medium" | "high";
    }[];
    desiredOutcomes: {
        description: string;
        priority: "low" | "medium" | "high";
        measurable?: boolean | null | undefined;
    }[];
    explicitRequirements: {
        type: "functional" | "non_functional";
        description: string;
        evidence: "explicit" | "inferred";
        reason: string;
        priority: "must" | "should" | "could";
    }[];
    inferredRequirements: {
        type: "functional" | "non_functional";
        description: string;
        evidence: "explicit" | "inferred";
        reason: string;
        priority: "must" | "should" | "could";
    }[];
    constraints: {
        description: string;
        evidence: "explicit" | "inferred";
        severity: "low" | "medium" | "high";
        category: "hackathon" | "time" | "budget" | "technical" | "data" | "hardware" | "platform" | "user" | "regulatory" | "other";
    }[];
    domainKeywords: string[];
    synonyms: string[];
    relatedConcepts: string[];
    mechanisms: string[];
    assumptions: {
        reason: string;
        statement: string;
        confidence: number;
    }[];
    ambiguities: {
        severity: "low" | "medium" | "high";
        issue: string;
        whyItMatters: string;
        possibleInterpretations: string[];
    }[];
    researchQuestions: {
        priority: "low" | "medium" | "high";
        category: "hackathon" | "user" | "other" | "existing_solution" | "technology" | "workflow" | "market" | "limitation" | "open_source" | "research" | "technical_approaches";
        question: string;
    }[];
    researchDimensions: {
        name: "open_source" | "research" | "technical_approaches" | "commercial_products" | "startups" | "github" | "hackathons" | "blogs" | "adjacent_solutions";
        reason: string;
        priority: "low" | "medium" | "high";
        targetQueries: string[];
    }[];
    searchConcepts: {
        priority: "low" | "medium" | "high";
        category: "hackathon" | "user" | "technology" | "open_source" | "research" | "problem" | "domain" | "mechanism" | "product" | "startup";
        concept: string;
        searchQueries: string[];
    }[];
    successCriteria: string[];
    hackathonConsiderations: string[];
    analysisConfidence: number;
}>;
export type ProblemAnalysis = z.infer<typeof ProblemAnalysisSchema>;
export declare const SourceSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    url: z.ZodString;
    canonicalUrl: z.ZodString;
    domain: z.ZodString;
    sourceType: z.ZodEnum<["web", "product", "startup", "github", "open_source", "hackathon", "research", "blog", "other"]>;
    discoveredBy: z.ZodArray<z.ZodEnum<["gemini", "tavily", "github"]>, "many">;
    searchQueryIds: z.ZodArray<z.ZodString, "many">;
    snippet: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    content: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    publishedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    retrievedAt: z.ZodString;
    relevanceScore: z.ZodNumber;
    authorityScore: z.ZodNumber;
    extractionStatus: z.ZodEnum<["success", "partial", "failed"]>;
    metadata: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    domain: string;
    id: string;
    title: string;
    url: string;
    canonicalUrl: string;
    sourceType: "hackathon" | "other" | "open_source" | "research" | "github" | "product" | "startup" | "web" | "blog";
    discoveredBy: ("github" | "gemini" | "tavily")[];
    searchQueryIds: string[];
    retrievedAt: string;
    relevanceScore: number;
    authorityScore: number;
    extractionStatus: "success" | "partial" | "failed";
    metadata: Record<string, unknown>;
    snippet?: string | null | undefined;
    content?: string | null | undefined;
    publishedAt?: string | null | undefined;
}, {
    domain: string;
    id: string;
    title: string;
    url: string;
    canonicalUrl: string;
    sourceType: "hackathon" | "other" | "open_source" | "research" | "github" | "product" | "startup" | "web" | "blog";
    discoveredBy: ("github" | "gemini" | "tavily")[];
    searchQueryIds: string[];
    retrievedAt: string;
    relevanceScore: number;
    authorityScore: number;
    extractionStatus: "success" | "partial" | "failed";
    snippet?: string | null | undefined;
    content?: string | null | undefined;
    publishedAt?: string | null | undefined;
    metadata?: Record<string, unknown> | undefined;
}>;
export type Source = z.infer<typeof SourceSchema>;
export declare const FeatureSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodString;
    category: z.ZodEnum<["core", "ai", "automation", "workflow", "analytics", "collaboration", "integration", "other"]>;
    sourceIds: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    name: string;
    description: string;
    category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "collaboration" | "integration";
    sourceIds: string[];
}, {
    name: string;
    description: string;
    category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "collaboration" | "integration";
    sourceIds: string[];
}>;
export type Feature = z.infer<typeof FeatureSchema>;
export declare const WorkflowStepSchema: z.ZodObject<{
    step: z.ZodNumber;
    action: z.ZodString;
    description: z.ZodString;
    sourceIds: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    description: string;
    sourceIds: string[];
    step: number;
    action: string;
}, {
    description: string;
    sourceIds: string[];
    step: number;
    action: string;
}>;
export type WorkflowStep = z.infer<typeof WorkflowStepSchema>;
export declare const DiscoveredSolutionSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodString;
    problemSolved: z.ZodString;
    targetUsers: z.ZodArray<z.ZodString, "many">;
    approach: z.ZodString;
    features: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        description: z.ZodString;
        category: z.ZodEnum<["core", "ai", "automation", "workflow", "analytics", "collaboration", "integration", "other"]>;
        sourceIds: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        name: string;
        description: string;
        category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "collaboration" | "integration";
        sourceIds: string[];
    }, {
        name: string;
        description: string;
        category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "collaboration" | "integration";
        sourceIds: string[];
    }>, "many">;
    workflow: z.ZodArray<z.ZodObject<{
        step: z.ZodNumber;
        action: z.ZodString;
        description: z.ZodString;
        sourceIds: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        description: string;
        sourceIds: string[];
        step: number;
        action: string;
    }, {
        description: string;
        sourceIds: string[];
        step: number;
        action: string;
    }>, "many">;
    inputs: z.ZodArray<z.ZodString, "many">;
    outputs: z.ZodArray<z.ZodString, "many">;
    technologies: z.ZodArray<z.ZodString, "many">;
    limitations: z.ZodArray<z.ZodString, "many">;
    website: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    githubRepository: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    sourceIds: z.ZodArray<z.ZodString, "many">;
    relationToProblem: z.ZodEnum<["direct", "adjacent", "technical"]>;
    confidence: z.ZodNumber;
    lastEnrichedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    description: string;
    confidence: number;
    workflow: {
        description: string;
        sourceIds: string[];
        step: number;
        action: string;
    }[];
    targetUsers: string[];
    id: string;
    sourceIds: string[];
    problemSolved: string;
    approach: string;
    features: {
        name: string;
        description: string;
        category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "collaboration" | "integration";
        sourceIds: string[];
    }[];
    inputs: string[];
    outputs: string[];
    technologies: string[];
    limitations: string[];
    relationToProblem: "technical" | "direct" | "adjacent";
    lastEnrichedAt: string;
    website?: string | null | undefined;
    githubRepository?: string | null | undefined;
}, {
    name: string;
    description: string;
    confidence: number;
    workflow: {
        description: string;
        sourceIds: string[];
        step: number;
        action: string;
    }[];
    targetUsers: string[];
    id: string;
    sourceIds: string[];
    problemSolved: string;
    approach: string;
    features: {
        name: string;
        description: string;
        category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "collaboration" | "integration";
        sourceIds: string[];
    }[];
    inputs: string[];
    outputs: string[];
    technologies: string[];
    limitations: string[];
    relationToProblem: "technical" | "direct" | "adjacent";
    lastEnrichedAt: string;
    website?: string | null | undefined;
    githubRepository?: string | null | undefined;
}>;
export type DiscoveredSolution = z.infer<typeof DiscoveredSolutionSchema>;
export declare const ContradictionSchema: z.ZodObject<{
    solutionId: z.ZodString;
    field: z.ZodString;
    conflictingValues: z.ZodArray<z.ZodString, "many">;
    sourceIds: z.ZodArray<z.ZodString, "many">;
    status: z.ZodEnum<["unresolved", "resolved"]>;
}, "strip", z.ZodTypeAny, {
    status: "unresolved" | "resolved";
    sourceIds: string[];
    solutionId: string;
    field: string;
    conflictingValues: string[];
}, {
    status: "unresolved" | "resolved";
    sourceIds: string[];
    solutionId: string;
    field: string;
    conflictingValues: string[];
}>;
export type Contradiction = z.infer<typeof ContradictionSchema>;
export declare const ResearchResultSchema: z.ZodObject<{
    researchId: z.ZodString;
    summary: z.ZodObject<{
        queriesRun: z.ZodNumber;
        geminiSearchCalls: z.ZodNumber;
        tavilySearchCalls: z.ZodNumber;
        githubSearchCalls: z.ZodNumber;
        sourcesFound: z.ZodNumber;
        uniqueSources: z.ZodNumber;
        candidateEntities: z.ZodNumber;
        relevantSolutions: z.ZodNumber;
        directSolutions: z.ZodNumber;
        adjacentSolutions: z.ZodNumber;
        technicalApproaches: z.ZodNumber;
        enrichedSolutions: z.ZodNumber;
        discoveryRounds: z.ZodNumber;
        enrichmentRounds: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        queriesRun: number;
        geminiSearchCalls: number;
        tavilySearchCalls: number;
        githubSearchCalls: number;
        sourcesFound: number;
        uniqueSources: number;
        candidateEntities: number;
        relevantSolutions: number;
        directSolutions: number;
        adjacentSolutions: number;
        technicalApproaches: number;
        enrichedSolutions: number;
        discoveryRounds: number;
        enrichmentRounds: number;
    }, {
        queriesRun: number;
        geminiSearchCalls: number;
        tavilySearchCalls: number;
        githubSearchCalls: number;
        sourcesFound: number;
        uniqueSources: number;
        candidateEntities: number;
        relevantSolutions: number;
        directSolutions: number;
        adjacentSolutions: number;
        technicalApproaches: number;
        enrichedSolutions: number;
        discoveryRounds: number;
        enrichmentRounds: number;
    }>;
    sources: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
        url: z.ZodString;
        canonicalUrl: z.ZodString;
        domain: z.ZodString;
        sourceType: z.ZodEnum<["web", "product", "startup", "github", "open_source", "hackathon", "research", "blog", "other"]>;
        discoveredBy: z.ZodArray<z.ZodEnum<["gemini", "tavily", "github"]>, "many">;
        searchQueryIds: z.ZodArray<z.ZodString, "many">;
        snippet: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        content: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        publishedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        retrievedAt: z.ZodString;
        relevanceScore: z.ZodNumber;
        authorityScore: z.ZodNumber;
        extractionStatus: z.ZodEnum<["success", "partial", "failed"]>;
        metadata: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, "strip", z.ZodTypeAny, {
        domain: string;
        id: string;
        title: string;
        url: string;
        canonicalUrl: string;
        sourceType: "hackathon" | "other" | "open_source" | "research" | "github" | "product" | "startup" | "web" | "blog";
        discoveredBy: ("github" | "gemini" | "tavily")[];
        searchQueryIds: string[];
        retrievedAt: string;
        relevanceScore: number;
        authorityScore: number;
        extractionStatus: "success" | "partial" | "failed";
        metadata: Record<string, unknown>;
        snippet?: string | null | undefined;
        content?: string | null | undefined;
        publishedAt?: string | null | undefined;
    }, {
        domain: string;
        id: string;
        title: string;
        url: string;
        canonicalUrl: string;
        sourceType: "hackathon" | "other" | "open_source" | "research" | "github" | "product" | "startup" | "web" | "blog";
        discoveredBy: ("github" | "gemini" | "tavily")[];
        searchQueryIds: string[];
        retrievedAt: string;
        relevanceScore: number;
        authorityScore: number;
        extractionStatus: "success" | "partial" | "failed";
        snippet?: string | null | undefined;
        content?: string | null | undefined;
        publishedAt?: string | null | undefined;
        metadata?: Record<string, unknown> | undefined;
    }>, "many">;
    discoveredSolutions: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        description: z.ZodString;
        problemSolved: z.ZodString;
        targetUsers: z.ZodArray<z.ZodString, "many">;
        approach: z.ZodString;
        features: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            description: z.ZodString;
            category: z.ZodEnum<["core", "ai", "automation", "workflow", "analytics", "collaboration", "integration", "other"]>;
            sourceIds: z.ZodArray<z.ZodString, "many">;
        }, "strip", z.ZodTypeAny, {
            name: string;
            description: string;
            category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "collaboration" | "integration";
            sourceIds: string[];
        }, {
            name: string;
            description: string;
            category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "collaboration" | "integration";
            sourceIds: string[];
        }>, "many">;
        workflow: z.ZodArray<z.ZodObject<{
            step: z.ZodNumber;
            action: z.ZodString;
            description: z.ZodString;
            sourceIds: z.ZodArray<z.ZodString, "many">;
        }, "strip", z.ZodTypeAny, {
            description: string;
            sourceIds: string[];
            step: number;
            action: string;
        }, {
            description: string;
            sourceIds: string[];
            step: number;
            action: string;
        }>, "many">;
        inputs: z.ZodArray<z.ZodString, "many">;
        outputs: z.ZodArray<z.ZodString, "many">;
        technologies: z.ZodArray<z.ZodString, "many">;
        limitations: z.ZodArray<z.ZodString, "many">;
        website: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        githubRepository: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        sourceIds: z.ZodArray<z.ZodString, "many">;
        relationToProblem: z.ZodEnum<["direct", "adjacent", "technical"]>;
        confidence: z.ZodNumber;
        lastEnrichedAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        description: string;
        confidence: number;
        workflow: {
            description: string;
            sourceIds: string[];
            step: number;
            action: string;
        }[];
        targetUsers: string[];
        id: string;
        sourceIds: string[];
        problemSolved: string;
        approach: string;
        features: {
            name: string;
            description: string;
            category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "collaboration" | "integration";
            sourceIds: string[];
        }[];
        inputs: string[];
        outputs: string[];
        technologies: string[];
        limitations: string[];
        relationToProblem: "technical" | "direct" | "adjacent";
        lastEnrichedAt: string;
        website?: string | null | undefined;
        githubRepository?: string | null | undefined;
    }, {
        name: string;
        description: string;
        confidence: number;
        workflow: {
            description: string;
            sourceIds: string[];
            step: number;
            action: string;
        }[];
        targetUsers: string[];
        id: string;
        sourceIds: string[];
        problemSolved: string;
        approach: string;
        features: {
            name: string;
            description: string;
            category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "collaboration" | "integration";
            sourceIds: string[];
        }[];
        inputs: string[];
        outputs: string[];
        technologies: string[];
        limitations: string[];
        relationToProblem: "technical" | "direct" | "adjacent";
        lastEnrichedAt: string;
        website?: string | null | undefined;
        githubRepository?: string | null | undefined;
    }>, "many">;
    coverage: z.ZodObject<{
        commercialProducts: z.ZodBoolean;
        startups: z.ZodBoolean;
        githubRepos: z.ZodBoolean;
        hackathons: z.ZodBoolean;
        researchPapers: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        startups: boolean;
        hackathons: boolean;
        commercialProducts: boolean;
        githubRepos: boolean;
        researchPapers: boolean;
    }, {
        startups: boolean;
        hackathons: boolean;
        commercialProducts: boolean;
        githubRepos: boolean;
        researchPapers: boolean;
    }>;
    unresolvedQuestions: z.ZodArray<z.ZodString, "many">;
    contradictions: z.ZodArray<z.ZodObject<{
        solutionId: z.ZodString;
        field: z.ZodString;
        conflictingValues: z.ZodArray<z.ZodString, "many">;
        sourceIds: z.ZodArray<z.ZodString, "many">;
        status: z.ZodEnum<["unresolved", "resolved"]>;
    }, "strip", z.ZodTypeAny, {
        status: "unresolved" | "resolved";
        sourceIds: string[];
        solutionId: string;
        field: string;
        conflictingValues: string[];
    }, {
        status: "unresolved" | "resolved";
        sourceIds: string[];
        solutionId: string;
        field: string;
        conflictingValues: string[];
    }>, "many">;
    stoppingReason: z.ZodEnum<["coverage_sufficient", "diminishing_returns", "max_iterations", "budget_limit", "provider_failure"]>;
    quality: z.ZodObject<{
        evidenceQuality: z.ZodEnum<["low", "medium", "high"]>;
        coverageQuality: z.ZodEnum<["low", "medium", "high"]>;
    }, "strip", z.ZodTypeAny, {
        evidenceQuality: "low" | "medium" | "high";
        coverageQuality: "low" | "medium" | "high";
    }, {
        evidenceQuality: "low" | "medium" | "high";
        coverageQuality: "low" | "medium" | "high";
    }>;
}, "strip", z.ZodTypeAny, {
    researchId: string;
    summary: {
        queriesRun: number;
        geminiSearchCalls: number;
        tavilySearchCalls: number;
        githubSearchCalls: number;
        sourcesFound: number;
        uniqueSources: number;
        candidateEntities: number;
        relevantSolutions: number;
        directSolutions: number;
        adjacentSolutions: number;
        technicalApproaches: number;
        enrichedSolutions: number;
        discoveryRounds: number;
        enrichmentRounds: number;
    };
    sources: {
        domain: string;
        id: string;
        title: string;
        url: string;
        canonicalUrl: string;
        sourceType: "hackathon" | "other" | "open_source" | "research" | "github" | "product" | "startup" | "web" | "blog";
        discoveredBy: ("github" | "gemini" | "tavily")[];
        searchQueryIds: string[];
        retrievedAt: string;
        relevanceScore: number;
        authorityScore: number;
        extractionStatus: "success" | "partial" | "failed";
        metadata: Record<string, unknown>;
        snippet?: string | null | undefined;
        content?: string | null | undefined;
        publishedAt?: string | null | undefined;
    }[];
    discoveredSolutions: {
        name: string;
        description: string;
        confidence: number;
        workflow: {
            description: string;
            sourceIds: string[];
            step: number;
            action: string;
        }[];
        targetUsers: string[];
        id: string;
        sourceIds: string[];
        problemSolved: string;
        approach: string;
        features: {
            name: string;
            description: string;
            category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "collaboration" | "integration";
            sourceIds: string[];
        }[];
        inputs: string[];
        outputs: string[];
        technologies: string[];
        limitations: string[];
        relationToProblem: "technical" | "direct" | "adjacent";
        lastEnrichedAt: string;
        website?: string | null | undefined;
        githubRepository?: string | null | undefined;
    }[];
    coverage: {
        startups: boolean;
        hackathons: boolean;
        commercialProducts: boolean;
        githubRepos: boolean;
        researchPapers: boolean;
    };
    unresolvedQuestions: string[];
    contradictions: {
        status: "unresolved" | "resolved";
        sourceIds: string[];
        solutionId: string;
        field: string;
        conflictingValues: string[];
    }[];
    stoppingReason: "coverage_sufficient" | "diminishing_returns" | "max_iterations" | "budget_limit" | "provider_failure";
    quality: {
        evidenceQuality: "low" | "medium" | "high";
        coverageQuality: "low" | "medium" | "high";
    };
}, {
    researchId: string;
    summary: {
        queriesRun: number;
        geminiSearchCalls: number;
        tavilySearchCalls: number;
        githubSearchCalls: number;
        sourcesFound: number;
        uniqueSources: number;
        candidateEntities: number;
        relevantSolutions: number;
        directSolutions: number;
        adjacentSolutions: number;
        technicalApproaches: number;
        enrichedSolutions: number;
        discoveryRounds: number;
        enrichmentRounds: number;
    };
    sources: {
        domain: string;
        id: string;
        title: string;
        url: string;
        canonicalUrl: string;
        sourceType: "hackathon" | "other" | "open_source" | "research" | "github" | "product" | "startup" | "web" | "blog";
        discoveredBy: ("github" | "gemini" | "tavily")[];
        searchQueryIds: string[];
        retrievedAt: string;
        relevanceScore: number;
        authorityScore: number;
        extractionStatus: "success" | "partial" | "failed";
        snippet?: string | null | undefined;
        content?: string | null | undefined;
        publishedAt?: string | null | undefined;
        metadata?: Record<string, unknown> | undefined;
    }[];
    discoveredSolutions: {
        name: string;
        description: string;
        confidence: number;
        workflow: {
            description: string;
            sourceIds: string[];
            step: number;
            action: string;
        }[];
        targetUsers: string[];
        id: string;
        sourceIds: string[];
        problemSolved: string;
        approach: string;
        features: {
            name: string;
            description: string;
            category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "collaboration" | "integration";
            sourceIds: string[];
        }[];
        inputs: string[];
        outputs: string[];
        technologies: string[];
        limitations: string[];
        relationToProblem: "technical" | "direct" | "adjacent";
        lastEnrichedAt: string;
        website?: string | null | undefined;
        githubRepository?: string | null | undefined;
    }[];
    coverage: {
        startups: boolean;
        hackathons: boolean;
        commercialProducts: boolean;
        githubRepos: boolean;
        researchPapers: boolean;
    };
    unresolvedQuestions: string[];
    contradictions: {
        status: "unresolved" | "resolved";
        sourceIds: string[];
        solutionId: string;
        field: string;
        conflictingValues: string[];
    }[];
    stoppingReason: "coverage_sufficient" | "diminishing_returns" | "max_iterations" | "budget_limit" | "provider_failure";
    quality: {
        evidenceQuality: "low" | "medium" | "high";
        coverageQuality: "low" | "medium" | "high";
    };
}>;
export type ResearchResult = z.infer<typeof ResearchResultSchema>;
export declare const SolutionClusterSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodString;
    solutionIds: z.ZodArray<z.ZodString, "many">;
    commonFeatures: z.ZodArray<z.ZodString, "many">;
    distinguishingCharacteristics: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    name: string;
    description: string;
    id: string;
    solutionIds: string[];
    commonFeatures: string[];
    distinguishingCharacteristics: string[];
}, {
    name: string;
    description: string;
    id: string;
    solutionIds: string[];
    commonFeatures: string[];
    distinguishingCharacteristics: string[];
}>;
export type SolutionCluster = z.infer<typeof SolutionClusterSchema>;
export declare const FeatureLandscapeSchema: z.ZodObject<{
    featureId: z.ZodString;
    canonicalName: z.ZodString;
    description: z.ZodString;
    category: z.ZodString;
    occurrenceCount: z.ZodNumber;
    totalRelevantSolutions: z.ZodNumber;
    frequency: z.ZodNumber;
    solutionIds: z.ZodArray<z.ZodString, "many">;
    frequencyClass: z.ZodEnum<["common", "moderate", "rare"]>;
    variants: z.ZodArray<z.ZodString, "many">;
    evidenceSourceIds: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    description: string;
    category: string;
    solutionIds: string[];
    featureId: string;
    canonicalName: string;
    occurrenceCount: number;
    totalRelevantSolutions: number;
    frequency: number;
    frequencyClass: "common" | "moderate" | "rare";
    variants: string[];
    evidenceSourceIds: string[];
}, {
    description: string;
    category: string;
    solutionIds: string[];
    featureId: string;
    canonicalName: string;
    occurrenceCount: number;
    totalRelevantSolutions: number;
    frequency: number;
    frequencyClass: "common" | "moderate" | "rare";
    variants: string[];
    evidenceSourceIds: string[];
}>;
export type FeatureLandscape = z.infer<typeof FeatureLandscapeSchema>;
export declare const InnovationGapSchema: z.ZodObject<{
    id: z.ZodString;
    type: z.ZodEnum<["feature", "workflow", "user", "context", "constraint", "integration", "automation", "data", "other"]>;
    title: z.ZodString;
    description: z.ZodString;
    supportingSolutionIds: z.ZodArray<z.ZodString, "many">;
    supportingSourceIds: z.ZodArray<z.ZodString, "many">;
    impact: z.ZodNumber;
    confidence: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    type: "context" | "data" | "user" | "other" | "workflow" | "automation" | "integration" | "feature" | "constraint";
    description: string;
    confidence: number;
    id: string;
    title: string;
    supportingSolutionIds: string[];
    supportingSourceIds: string[];
    impact: number;
}, {
    type: "context" | "data" | "user" | "other" | "workflow" | "automation" | "integration" | "feature" | "constraint";
    description: string;
    confidence: number;
    id: string;
    title: string;
    supportingSolutionIds: string[];
    supportingSourceIds: string[];
    impact: number;
}>;
export type InnovationGap = z.infer<typeof InnovationGapSchema>;
export declare const DifferentiatorSchema: z.ZodObject<{
    statement: z.ZodString;
    differenceType: z.ZodEnum<["feature", "workflow", "user", "context", "integration", "constraint", "automation", "combination"]>;
    comparedToSolutionIds: z.ZodArray<z.ZodString, "many">;
    evidenceSourceIds: z.ZodArray<z.ZodString, "many">;
    strength: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    statement: string;
    evidenceSourceIds: string[];
    differenceType: "context" | "user" | "workflow" | "automation" | "integration" | "feature" | "constraint" | "combination";
    comparedToSolutionIds: string[];
    strength: number;
}, {
    statement: string;
    evidenceSourceIds: string[];
    differenceType: "context" | "user" | "workflow" | "automation" | "integration" | "feature" | "constraint" | "combination";
    comparedToSolutionIds: string[];
    strength: number;
}>;
export type Differentiator = z.infer<typeof DifferentiatorSchema>;
export declare const CandidateIdeaSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    oneLineDescription: z.ZodString;
    detailedDescription: z.ZodString;
    targetUsers: z.ZodArray<z.ZodString, "many">;
    problemSolved: z.ZodString;
    keyFeatures: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        description: z.ZodString;
        category: z.ZodEnum<["core", "ai", "automation", "workflow", "analytics", "collaboration", "integration", "other"]>;
        sourceIds: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        name: string;
        description: string;
        category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "collaboration" | "integration";
        sourceIds: string[];
    }, {
        name: string;
        description: string;
        category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "collaboration" | "integration";
        sourceIds: string[];
    }>, "many">;
    workflow: z.ZodArray<z.ZodObject<{
        step: z.ZodNumber;
        action: z.ZodString;
        description: z.ZodString;
        sourceIds: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        description: string;
        sourceIds: string[];
        step: number;
        action: string;
    }, {
        description: string;
        sourceIds: string[];
        step: number;
        action: string;
    }>, "many">;
    differentiators: z.ZodArray<z.ZodObject<{
        statement: z.ZodString;
        differenceType: z.ZodEnum<["feature", "workflow", "user", "context", "integration", "constraint", "automation", "combination"]>;
        comparedToSolutionIds: z.ZodArray<z.ZodString, "many">;
        evidenceSourceIds: z.ZodArray<z.ZodString, "many">;
        strength: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        statement: string;
        evidenceSourceIds: string[];
        differenceType: "context" | "user" | "workflow" | "automation" | "integration" | "feature" | "constraint" | "combination";
        comparedToSolutionIds: string[];
        strength: number;
    }, {
        statement: string;
        evidenceSourceIds: string[];
        differenceType: "context" | "user" | "workflow" | "automation" | "integration" | "feature" | "constraint" | "combination";
        comparedToSolutionIds: string[];
        strength: number;
    }>, "many">;
    opportunityIds: z.ZodArray<z.ZodString, "many">;
    inspirationSources: z.ZodArray<z.ZodString, "many">;
    potentialRisks: z.ZodArray<z.ZodString, "many">;
    estimatedComplexity: z.ZodEnum<["low", "medium", "high"]>;
    estimatedHackathonFit: z.ZodNumber;
    innovationScore: z.ZodNumber;
    impactScore: z.ZodNumber;
    differentiationScore: z.ZodNumber;
    overallConceptScore: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    name: string;
    workflow: {
        description: string;
        sourceIds: string[];
        step: number;
        action: string;
    }[];
    targetUsers: string[];
    id: string;
    problemSolved: string;
    oneLineDescription: string;
    detailedDescription: string;
    keyFeatures: {
        name: string;
        description: string;
        category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "collaboration" | "integration";
        sourceIds: string[];
    }[];
    differentiators: {
        statement: string;
        evidenceSourceIds: string[];
        differenceType: "context" | "user" | "workflow" | "automation" | "integration" | "feature" | "constraint" | "combination";
        comparedToSolutionIds: string[];
        strength: number;
    }[];
    opportunityIds: string[];
    inspirationSources: string[];
    potentialRisks: string[];
    estimatedComplexity: "low" | "medium" | "high";
    estimatedHackathonFit: number;
    innovationScore: number;
    impactScore: number;
    differentiationScore: number;
    overallConceptScore: number;
}, {
    name: string;
    workflow: {
        description: string;
        sourceIds: string[];
        step: number;
        action: string;
    }[];
    targetUsers: string[];
    id: string;
    problemSolved: string;
    oneLineDescription: string;
    detailedDescription: string;
    keyFeatures: {
        name: string;
        description: string;
        category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "collaboration" | "integration";
        sourceIds: string[];
    }[];
    differentiators: {
        statement: string;
        evidenceSourceIds: string[];
        differenceType: "context" | "user" | "workflow" | "automation" | "integration" | "feature" | "constraint" | "combination";
        comparedToSolutionIds: string[];
        strength: number;
    }[];
    opportunityIds: string[];
    inspirationSources: string[];
    potentialRisks: string[];
    estimatedComplexity: "low" | "medium" | "high";
    estimatedHackathonFit: number;
    innovationScore: number;
    impactScore: number;
    differentiationScore: number;
    overallConceptScore: number;
}>;
export type CandidateIdea = z.infer<typeof CandidateIdeaSchema>;
export declare const NoveltyAssessmentSchema: z.ZodObject<{
    classification: z.ZodEnum<["high_differentiation", "moderate_differentiation", "low_differentiation"]>;
    score: z.ZodNumber;
    reasoning: z.ZodString;
    strongestDifferentiators: z.ZodArray<z.ZodString, "many">;
    majorOverlapAreas: z.ZodArray<z.ZodString, "many">;
    closestExistingSolutions: z.ZodArray<z.ZodString, "many">;
    evidenceSourceIds: z.ZodArray<z.ZodString, "many">;
    confidence: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    confidence: number;
    evidenceSourceIds: string[];
    classification: "high_differentiation" | "moderate_differentiation" | "low_differentiation";
    score: number;
    reasoning: string;
    strongestDifferentiators: string[];
    majorOverlapAreas: string[];
    closestExistingSolutions: string[];
}, {
    confidence: number;
    evidenceSourceIds: string[];
    classification: "high_differentiation" | "moderate_differentiation" | "low_differentiation";
    score: number;
    reasoning: string;
    strongestDifferentiators: string[];
    majorOverlapAreas: string[];
    closestExistingSolutions: string[];
}>;
export declare const ProjectCapabilityRequirementsSchema: z.ZodObject<{
    requiredCapabilities: z.ZodArray<z.ZodString, "many">;
    technicalCapabilities: z.ZodArray<z.ZodString, "many">;
    domainCapabilities: z.ZodArray<z.ZodString, "many">;
    likelyTeamRoles: z.ZodArray<z.ZodString, "many">;
    complexityAreas: z.ZodArray<z.ZodString, "many">;
    potentialSkillGaps: z.ZodArray<z.ZodString, "many">;
    criticalDependencies: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    requiredCapabilities: string[];
    technicalCapabilities: string[];
    domainCapabilities: string[];
    likelyTeamRoles: string[];
    complexityAreas: string[];
    potentialSkillGaps: string[];
    criticalDependencies: string[];
}, {
    requiredCapabilities: string[];
    technicalCapabilities: string[];
    domainCapabilities: string[];
    likelyTeamRoles: string[];
    complexityAreas: string[];
    potentialSkillGaps: string[];
    criticalDependencies: string[];
}>;
export declare const InnovationResultSchema: z.ZodObject<{
    innovationId: z.ZodString;
    candidateIdeas: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        oneLineDescription: z.ZodString;
        detailedDescription: z.ZodString;
        targetUsers: z.ZodArray<z.ZodString, "many">;
        problemSolved: z.ZodString;
        keyFeatures: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            description: z.ZodString;
            category: z.ZodEnum<["core", "ai", "automation", "workflow", "analytics", "collaboration", "integration", "other"]>;
            sourceIds: z.ZodArray<z.ZodString, "many">;
        }, "strip", z.ZodTypeAny, {
            name: string;
            description: string;
            category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "collaboration" | "integration";
            sourceIds: string[];
        }, {
            name: string;
            description: string;
            category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "collaboration" | "integration";
            sourceIds: string[];
        }>, "many">;
        workflow: z.ZodArray<z.ZodObject<{
            step: z.ZodNumber;
            action: z.ZodString;
            description: z.ZodString;
            sourceIds: z.ZodArray<z.ZodString, "many">;
        }, "strip", z.ZodTypeAny, {
            description: string;
            sourceIds: string[];
            step: number;
            action: string;
        }, {
            description: string;
            sourceIds: string[];
            step: number;
            action: string;
        }>, "many">;
        differentiators: z.ZodArray<z.ZodObject<{
            statement: z.ZodString;
            differenceType: z.ZodEnum<["feature", "workflow", "user", "context", "integration", "constraint", "automation", "combination"]>;
            comparedToSolutionIds: z.ZodArray<z.ZodString, "many">;
            evidenceSourceIds: z.ZodArray<z.ZodString, "many">;
            strength: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            statement: string;
            evidenceSourceIds: string[];
            differenceType: "context" | "user" | "workflow" | "automation" | "integration" | "feature" | "constraint" | "combination";
            comparedToSolutionIds: string[];
            strength: number;
        }, {
            statement: string;
            evidenceSourceIds: string[];
            differenceType: "context" | "user" | "workflow" | "automation" | "integration" | "feature" | "constraint" | "combination";
            comparedToSolutionIds: string[];
            strength: number;
        }>, "many">;
        opportunityIds: z.ZodArray<z.ZodString, "many">;
        inspirationSources: z.ZodArray<z.ZodString, "many">;
        potentialRisks: z.ZodArray<z.ZodString, "many">;
        estimatedComplexity: z.ZodEnum<["low", "medium", "high"]>;
        estimatedHackathonFit: z.ZodNumber;
        innovationScore: z.ZodNumber;
        impactScore: z.ZodNumber;
        differentiationScore: z.ZodNumber;
        overallConceptScore: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        name: string;
        workflow: {
            description: string;
            sourceIds: string[];
            step: number;
            action: string;
        }[];
        targetUsers: string[];
        id: string;
        problemSolved: string;
        oneLineDescription: string;
        detailedDescription: string;
        keyFeatures: {
            name: string;
            description: string;
            category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "collaboration" | "integration";
            sourceIds: string[];
        }[];
        differentiators: {
            statement: string;
            evidenceSourceIds: string[];
            differenceType: "context" | "user" | "workflow" | "automation" | "integration" | "feature" | "constraint" | "combination";
            comparedToSolutionIds: string[];
            strength: number;
        }[];
        opportunityIds: string[];
        inspirationSources: string[];
        potentialRisks: string[];
        estimatedComplexity: "low" | "medium" | "high";
        estimatedHackathonFit: number;
        innovationScore: number;
        impactScore: number;
        differentiationScore: number;
        overallConceptScore: number;
    }, {
        name: string;
        workflow: {
            description: string;
            sourceIds: string[];
            step: number;
            action: string;
        }[];
        targetUsers: string[];
        id: string;
        problemSolved: string;
        oneLineDescription: string;
        detailedDescription: string;
        keyFeatures: {
            name: string;
            description: string;
            category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "collaboration" | "integration";
            sourceIds: string[];
        }[];
        differentiators: {
            statement: string;
            evidenceSourceIds: string[];
            differenceType: "context" | "user" | "workflow" | "automation" | "integration" | "feature" | "constraint" | "combination";
            comparedToSolutionIds: string[];
            strength: number;
        }[];
        opportunityIds: string[];
        inspirationSources: string[];
        potentialRisks: string[];
        estimatedComplexity: "low" | "medium" | "high";
        estimatedHackathonFit: number;
        innovationScore: number;
        impactScore: number;
        differentiationScore: number;
        overallConceptScore: number;
    }>, "many">;
    selectedIdea: z.ZodDefault<z.ZodNullable<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        oneLineDescription: z.ZodString;
        detailedDescription: z.ZodString;
        targetUsers: z.ZodArray<z.ZodString, "many">;
        problemSolved: z.ZodString;
        keyFeatures: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            description: z.ZodString;
            category: z.ZodEnum<["core", "ai", "automation", "workflow", "analytics", "collaboration", "integration", "other"]>;
            sourceIds: z.ZodArray<z.ZodString, "many">;
        }, "strip", z.ZodTypeAny, {
            name: string;
            description: string;
            category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "collaboration" | "integration";
            sourceIds: string[];
        }, {
            name: string;
            description: string;
            category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "collaboration" | "integration";
            sourceIds: string[];
        }>, "many">;
        workflow: z.ZodArray<z.ZodObject<{
            step: z.ZodNumber;
            action: z.ZodString;
            description: z.ZodString;
            sourceIds: z.ZodArray<z.ZodString, "many">;
        }, "strip", z.ZodTypeAny, {
            description: string;
            sourceIds: string[];
            step: number;
            action: string;
        }, {
            description: string;
            sourceIds: string[];
            step: number;
            action: string;
        }>, "many">;
        differentiators: z.ZodArray<z.ZodObject<{
            statement: z.ZodString;
            differenceType: z.ZodEnum<["feature", "workflow", "user", "context", "integration", "constraint", "automation", "combination"]>;
            comparedToSolutionIds: z.ZodArray<z.ZodString, "many">;
            evidenceSourceIds: z.ZodArray<z.ZodString, "many">;
            strength: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            statement: string;
            evidenceSourceIds: string[];
            differenceType: "context" | "user" | "workflow" | "automation" | "integration" | "feature" | "constraint" | "combination";
            comparedToSolutionIds: string[];
            strength: number;
        }, {
            statement: string;
            evidenceSourceIds: string[];
            differenceType: "context" | "user" | "workflow" | "automation" | "integration" | "feature" | "constraint" | "combination";
            comparedToSolutionIds: string[];
            strength: number;
        }>, "many">;
        opportunityIds: z.ZodArray<z.ZodString, "many">;
        inspirationSources: z.ZodArray<z.ZodString, "many">;
        potentialRisks: z.ZodArray<z.ZodString, "many">;
        estimatedComplexity: z.ZodEnum<["low", "medium", "high"]>;
        estimatedHackathonFit: z.ZodNumber;
        innovationScore: z.ZodNumber;
        impactScore: z.ZodNumber;
        differentiationScore: z.ZodNumber;
        overallConceptScore: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        name: string;
        workflow: {
            description: string;
            sourceIds: string[];
            step: number;
            action: string;
        }[];
        targetUsers: string[];
        id: string;
        problemSolved: string;
        oneLineDescription: string;
        detailedDescription: string;
        keyFeatures: {
            name: string;
            description: string;
            category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "collaboration" | "integration";
            sourceIds: string[];
        }[];
        differentiators: {
            statement: string;
            evidenceSourceIds: string[];
            differenceType: "context" | "user" | "workflow" | "automation" | "integration" | "feature" | "constraint" | "combination";
            comparedToSolutionIds: string[];
            strength: number;
        }[];
        opportunityIds: string[];
        inspirationSources: string[];
        potentialRisks: string[];
        estimatedComplexity: "low" | "medium" | "high";
        estimatedHackathonFit: number;
        innovationScore: number;
        impactScore: number;
        differentiationScore: number;
        overallConceptScore: number;
    }, {
        name: string;
        workflow: {
            description: string;
            sourceIds: string[];
            step: number;
            action: string;
        }[];
        targetUsers: string[];
        id: string;
        problemSolved: string;
        oneLineDescription: string;
        detailedDescription: string;
        keyFeatures: {
            name: string;
            description: string;
            category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "collaboration" | "integration";
            sourceIds: string[];
        }[];
        differentiators: {
            statement: string;
            evidenceSourceIds: string[];
            differenceType: "context" | "user" | "workflow" | "automation" | "integration" | "feature" | "constraint" | "combination";
            comparedToSolutionIds: string[];
            strength: number;
        }[];
        opportunityIds: string[];
        inspirationSources: string[];
        potentialRisks: string[];
        estimatedComplexity: "low" | "medium" | "high";
        estimatedHackathonFit: number;
        innovationScore: number;
        impactScore: number;
        differentiationScore: number;
        overallConceptScore: number;
    }>>>;
    solutionLandscape: z.ZodObject<{
        totalSolutions: z.ZodNumber;
        directSolutions: z.ZodNumber;
        adjacentSolutions: z.ZodNumber;
        dominantApproaches: z.ZodArray<z.ZodString, "many">;
        majorSolutionClusters: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            description: z.ZodString;
            solutionIds: z.ZodArray<z.ZodString, "many">;
            commonFeatures: z.ZodArray<z.ZodString, "many">;
            distinguishingCharacteristics: z.ZodArray<z.ZodString, "many">;
        }, "strip", z.ZodTypeAny, {
            name: string;
            description: string;
            id: string;
            solutionIds: string[];
            commonFeatures: string[];
            distinguishingCharacteristics: string[];
        }, {
            name: string;
            description: string;
            id: string;
            solutionIds: string[];
            commonFeatures: string[];
            distinguishingCharacteristics: string[];
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        directSolutions: number;
        adjacentSolutions: number;
        totalSolutions: number;
        dominantApproaches: string[];
        majorSolutionClusters: {
            name: string;
            description: string;
            id: string;
            solutionIds: string[];
            commonFeatures: string[];
            distinguishingCharacteristics: string[];
        }[];
    }, {
        directSolutions: number;
        adjacentSolutions: number;
        totalSolutions: number;
        dominantApproaches: string[];
        majorSolutionClusters: {
            name: string;
            description: string;
            id: string;
            solutionIds: string[];
            commonFeatures: string[];
            distinguishingCharacteristics: string[];
        }[];
    }>;
    featureLandscape: z.ZodArray<z.ZodObject<{
        featureId: z.ZodString;
        canonicalName: z.ZodString;
        description: z.ZodString;
        category: z.ZodString;
        occurrenceCount: z.ZodNumber;
        totalRelevantSolutions: z.ZodNumber;
        frequency: z.ZodNumber;
        solutionIds: z.ZodArray<z.ZodString, "many">;
        frequencyClass: z.ZodEnum<["common", "moderate", "rare"]>;
        variants: z.ZodArray<z.ZodString, "many">;
        evidenceSourceIds: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        description: string;
        category: string;
        solutionIds: string[];
        featureId: string;
        canonicalName: string;
        occurrenceCount: number;
        totalRelevantSolutions: number;
        frequency: number;
        frequencyClass: "common" | "moderate" | "rare";
        variants: string[];
        evidenceSourceIds: string[];
    }, {
        description: string;
        category: string;
        solutionIds: string[];
        featureId: string;
        canonicalName: string;
        occurrenceCount: number;
        totalRelevantSolutions: number;
        frequency: number;
        frequencyClass: "common" | "moderate" | "rare";
        variants: string[];
        evidenceSourceIds: string[];
    }>, "many">;
    identifiedGaps: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        type: z.ZodEnum<["feature", "workflow", "user", "context", "constraint", "integration", "automation", "data", "other"]>;
        title: z.ZodString;
        description: z.ZodString;
        supportingSolutionIds: z.ZodArray<z.ZodString, "many">;
        supportingSourceIds: z.ZodArray<z.ZodString, "many">;
        impact: z.ZodNumber;
        confidence: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        type: "context" | "data" | "user" | "other" | "workflow" | "automation" | "integration" | "feature" | "constraint";
        description: string;
        confidence: number;
        id: string;
        title: string;
        supportingSolutionIds: string[];
        supportingSourceIds: string[];
        impact: number;
    }, {
        type: "context" | "data" | "user" | "other" | "workflow" | "automation" | "integration" | "feature" | "constraint";
        description: string;
        confidence: number;
        id: string;
        title: string;
        supportingSolutionIds: string[];
        supportingSourceIds: string[];
        impact: number;
    }>, "many">;
    differentiation: z.ZodObject<{
        summary: z.ZodString;
        keyDifferentiators: z.ZodArray<z.ZodObject<{
            statement: z.ZodString;
            differenceType: z.ZodEnum<["feature", "workflow", "user", "context", "integration", "constraint", "automation", "combination"]>;
            comparedToSolutionIds: z.ZodArray<z.ZodString, "many">;
            evidenceSourceIds: z.ZodArray<z.ZodString, "many">;
            strength: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            statement: string;
            evidenceSourceIds: string[];
            differenceType: "context" | "user" | "workflow" | "automation" | "integration" | "feature" | "constraint" | "combination";
            comparedToSolutionIds: string[];
            strength: number;
        }, {
            statement: string;
            evidenceSourceIds: string[];
            differenceType: "context" | "user" | "workflow" | "automation" | "integration" | "feature" | "constraint" | "combination";
            comparedToSolutionIds: string[];
            strength: number;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        summary: string;
        keyDifferentiators: {
            statement: string;
            evidenceSourceIds: string[];
            differenceType: "context" | "user" | "workflow" | "automation" | "integration" | "feature" | "constraint" | "combination";
            comparedToSolutionIds: string[];
            strength: number;
        }[];
    }, {
        summary: string;
        keyDifferentiators: {
            statement: string;
            evidenceSourceIds: string[];
            differenceType: "context" | "user" | "workflow" | "automation" | "integration" | "feature" | "constraint" | "combination";
            comparedToSolutionIds: string[];
            strength: number;
        }[];
    }>;
    noveltyAssessment: z.ZodObject<{
        classification: z.ZodEnum<["high_differentiation", "moderate_differentiation", "low_differentiation"]>;
        score: z.ZodNumber;
        reasoning: z.ZodString;
        strongestDifferentiators: z.ZodArray<z.ZodString, "many">;
        majorOverlapAreas: z.ZodArray<z.ZodString, "many">;
        closestExistingSolutions: z.ZodArray<z.ZodString, "many">;
        evidenceSourceIds: z.ZodArray<z.ZodString, "many">;
        confidence: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        confidence: number;
        evidenceSourceIds: string[];
        classification: "high_differentiation" | "moderate_differentiation" | "low_differentiation";
        score: number;
        reasoning: string;
        strongestDifferentiators: string[];
        majorOverlapAreas: string[];
        closestExistingSolutions: string[];
    }, {
        confidence: number;
        evidenceSourceIds: string[];
        classification: "high_differentiation" | "moderate_differentiation" | "low_differentiation";
        score: number;
        reasoning: string;
        strongestDifferentiators: string[];
        majorOverlapAreas: string[];
        closestExistingSolutions: string[];
    }>;
    projectCapabilityRequirements: z.ZodObject<{
        requiredCapabilities: z.ZodArray<z.ZodString, "many">;
        technicalCapabilities: z.ZodArray<z.ZodString, "many">;
        domainCapabilities: z.ZodArray<z.ZodString, "many">;
        likelyTeamRoles: z.ZodArray<z.ZodString, "many">;
        complexityAreas: z.ZodArray<z.ZodString, "many">;
        potentialSkillGaps: z.ZodArray<z.ZodString, "many">;
        criticalDependencies: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        requiredCapabilities: string[];
        technicalCapabilities: string[];
        domainCapabilities: string[];
        likelyTeamRoles: string[];
        complexityAreas: string[];
        potentialSkillGaps: string[];
        criticalDependencies: string[];
    }, {
        requiredCapabilities: string[];
        technicalCapabilities: string[];
        domainCapabilities: string[];
        likelyTeamRoles: string[];
        complexityAreas: string[];
        potentialSkillGaps: string[];
        criticalDependencies: string[];
    }>;
    validationQuestions: z.ZodArray<z.ZodString, "many">;
    confidence: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    confidence: number;
    innovationId: string;
    candidateIdeas: {
        name: string;
        workflow: {
            description: string;
            sourceIds: string[];
            step: number;
            action: string;
        }[];
        targetUsers: string[];
        id: string;
        problemSolved: string;
        oneLineDescription: string;
        detailedDescription: string;
        keyFeatures: {
            name: string;
            description: string;
            category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "collaboration" | "integration";
            sourceIds: string[];
        }[];
        differentiators: {
            statement: string;
            evidenceSourceIds: string[];
            differenceType: "context" | "user" | "workflow" | "automation" | "integration" | "feature" | "constraint" | "combination";
            comparedToSolutionIds: string[];
            strength: number;
        }[];
        opportunityIds: string[];
        inspirationSources: string[];
        potentialRisks: string[];
        estimatedComplexity: "low" | "medium" | "high";
        estimatedHackathonFit: number;
        innovationScore: number;
        impactScore: number;
        differentiationScore: number;
        overallConceptScore: number;
    }[];
    selectedIdea: {
        name: string;
        workflow: {
            description: string;
            sourceIds: string[];
            step: number;
            action: string;
        }[];
        targetUsers: string[];
        id: string;
        problemSolved: string;
        oneLineDescription: string;
        detailedDescription: string;
        keyFeatures: {
            name: string;
            description: string;
            category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "collaboration" | "integration";
            sourceIds: string[];
        }[];
        differentiators: {
            statement: string;
            evidenceSourceIds: string[];
            differenceType: "context" | "user" | "workflow" | "automation" | "integration" | "feature" | "constraint" | "combination";
            comparedToSolutionIds: string[];
            strength: number;
        }[];
        opportunityIds: string[];
        inspirationSources: string[];
        potentialRisks: string[];
        estimatedComplexity: "low" | "medium" | "high";
        estimatedHackathonFit: number;
        innovationScore: number;
        impactScore: number;
        differentiationScore: number;
        overallConceptScore: number;
    } | null;
    solutionLandscape: {
        directSolutions: number;
        adjacentSolutions: number;
        totalSolutions: number;
        dominantApproaches: string[];
        majorSolutionClusters: {
            name: string;
            description: string;
            id: string;
            solutionIds: string[];
            commonFeatures: string[];
            distinguishingCharacteristics: string[];
        }[];
    };
    featureLandscape: {
        description: string;
        category: string;
        solutionIds: string[];
        featureId: string;
        canonicalName: string;
        occurrenceCount: number;
        totalRelevantSolutions: number;
        frequency: number;
        frequencyClass: "common" | "moderate" | "rare";
        variants: string[];
        evidenceSourceIds: string[];
    }[];
    identifiedGaps: {
        type: "context" | "data" | "user" | "other" | "workflow" | "automation" | "integration" | "feature" | "constraint";
        description: string;
        confidence: number;
        id: string;
        title: string;
        supportingSolutionIds: string[];
        supportingSourceIds: string[];
        impact: number;
    }[];
    differentiation: {
        summary: string;
        keyDifferentiators: {
            statement: string;
            evidenceSourceIds: string[];
            differenceType: "context" | "user" | "workflow" | "automation" | "integration" | "feature" | "constraint" | "combination";
            comparedToSolutionIds: string[];
            strength: number;
        }[];
    };
    noveltyAssessment: {
        confidence: number;
        evidenceSourceIds: string[];
        classification: "high_differentiation" | "moderate_differentiation" | "low_differentiation";
        score: number;
        reasoning: string;
        strongestDifferentiators: string[];
        majorOverlapAreas: string[];
        closestExistingSolutions: string[];
    };
    projectCapabilityRequirements: {
        requiredCapabilities: string[];
        technicalCapabilities: string[];
        domainCapabilities: string[];
        likelyTeamRoles: string[];
        complexityAreas: string[];
        potentialSkillGaps: string[];
        criticalDependencies: string[];
    };
    validationQuestions: string[];
}, {
    confidence: number;
    innovationId: string;
    candidateIdeas: {
        name: string;
        workflow: {
            description: string;
            sourceIds: string[];
            step: number;
            action: string;
        }[];
        targetUsers: string[];
        id: string;
        problemSolved: string;
        oneLineDescription: string;
        detailedDescription: string;
        keyFeatures: {
            name: string;
            description: string;
            category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "collaboration" | "integration";
            sourceIds: string[];
        }[];
        differentiators: {
            statement: string;
            evidenceSourceIds: string[];
            differenceType: "context" | "user" | "workflow" | "automation" | "integration" | "feature" | "constraint" | "combination";
            comparedToSolutionIds: string[];
            strength: number;
        }[];
        opportunityIds: string[];
        inspirationSources: string[];
        potentialRisks: string[];
        estimatedComplexity: "low" | "medium" | "high";
        estimatedHackathonFit: number;
        innovationScore: number;
        impactScore: number;
        differentiationScore: number;
        overallConceptScore: number;
    }[];
    solutionLandscape: {
        directSolutions: number;
        adjacentSolutions: number;
        totalSolutions: number;
        dominantApproaches: string[];
        majorSolutionClusters: {
            name: string;
            description: string;
            id: string;
            solutionIds: string[];
            commonFeatures: string[];
            distinguishingCharacteristics: string[];
        }[];
    };
    featureLandscape: {
        description: string;
        category: string;
        solutionIds: string[];
        featureId: string;
        canonicalName: string;
        occurrenceCount: number;
        totalRelevantSolutions: number;
        frequency: number;
        frequencyClass: "common" | "moderate" | "rare";
        variants: string[];
        evidenceSourceIds: string[];
    }[];
    identifiedGaps: {
        type: "context" | "data" | "user" | "other" | "workflow" | "automation" | "integration" | "feature" | "constraint";
        description: string;
        confidence: number;
        id: string;
        title: string;
        supportingSolutionIds: string[];
        supportingSourceIds: string[];
        impact: number;
    }[];
    differentiation: {
        summary: string;
        keyDifferentiators: {
            statement: string;
            evidenceSourceIds: string[];
            differenceType: "context" | "user" | "workflow" | "automation" | "integration" | "feature" | "constraint" | "combination";
            comparedToSolutionIds: string[];
            strength: number;
        }[];
    };
    noveltyAssessment: {
        confidence: number;
        evidenceSourceIds: string[];
        classification: "high_differentiation" | "moderate_differentiation" | "low_differentiation";
        score: number;
        reasoning: string;
        strongestDifferentiators: string[];
        majorOverlapAreas: string[];
        closestExistingSolutions: string[];
    };
    projectCapabilityRequirements: {
        requiredCapabilities: string[];
        technicalCapabilities: string[];
        domainCapabilities: string[];
        likelyTeamRoles: string[];
        complexityAreas: string[];
        potentialSkillGaps: string[];
        criticalDependencies: string[];
    };
    validationQuestions: string[];
    selectedIdea?: {
        name: string;
        workflow: {
            description: string;
            sourceIds: string[];
            step: number;
            action: string;
        }[];
        targetUsers: string[];
        id: string;
        problemSolved: string;
        oneLineDescription: string;
        detailedDescription: string;
        keyFeatures: {
            name: string;
            description: string;
            category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "collaboration" | "integration";
            sourceIds: string[];
        }[];
        differentiators: {
            statement: string;
            evidenceSourceIds: string[];
            differenceType: "context" | "user" | "workflow" | "automation" | "integration" | "feature" | "constraint" | "combination";
            comparedToSolutionIds: string[];
            strength: number;
        }[];
        opportunityIds: string[];
        inspirationSources: string[];
        potentialRisks: string[];
        estimatedComplexity: "low" | "medium" | "high";
        estimatedHackathonFit: number;
        innovationScore: number;
        impactScore: number;
        differentiationScore: number;
        overallConceptScore: number;
    } | null | undefined;
}>;
export type InnovationResult = z.infer<typeof InnovationResultSchema>;
export declare const TeamMemberProfileSchema: z.ZodObject<{
    memberId: z.ZodString;
    name: z.ZodString;
    parsedSkills: z.ZodArray<z.ZodString, "many">;
    primaryRole: z.ZodString;
    proficiencyLevels: z.ZodRecord<z.ZodString, z.ZodEnum<["beginner", "intermediate", "expert"]>>;
    resumeSnippet: z.ZodString;
    githubUsername: z.ZodOptional<z.ZodString>;
    yearsExperience: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    name: string;
    memberId: string;
    parsedSkills: string[];
    primaryRole: string;
    proficiencyLevels: Record<string, "beginner" | "intermediate" | "expert">;
    resumeSnippet: string;
    githubUsername?: string | undefined;
    yearsExperience?: number | undefined;
}, {
    name: string;
    memberId: string;
    parsedSkills: string[];
    primaryRole: string;
    proficiencyLevels: Record<string, "beginner" | "intermediate" | "expert">;
    resumeSnippet: string;
    githubUsername?: string | undefined;
    yearsExperience?: number | undefined;
}>;
export declare const RoleAssignmentSchema: z.ZodObject<{
    roleTitle: z.ZodString;
    assignedMemberId: z.ZodString;
    assignedMemberName: z.ZodString;
    assignedCapabilities: z.ZodArray<z.ZodString, "many">;
    assignedComponents: z.ZodArray<z.ZodString, "many">;
    workloadPercentage: z.ZodNumber;
    reasoning: z.ZodString;
}, "strip", z.ZodTypeAny, {
    reasoning: string;
    roleTitle: string;
    assignedMemberId: string;
    assignedMemberName: string;
    assignedCapabilities: string[];
    assignedComponents: string[];
    workloadPercentage: number;
}, {
    reasoning: string;
    roleTitle: string;
    assignedMemberId: string;
    assignedMemberName: string;
    assignedCapabilities: string[];
    assignedComponents: string[];
    workloadPercentage: number;
}>;
export declare const TeamSkillGapSchema: z.ZodObject<{
    missingCapability: z.ZodString;
    riskLevel: z.ZodEnum<["low", "medium", "high"]>;
    mitigationStrategy: z.ZodString;
}, "strip", z.ZodTypeAny, {
    missingCapability: string;
    riskLevel: "low" | "medium" | "high";
    mitigationStrategy: string;
}, {
    missingCapability: string;
    riskLevel: "low" | "medium" | "high";
    mitigationStrategy: string;
}>;
export declare const DataAvailabilitySchema: z.ZodObject<{
    dataType: z.ZodString;
    available: z.ZodBoolean;
    source: z.ZodOptional<z.ZodString>;
    acquisitionStrategy: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    dataType: string;
    available: boolean;
    source?: string | undefined;
    acquisitionStrategy?: string | undefined;
}, {
    dataType: string;
    available: boolean;
    source?: string | undefined;
    acquisitionStrategy?: string | undefined;
}>;
export declare const TechStackOptionSchema: z.ZodObject<{
    optionId: z.ZodString;
    rank: z.ZodNumber;
    name: z.ZodString;
    description: z.ZodString;
    frontend: z.ZodArray<z.ZodString, "many">;
    backend: z.ZodArray<z.ZodString, "many">;
    database: z.ZodArray<z.ZodString, "many">;
    aiMl: z.ZodArray<z.ZodString, "many">;
    infrastructure: z.ZodArray<z.ZodString, "many">;
    otherTools: z.ZodArray<z.ZodString, "many">;
    architectureOverview: z.ZodString;
    setupComplexity: z.ZodEnum<["low", "medium", "high"]>;
    timeToPrototype: z.ZodString;
    merits: z.ZodArray<z.ZodString, "many">;
    demerits: z.ZodArray<z.ZodString, "many">;
    teamFitScore: z.ZodNumber;
    overallScore: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    name: string;
    description: string;
    optionId: string;
    rank: number;
    frontend: string[];
    backend: string[];
    database: string[];
    aiMl: string[];
    infrastructure: string[];
    otherTools: string[];
    architectureOverview: string;
    setupComplexity: "low" | "medium" | "high";
    timeToPrototype: string;
    merits: string[];
    demerits: string[];
    teamFitScore: number;
    overallScore: number;
}, {
    name: string;
    description: string;
    optionId: string;
    rank: number;
    frontend: string[];
    backend: string[];
    database: string[];
    aiMl: string[];
    infrastructure: string[];
    otherTools: string[];
    architectureOverview: string;
    setupComplexity: "low" | "medium" | "high";
    timeToPrototype: string;
    merits: string[];
    demerits: string[];
    teamFitScore: number;
    overallScore: number;
}>;
export declare const TeamAnalysisSchema: z.ZodObject<{
    teamMembers: z.ZodArray<z.ZodObject<{
        memberId: z.ZodString;
        name: z.ZodString;
        parsedSkills: z.ZodArray<z.ZodString, "many">;
        primaryRole: z.ZodString;
        proficiencyLevels: z.ZodRecord<z.ZodString, z.ZodEnum<["beginner", "intermediate", "expert"]>>;
        resumeSnippet: z.ZodString;
        githubUsername: z.ZodOptional<z.ZodString>;
        yearsExperience: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        memberId: string;
        parsedSkills: string[];
        primaryRole: string;
        proficiencyLevels: Record<string, "beginner" | "intermediate" | "expert">;
        resumeSnippet: string;
        githubUsername?: string | undefined;
        yearsExperience?: number | undefined;
    }, {
        name: string;
        memberId: string;
        parsedSkills: string[];
        primaryRole: string;
        proficiencyLevels: Record<string, "beginner" | "intermediate" | "expert">;
        resumeSnippet: string;
        githubUsername?: string | undefined;
        yearsExperience?: number | undefined;
    }>, "many">;
    roleAssignments: z.ZodArray<z.ZodObject<{
        roleTitle: z.ZodString;
        assignedMemberId: z.ZodString;
        assignedMemberName: z.ZodString;
        assignedCapabilities: z.ZodArray<z.ZodString, "many">;
        assignedComponents: z.ZodArray<z.ZodString, "many">;
        workloadPercentage: z.ZodNumber;
        reasoning: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        reasoning: string;
        roleTitle: string;
        assignedMemberId: string;
        assignedMemberName: string;
        assignedCapabilities: string[];
        assignedComponents: string[];
        workloadPercentage: number;
    }, {
        reasoning: string;
        roleTitle: string;
        assignedMemberId: string;
        assignedMemberName: string;
        assignedCapabilities: string[];
        assignedComponents: string[];
        workloadPercentage: number;
    }>, "many">;
    skillGaps: z.ZodArray<z.ZodObject<{
        missingCapability: z.ZodString;
        riskLevel: z.ZodEnum<["low", "medium", "high"]>;
        mitigationStrategy: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        missingCapability: string;
        riskLevel: "low" | "medium" | "high";
        mitigationStrategy: string;
    }, {
        missingCapability: string;
        riskLevel: "low" | "medium" | "high";
        mitigationStrategy: string;
    }>, "many">;
    dataAvailability: z.ZodArray<z.ZodObject<{
        dataType: z.ZodString;
        available: z.ZodBoolean;
        source: z.ZodOptional<z.ZodString>;
        acquisitionStrategy: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        dataType: string;
        available: boolean;
        source?: string | undefined;
        acquisitionStrategy?: string | undefined;
    }, {
        dataType: string;
        available: boolean;
        source?: string | undefined;
        acquisitionStrategy?: string | undefined;
    }>, "many">;
    expandedSolution: z.ZodObject<{
        name: z.ZodString;
        description: z.ZodString;
        problemSolved: z.ZodString;
        targetUsers: z.ZodArray<z.ZodString, "many">;
        keyFeatures: z.ZodArray<z.ZodString, "many">;
        workflow: z.ZodArray<z.ZodString, "many">;
        requiredCapabilities: z.ZodArray<z.ZodString, "many">;
        technicalCapabilities: z.ZodArray<z.ZodString, "many">;
        complexityAreas: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        name: string;
        description: string;
        workflow: string[];
        targetUsers: string[];
        problemSolved: string;
        keyFeatures: string[];
        requiredCapabilities: string[];
        technicalCapabilities: string[];
        complexityAreas: string[];
    }, {
        name: string;
        description: string;
        workflow: string[];
        targetUsers: string[];
        problemSolved: string;
        keyFeatures: string[];
        requiredCapabilities: string[];
        technicalCapabilities: string[];
        complexityAreas: string[];
    }>;
    feasibility: z.ZodObject<{
        score: z.ZodNumber;
        summary: z.ZodString;
        teamStrengths: z.ZodArray<z.ZodString, "many">;
        teamWeaknesses: z.ZodArray<z.ZodString, "many">;
        timeRisk: z.ZodEnum<["low", "medium", "high"]>;
        technicalRisk: z.ZodEnum<["low", "medium", "high"]>;
        dataRisk: z.ZodEnum<["low", "medium", "high"]>;
        recommendations: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        summary: string;
        score: number;
        teamStrengths: string[];
        teamWeaknesses: string[];
        timeRisk: "low" | "medium" | "high";
        technicalRisk: "low" | "medium" | "high";
        dataRisk: "low" | "medium" | "high";
        recommendations: string[];
    }, {
        summary: string;
        score: number;
        teamStrengths: string[];
        teamWeaknesses: string[];
        timeRisk: "low" | "medium" | "high";
        technicalRisk: "low" | "medium" | "high";
        dataRisk: "low" | "medium" | "high";
        recommendations: string[];
    }>;
    techStackOptions: z.ZodArray<z.ZodObject<{
        optionId: z.ZodString;
        rank: z.ZodNumber;
        name: z.ZodString;
        description: z.ZodString;
        frontend: z.ZodArray<z.ZodString, "many">;
        backend: z.ZodArray<z.ZodString, "many">;
        database: z.ZodArray<z.ZodString, "many">;
        aiMl: z.ZodArray<z.ZodString, "many">;
        infrastructure: z.ZodArray<z.ZodString, "many">;
        otherTools: z.ZodArray<z.ZodString, "many">;
        architectureOverview: z.ZodString;
        setupComplexity: z.ZodEnum<["low", "medium", "high"]>;
        timeToPrototype: z.ZodString;
        merits: z.ZodArray<z.ZodString, "many">;
        demerits: z.ZodArray<z.ZodString, "many">;
        teamFitScore: z.ZodNumber;
        overallScore: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        name: string;
        description: string;
        optionId: string;
        rank: number;
        frontend: string[];
        backend: string[];
        database: string[];
        aiMl: string[];
        infrastructure: string[];
        otherTools: string[];
        architectureOverview: string;
        setupComplexity: "low" | "medium" | "high";
        timeToPrototype: string;
        merits: string[];
        demerits: string[];
        teamFitScore: number;
        overallScore: number;
    }, {
        name: string;
        description: string;
        optionId: string;
        rank: number;
        frontend: string[];
        backend: string[];
        database: string[];
        aiMl: string[];
        infrastructure: string[];
        otherTools: string[];
        architectureOverview: string;
        setupComplexity: "low" | "medium" | "high";
        timeToPrototype: string;
        merits: string[];
        demerits: string[];
        teamFitScore: number;
        overallScore: number;
    }>, "many">;
    selectedTechStack: z.ZodDefault<z.ZodNullable<z.ZodObject<{
        optionId: z.ZodString;
        rank: z.ZodNumber;
        name: z.ZodString;
        description: z.ZodString;
        frontend: z.ZodArray<z.ZodString, "many">;
        backend: z.ZodArray<z.ZodString, "many">;
        database: z.ZodArray<z.ZodString, "many">;
        aiMl: z.ZodArray<z.ZodString, "many">;
        infrastructure: z.ZodArray<z.ZodString, "many">;
        otherTools: z.ZodArray<z.ZodString, "many">;
        architectureOverview: z.ZodString;
        setupComplexity: z.ZodEnum<["low", "medium", "high"]>;
        timeToPrototype: z.ZodString;
        merits: z.ZodArray<z.ZodString, "many">;
        demerits: z.ZodArray<z.ZodString, "many">;
        teamFitScore: z.ZodNumber;
        overallScore: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        name: string;
        description: string;
        optionId: string;
        rank: number;
        frontend: string[];
        backend: string[];
        database: string[];
        aiMl: string[];
        infrastructure: string[];
        otherTools: string[];
        architectureOverview: string;
        setupComplexity: "low" | "medium" | "high";
        timeToPrototype: string;
        merits: string[];
        demerits: string[];
        teamFitScore: number;
        overallScore: number;
    }, {
        name: string;
        description: string;
        optionId: string;
        rank: number;
        frontend: string[];
        backend: string[];
        database: string[];
        aiMl: string[];
        infrastructure: string[];
        otherTools: string[];
        architectureOverview: string;
        setupComplexity: "low" | "medium" | "high";
        timeToPrototype: string;
        merits: string[];
        demerits: string[];
        teamFitScore: number;
        overallScore: number;
    }>>>;
    overallTeamStrategy: z.ZodString;
}, "strip", z.ZodTypeAny, {
    teamMembers: {
        name: string;
        memberId: string;
        parsedSkills: string[];
        primaryRole: string;
        proficiencyLevels: Record<string, "beginner" | "intermediate" | "expert">;
        resumeSnippet: string;
        githubUsername?: string | undefined;
        yearsExperience?: number | undefined;
    }[];
    roleAssignments: {
        reasoning: string;
        roleTitle: string;
        assignedMemberId: string;
        assignedMemberName: string;
        assignedCapabilities: string[];
        assignedComponents: string[];
        workloadPercentage: number;
    }[];
    skillGaps: {
        missingCapability: string;
        riskLevel: "low" | "medium" | "high";
        mitigationStrategy: string;
    }[];
    dataAvailability: {
        dataType: string;
        available: boolean;
        source?: string | undefined;
        acquisitionStrategy?: string | undefined;
    }[];
    expandedSolution: {
        name: string;
        description: string;
        workflow: string[];
        targetUsers: string[];
        problemSolved: string;
        keyFeatures: string[];
        requiredCapabilities: string[];
        technicalCapabilities: string[];
        complexityAreas: string[];
    };
    feasibility: {
        summary: string;
        score: number;
        teamStrengths: string[];
        teamWeaknesses: string[];
        timeRisk: "low" | "medium" | "high";
        technicalRisk: "low" | "medium" | "high";
        dataRisk: "low" | "medium" | "high";
        recommendations: string[];
    };
    techStackOptions: {
        name: string;
        description: string;
        optionId: string;
        rank: number;
        frontend: string[];
        backend: string[];
        database: string[];
        aiMl: string[];
        infrastructure: string[];
        otherTools: string[];
        architectureOverview: string;
        setupComplexity: "low" | "medium" | "high";
        timeToPrototype: string;
        merits: string[];
        demerits: string[];
        teamFitScore: number;
        overallScore: number;
    }[];
    selectedTechStack: {
        name: string;
        description: string;
        optionId: string;
        rank: number;
        frontend: string[];
        backend: string[];
        database: string[];
        aiMl: string[];
        infrastructure: string[];
        otherTools: string[];
        architectureOverview: string;
        setupComplexity: "low" | "medium" | "high";
        timeToPrototype: string;
        merits: string[];
        demerits: string[];
        teamFitScore: number;
        overallScore: number;
    } | null;
    overallTeamStrategy: string;
}, {
    teamMembers: {
        name: string;
        memberId: string;
        parsedSkills: string[];
        primaryRole: string;
        proficiencyLevels: Record<string, "beginner" | "intermediate" | "expert">;
        resumeSnippet: string;
        githubUsername?: string | undefined;
        yearsExperience?: number | undefined;
    }[];
    roleAssignments: {
        reasoning: string;
        roleTitle: string;
        assignedMemberId: string;
        assignedMemberName: string;
        assignedCapabilities: string[];
        assignedComponents: string[];
        workloadPercentage: number;
    }[];
    skillGaps: {
        missingCapability: string;
        riskLevel: "low" | "medium" | "high";
        mitigationStrategy: string;
    }[];
    dataAvailability: {
        dataType: string;
        available: boolean;
        source?: string | undefined;
        acquisitionStrategy?: string | undefined;
    }[];
    expandedSolution: {
        name: string;
        description: string;
        workflow: string[];
        targetUsers: string[];
        problemSolved: string;
        keyFeatures: string[];
        requiredCapabilities: string[];
        technicalCapabilities: string[];
        complexityAreas: string[];
    };
    feasibility: {
        summary: string;
        score: number;
        teamStrengths: string[];
        teamWeaknesses: string[];
        timeRisk: "low" | "medium" | "high";
        technicalRisk: "low" | "medium" | "high";
        dataRisk: "low" | "medium" | "high";
        recommendations: string[];
    };
    techStackOptions: {
        name: string;
        description: string;
        optionId: string;
        rank: number;
        frontend: string[];
        backend: string[];
        database: string[];
        aiMl: string[];
        infrastructure: string[];
        otherTools: string[];
        architectureOverview: string;
        setupComplexity: "low" | "medium" | "high";
        timeToPrototype: string;
        merits: string[];
        demerits: string[];
        teamFitScore: number;
        overallScore: number;
    }[];
    overallTeamStrategy: string;
    selectedTechStack?: {
        name: string;
        description: string;
        optionId: string;
        rank: number;
        frontend: string[];
        backend: string[];
        database: string[];
        aiMl: string[];
        infrastructure: string[];
        otherTools: string[];
        architectureOverview: string;
        setupComplexity: "low" | "medium" | "high";
        timeToPrototype: string;
        merits: string[];
        demerits: string[];
        teamFitScore: number;
        overallScore: number;
    } | null | undefined;
}>;
export type TeamAnalysis = z.infer<typeof TeamAnalysisSchema>;
export type TeamMemberProfile = z.infer<typeof TeamMemberProfileSchema>;
export type RoleAssignment = z.infer<typeof RoleAssignmentSchema>;
export type TeamSkillGap = z.infer<typeof TeamSkillGapSchema>;
export type DataAvailability = z.infer<typeof DataAvailabilitySchema>;
export type TechStackOption = z.infer<typeof TechStackOptionSchema>;
export type ProjectCapabilityRequirements = z.infer<typeof ProjectCapabilityRequirementsSchema>;
export declare const TechChoiceSchema: z.ZodObject<{
    optionId: z.ZodString;
    name: z.ZodString;
    rationale: z.ZodString;
    teamFitScore: z.ZodNumber;
    components: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    name: string;
    optionId: string;
    teamFitScore: number;
    rationale: string;
    components: string[];
}, {
    name: string;
    optionId: string;
    teamFitScore: number;
    rationale: string;
    components: string[];
}>;
export declare const ComponentSchema: z.ZodObject<{
    name: z.ZodString;
    type: z.ZodEnum<["frontend", "backend", "ai_engine", "vector_db", "database", "cache", "background_service", "external_api", "other"]>;
    technology: z.ZodString;
    purpose: z.ZodString;
    responsibilities: z.ZodArray<z.ZodString, "many">;
    ports: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    dependencies: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    type: "other" | "frontend" | "backend" | "database" | "ai_engine" | "vector_db" | "cache" | "background_service" | "external_api";
    name: string;
    technology: string;
    purpose: string;
    responsibilities: string[];
    ports?: string[] | undefined;
    dependencies?: string[] | undefined;
}, {
    type: "other" | "frontend" | "backend" | "database" | "ai_engine" | "vector_db" | "cache" | "background_service" | "external_api";
    name: string;
    technology: string;
    purpose: string;
    responsibilities: string[];
    ports?: string[] | undefined;
    dependencies?: string[] | undefined;
}>;
export declare const DataFlowStepSchema: z.ZodObject<{
    step: z.ZodNumber;
    actor: z.ZodString;
    action: z.ZodString;
    system: z.ZodString;
    description: z.ZodString;
    dataPayload: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    description: string;
    step: number;
    action: string;
    actor: string;
    system: string;
    dataPayload?: string | undefined;
}, {
    description: string;
    step: number;
    action: string;
    actor: string;
    system: string;
    dataPayload?: string | undefined;
}>;
export declare const DatabaseModelSchema: z.ZodObject<{
    collectionName: z.ZodString;
    purpose: z.ZodString;
    fields: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        type: z.ZodString;
        required: z.ZodOptional<z.ZodBoolean>;
        indexed: z.ZodOptional<z.ZodBoolean>;
        description: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type: string;
        name: string;
        description?: string | undefined;
        required?: boolean | undefined;
        indexed?: boolean | undefined;
    }, {
        type: string;
        name: string;
        description?: string | undefined;
        required?: boolean | undefined;
        indexed?: boolean | undefined;
    }>, "many">;
    indexes: z.ZodOptional<z.ZodArray<z.ZodObject<{
        fields: z.ZodArray<z.ZodString, "many">;
        type: z.ZodOptional<z.ZodEnum<["unique", "compound", "text", "single"]>>;
        reason: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        fields: string[];
        type?: "unique" | "compound" | "text" | "single" | undefined;
        reason?: string | undefined;
    }, {
        fields: string[];
        type?: "unique" | "compound" | "text" | "single" | undefined;
        reason?: string | undefined;
    }>, "many">>;
    relationships: z.ZodOptional<z.ZodArray<z.ZodObject<{
        type: z.ZodEnum<["reference", "embedding", "embedded"]>;
        targetCollection: z.ZodString;
        description: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: "reference" | "embedding" | "embedded";
        description: string;
        targetCollection: string;
    }, {
        type: "reference" | "embedding" | "embedded";
        description: string;
        targetCollection: string;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    purpose: string;
    collectionName: string;
    fields: {
        type: string;
        name: string;
        description?: string | undefined;
        required?: boolean | undefined;
        indexed?: boolean | undefined;
    }[];
    indexes?: {
        fields: string[];
        type?: "unique" | "compound" | "text" | "single" | undefined;
        reason?: string | undefined;
    }[] | undefined;
    relationships?: {
        type: "reference" | "embedding" | "embedded";
        description: string;
        targetCollection: string;
    }[] | undefined;
}, {
    purpose: string;
    collectionName: string;
    fields: {
        type: string;
        name: string;
        description?: string | undefined;
        required?: boolean | undefined;
        indexed?: boolean | undefined;
    }[];
    indexes?: {
        fields: string[];
        type?: "unique" | "compound" | "text" | "single" | undefined;
        reason?: string | undefined;
    }[] | undefined;
    relationships?: {
        type: "reference" | "embedding" | "embedded";
        description: string;
        targetCollection: string;
    }[] | undefined;
}>;
export declare const ApiContractSchema: z.ZodObject<{
    method: z.ZodEnum<["GET", "POST", "PUT", "PATCH", "DELETE"]>;
    path: z.ZodString;
    description: z.ZodString;
    authRequired: z.ZodOptional<z.ZodBoolean>;
    requestBody: z.ZodOptional<z.ZodObject<{
        contentType: z.ZodString;
        schema: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        contentType: string;
        schema: string;
    }, {
        contentType: string;
        schema: string;
    }>>;
    responseSchema: z.ZodString;
    rateLimit: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    path: string;
    description: string;
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    responseSchema: string;
    authRequired?: boolean | undefined;
    requestBody?: {
        contentType: string;
        schema: string;
    } | undefined;
    rateLimit?: string | undefined;
}, {
    path: string;
    description: string;
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    responseSchema: string;
    authRequired?: boolean | undefined;
    requestBody?: {
        contentType: string;
        schema: string;
    } | undefined;
    rateLimit?: string | undefined;
}>;
export declare const AiArchitectureSchema: z.ZodObject<{
    llmModels: z.ZodArray<z.ZodObject<{
        provider: z.ZodString;
        model: z.ZodString;
        purpose: z.ZodString;
        temperature: z.ZodOptional<z.ZodNumber>;
        maxTokens: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        purpose: string;
        provider: string;
        model: string;
        temperature?: number | undefined;
        maxTokens?: number | undefined;
    }, {
        purpose: string;
        provider: string;
        model: string;
        temperature?: number | undefined;
        maxTokens?: number | undefined;
    }>, "many">;
    prompts: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        type: z.ZodEnum<["system", "user", "few_shot", "chain_of_thought"]>;
        purpose: z.ZodString;
        template: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type: "user" | "system" | "few_shot" | "chain_of_thought";
        name: string;
        purpose: string;
        template?: string | undefined;
    }, {
        type: "user" | "system" | "few_shot" | "chain_of_thought";
        name: string;
        purpose: string;
        template?: string | undefined;
    }>, "many">;
    agentTools: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        type: z.ZodEnum<["search", "code_execution", "web_scraping", "api_call", "file_operation", "other"]>;
        purpose: z.ZodString;
        integration: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: "other" | "search" | "code_execution" | "web_scraping" | "api_call" | "file_operation";
        name: string;
        integration: string;
        purpose: string;
    }, {
        type: "other" | "search" | "code_execution" | "web_scraping" | "api_call" | "file_operation";
        name: string;
        integration: string;
        purpose: string;
    }>, "many">;
    executionPipeline: z.ZodArray<z.ZodObject<{
        stage: z.ZodNumber;
        name: z.ZodString;
        description: z.ZodString;
        inputs: z.ZodArray<z.ZodString, "many">;
        outputs: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        name: string;
        description: string;
        inputs: string[];
        outputs: string[];
        stage: number;
    }, {
        name: string;
        description: string;
        inputs: string[];
        outputs: string[];
        stage: number;
    }>, "many">;
    fallbackPolicies: z.ZodArray<z.ZodObject<{
        scenario: z.ZodString;
        strategy: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        scenario: string;
        strategy: string;
    }, {
        scenario: string;
        strategy: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    llmModels: {
        purpose: string;
        provider: string;
        model: string;
        temperature?: number | undefined;
        maxTokens?: number | undefined;
    }[];
    prompts: {
        type: "user" | "system" | "few_shot" | "chain_of_thought";
        name: string;
        purpose: string;
        template?: string | undefined;
    }[];
    agentTools: {
        type: "other" | "search" | "code_execution" | "web_scraping" | "api_call" | "file_operation";
        name: string;
        integration: string;
        purpose: string;
    }[];
    executionPipeline: {
        name: string;
        description: string;
        inputs: string[];
        outputs: string[];
        stage: number;
    }[];
    fallbackPolicies: {
        scenario: string;
        strategy: string;
    }[];
}, {
    llmModels: {
        purpose: string;
        provider: string;
        model: string;
        temperature?: number | undefined;
        maxTokens?: number | undefined;
    }[];
    prompts: {
        type: "user" | "system" | "few_shot" | "chain_of_thought";
        name: string;
        purpose: string;
        template?: string | undefined;
    }[];
    agentTools: {
        type: "other" | "search" | "code_execution" | "web_scraping" | "api_call" | "file_operation";
        name: string;
        integration: string;
        purpose: string;
    }[];
    executionPipeline: {
        name: string;
        description: string;
        inputs: string[];
        outputs: string[];
        stage: number;
    }[];
    fallbackPolicies: {
        scenario: string;
        strategy: string;
    }[];
}>;
export declare const RagArchitectureSchema: z.ZodOptional<z.ZodObject<{
    vectorDbProvider: z.ZodString;
    embeddingModel: z.ZodString;
    chunkSize: z.ZodNumber;
    chunkOverlap: z.ZodNumber;
    retrievalTopK: z.ZodNumber;
    searchFilter: z.ZodOptional<z.ZodString>;
    indexingStrategy: z.ZodOptional<z.ZodString>;
    reranker: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    vectorDbProvider: string;
    embeddingModel: string;
    chunkSize: number;
    chunkOverlap: number;
    retrievalTopK: number;
    searchFilter?: string | undefined;
    indexingStrategy?: string | undefined;
    reranker?: string | undefined;
}, {
    vectorDbProvider: string;
    embeddingModel: string;
    chunkSize: number;
    chunkOverlap: number;
    retrievalTopK: number;
    searchFilter?: string | undefined;
    indexingStrategy?: string | undefined;
    reranker?: string | undefined;
}>>;
export declare const ExternalServiceSchema: z.ZodObject<{
    name: z.ZodString;
    purpose: z.ZodString;
    authMethod: z.ZodString;
    rateLimit: z.ZodOptional<z.ZodString>;
    fallbackStrategy: z.ZodOptional<z.ZodString>;
    costTier: z.ZodOptional<z.ZodEnum<["free", "low", "medium", "high"]>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    purpose: string;
    authMethod: string;
    rateLimit?: string | undefined;
    fallbackStrategy?: string | undefined;
    costTier?: "low" | "medium" | "high" | "free" | undefined;
}, {
    name: string;
    purpose: string;
    authMethod: string;
    rateLimit?: string | undefined;
    fallbackStrategy?: string | undefined;
    costTier?: "low" | "medium" | "high" | "free" | undefined;
}>;
export declare const TechnicalRiskSchema: z.ZodObject<{
    id: z.ZodString;
    description: z.ZodString;
    likelihood: z.ZodEnum<["low", "medium", "high"]>;
    impact: z.ZodEnum<["low", "medium", "high"]>;
    severity: z.ZodEnum<["low", "medium", "high", "critical"]>;
    mitigationStrategy: z.ZodString;
    affectedComponents: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    description: string;
    severity: "low" | "medium" | "high" | "critical";
    id: string;
    impact: "low" | "medium" | "high";
    mitigationStrategy: string;
    likelihood: "low" | "medium" | "high";
    affectedComponents: string[];
}, {
    description: string;
    severity: "low" | "medium" | "high" | "critical";
    id: string;
    impact: "low" | "medium" | "high";
    mitigationStrategy: string;
    likelihood: "low" | "medium" | "high";
    affectedComponents: string[];
}>;
export declare const TaskDependencySchema: z.ZodObject<{
    taskId: z.ZodString;
    name: z.ZodString;
    description: z.ZodString;
    assignedRole: z.ZodString;
    assignedMemberId: z.ZodOptional<z.ZodString>;
    estimatedHours: z.ZodNumber;
    dependencies: z.ZodArray<z.ZodString, "many">;
    priority: z.ZodEnum<["critical", "high", "medium", "low"]>;
    phase: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    name: string;
    description: string;
    priority: "low" | "medium" | "high" | "critical";
    dependencies: string[];
    taskId: string;
    assignedRole: string;
    estimatedHours: number;
    phase: number;
    assignedMemberId?: string | undefined;
}, {
    name: string;
    description: string;
    priority: "low" | "medium" | "high" | "critical";
    dependencies: string[];
    taskId: string;
    assignedRole: string;
    estimatedHours: number;
    phase: number;
    assignedMemberId?: string | undefined;
}>;
export declare const ImplementationPhaseSchema: z.ZodObject<{
    phase: z.ZodNumber;
    name: z.ZodString;
    description: z.ZodString;
    duration: z.ZodString;
    deliverables: z.ZodArray<z.ZodString, "many">;
    tasks: z.ZodArray<z.ZodObject<{
        taskId: z.ZodString;
        name: z.ZodString;
        description: z.ZodString;
        assignedRole: z.ZodString;
        assignedMemberId: z.ZodOptional<z.ZodString>;
        estimatedHours: z.ZodNumber;
        dependencies: z.ZodArray<z.ZodString, "many">;
        priority: z.ZodEnum<["critical", "high", "medium", "low"]>;
        phase: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        name: string;
        description: string;
        priority: "low" | "medium" | "high" | "critical";
        dependencies: string[];
        taskId: string;
        assignedRole: string;
        estimatedHours: number;
        phase: number;
        assignedMemberId?: string | undefined;
    }, {
        name: string;
        description: string;
        priority: "low" | "medium" | "high" | "critical";
        dependencies: string[];
        taskId: string;
        assignedRole: string;
        estimatedHours: number;
        phase: number;
        assignedMemberId?: string | undefined;
    }>, "many">;
    exitCriteria: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    name: string;
    description: string;
    phase: number;
    duration: string;
    deliverables: string[];
    tasks: {
        name: string;
        description: string;
        priority: "low" | "medium" | "high" | "critical";
        dependencies: string[];
        taskId: string;
        assignedRole: string;
        estimatedHours: number;
        phase: number;
        assignedMemberId?: string | undefined;
    }[];
    exitCriteria: string[];
}, {
    name: string;
    description: string;
    phase: number;
    duration: string;
    deliverables: string[];
    tasks: {
        name: string;
        description: string;
        priority: "low" | "medium" | "high" | "critical";
        dependencies: string[];
        taskId: string;
        assignedRole: string;
        estimatedHours: number;
        phase: number;
        assignedMemberId?: string | undefined;
    }[];
    exitCriteria: string[];
}>;
export declare const ArchitectureResultSchema: z.ZodObject<{
    architectureId: z.ZodString;
    projectId: z.ZodString;
    selectedTechStack: z.ZodObject<{
        optionId: z.ZodString;
        name: z.ZodString;
        rationale: z.ZodString;
        teamFitScore: z.ZodNumber;
        components: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        name: string;
        optionId: string;
        teamFitScore: number;
        rationale: string;
        components: string[];
    }, {
        name: string;
        optionId: string;
        teamFitScore: number;
        rationale: string;
        components: string[];
    }>;
    architectureOverview: z.ZodString;
    components: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        type: z.ZodEnum<["frontend", "backend", "ai_engine", "vector_db", "database", "cache", "background_service", "external_api", "other"]>;
        technology: z.ZodString;
        purpose: z.ZodString;
        responsibilities: z.ZodArray<z.ZodString, "many">;
        ports: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        dependencies: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        type: "other" | "frontend" | "backend" | "database" | "ai_engine" | "vector_db" | "cache" | "background_service" | "external_api";
        name: string;
        technology: string;
        purpose: string;
        responsibilities: string[];
        ports?: string[] | undefined;
        dependencies?: string[] | undefined;
    }, {
        type: "other" | "frontend" | "backend" | "database" | "ai_engine" | "vector_db" | "cache" | "background_service" | "external_api";
        name: string;
        technology: string;
        purpose: string;
        responsibilities: string[];
        ports?: string[] | undefined;
        dependencies?: string[] | undefined;
    }>, "many">;
    dataFlow: z.ZodArray<z.ZodObject<{
        step: z.ZodNumber;
        actor: z.ZodString;
        action: z.ZodString;
        system: z.ZodString;
        description: z.ZodString;
        dataPayload: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        description: string;
        step: number;
        action: string;
        actor: string;
        system: string;
        dataPayload?: string | undefined;
    }, {
        description: string;
        step: number;
        action: string;
        actor: string;
        system: string;
        dataPayload?: string | undefined;
    }>, "many">;
    databaseSchema: z.ZodArray<z.ZodObject<{
        collectionName: z.ZodString;
        purpose: z.ZodString;
        fields: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            type: z.ZodString;
            required: z.ZodOptional<z.ZodBoolean>;
            indexed: z.ZodOptional<z.ZodBoolean>;
            description: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            type: string;
            name: string;
            description?: string | undefined;
            required?: boolean | undefined;
            indexed?: boolean | undefined;
        }, {
            type: string;
            name: string;
            description?: string | undefined;
            required?: boolean | undefined;
            indexed?: boolean | undefined;
        }>, "many">;
        indexes: z.ZodOptional<z.ZodArray<z.ZodObject<{
            fields: z.ZodArray<z.ZodString, "many">;
            type: z.ZodOptional<z.ZodEnum<["unique", "compound", "text", "single"]>>;
            reason: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            fields: string[];
            type?: "unique" | "compound" | "text" | "single" | undefined;
            reason?: string | undefined;
        }, {
            fields: string[];
            type?: "unique" | "compound" | "text" | "single" | undefined;
            reason?: string | undefined;
        }>, "many">>;
        relationships: z.ZodOptional<z.ZodArray<z.ZodObject<{
            type: z.ZodEnum<["reference", "embedding", "embedded"]>;
            targetCollection: z.ZodString;
            description: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            type: "reference" | "embedding" | "embedded";
            description: string;
            targetCollection: string;
        }, {
            type: "reference" | "embedding" | "embedded";
            description: string;
            targetCollection: string;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        purpose: string;
        collectionName: string;
        fields: {
            type: string;
            name: string;
            description?: string | undefined;
            required?: boolean | undefined;
            indexed?: boolean | undefined;
        }[];
        indexes?: {
            fields: string[];
            type?: "unique" | "compound" | "text" | "single" | undefined;
            reason?: string | undefined;
        }[] | undefined;
        relationships?: {
            type: "reference" | "embedding" | "embedded";
            description: string;
            targetCollection: string;
        }[] | undefined;
    }, {
        purpose: string;
        collectionName: string;
        fields: {
            type: string;
            name: string;
            description?: string | undefined;
            required?: boolean | undefined;
            indexed?: boolean | undefined;
        }[];
        indexes?: {
            fields: string[];
            type?: "unique" | "compound" | "text" | "single" | undefined;
            reason?: string | undefined;
        }[] | undefined;
        relationships?: {
            type: "reference" | "embedding" | "embedded";
            description: string;
            targetCollection: string;
        }[] | undefined;
    }>, "many">;
    apiContracts: z.ZodArray<z.ZodObject<{
        method: z.ZodEnum<["GET", "POST", "PUT", "PATCH", "DELETE"]>;
        path: z.ZodString;
        description: z.ZodString;
        authRequired: z.ZodOptional<z.ZodBoolean>;
        requestBody: z.ZodOptional<z.ZodObject<{
            contentType: z.ZodString;
            schema: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            contentType: string;
            schema: string;
        }, {
            contentType: string;
            schema: string;
        }>>;
        responseSchema: z.ZodString;
        rateLimit: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        path: string;
        description: string;
        method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
        responseSchema: string;
        authRequired?: boolean | undefined;
        requestBody?: {
            contentType: string;
            schema: string;
        } | undefined;
        rateLimit?: string | undefined;
    }, {
        path: string;
        description: string;
        method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
        responseSchema: string;
        authRequired?: boolean | undefined;
        requestBody?: {
            contentType: string;
            schema: string;
        } | undefined;
        rateLimit?: string | undefined;
    }>, "many">;
    aiArchitecture: z.ZodObject<{
        llmModels: z.ZodArray<z.ZodObject<{
            provider: z.ZodString;
            model: z.ZodString;
            purpose: z.ZodString;
            temperature: z.ZodOptional<z.ZodNumber>;
            maxTokens: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            purpose: string;
            provider: string;
            model: string;
            temperature?: number | undefined;
            maxTokens?: number | undefined;
        }, {
            purpose: string;
            provider: string;
            model: string;
            temperature?: number | undefined;
            maxTokens?: number | undefined;
        }>, "many">;
        prompts: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            type: z.ZodEnum<["system", "user", "few_shot", "chain_of_thought"]>;
            purpose: z.ZodString;
            template: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            type: "user" | "system" | "few_shot" | "chain_of_thought";
            name: string;
            purpose: string;
            template?: string | undefined;
        }, {
            type: "user" | "system" | "few_shot" | "chain_of_thought";
            name: string;
            purpose: string;
            template?: string | undefined;
        }>, "many">;
        agentTools: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            type: z.ZodEnum<["search", "code_execution", "web_scraping", "api_call", "file_operation", "other"]>;
            purpose: z.ZodString;
            integration: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            type: "other" | "search" | "code_execution" | "web_scraping" | "api_call" | "file_operation";
            name: string;
            integration: string;
            purpose: string;
        }, {
            type: "other" | "search" | "code_execution" | "web_scraping" | "api_call" | "file_operation";
            name: string;
            integration: string;
            purpose: string;
        }>, "many">;
        executionPipeline: z.ZodArray<z.ZodObject<{
            stage: z.ZodNumber;
            name: z.ZodString;
            description: z.ZodString;
            inputs: z.ZodArray<z.ZodString, "many">;
            outputs: z.ZodArray<z.ZodString, "many">;
        }, "strip", z.ZodTypeAny, {
            name: string;
            description: string;
            inputs: string[];
            outputs: string[];
            stage: number;
        }, {
            name: string;
            description: string;
            inputs: string[];
            outputs: string[];
            stage: number;
        }>, "many">;
        fallbackPolicies: z.ZodArray<z.ZodObject<{
            scenario: z.ZodString;
            strategy: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            scenario: string;
            strategy: string;
        }, {
            scenario: string;
            strategy: string;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        llmModels: {
            purpose: string;
            provider: string;
            model: string;
            temperature?: number | undefined;
            maxTokens?: number | undefined;
        }[];
        prompts: {
            type: "user" | "system" | "few_shot" | "chain_of_thought";
            name: string;
            purpose: string;
            template?: string | undefined;
        }[];
        agentTools: {
            type: "other" | "search" | "code_execution" | "web_scraping" | "api_call" | "file_operation";
            name: string;
            integration: string;
            purpose: string;
        }[];
        executionPipeline: {
            name: string;
            description: string;
            inputs: string[];
            outputs: string[];
            stage: number;
        }[];
        fallbackPolicies: {
            scenario: string;
            strategy: string;
        }[];
    }, {
        llmModels: {
            purpose: string;
            provider: string;
            model: string;
            temperature?: number | undefined;
            maxTokens?: number | undefined;
        }[];
        prompts: {
            type: "user" | "system" | "few_shot" | "chain_of_thought";
            name: string;
            purpose: string;
            template?: string | undefined;
        }[];
        agentTools: {
            type: "other" | "search" | "code_execution" | "web_scraping" | "api_call" | "file_operation";
            name: string;
            integration: string;
            purpose: string;
        }[];
        executionPipeline: {
            name: string;
            description: string;
            inputs: string[];
            outputs: string[];
            stage: number;
        }[];
        fallbackPolicies: {
            scenario: string;
            strategy: string;
        }[];
    }>;
    ragArchitecture: z.ZodOptional<z.ZodObject<{
        vectorDbProvider: z.ZodString;
        embeddingModel: z.ZodString;
        chunkSize: z.ZodNumber;
        chunkOverlap: z.ZodNumber;
        retrievalTopK: z.ZodNumber;
        searchFilter: z.ZodOptional<z.ZodString>;
        indexingStrategy: z.ZodOptional<z.ZodString>;
        reranker: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        vectorDbProvider: string;
        embeddingModel: string;
        chunkSize: number;
        chunkOverlap: number;
        retrievalTopK: number;
        searchFilter?: string | undefined;
        indexingStrategy?: string | undefined;
        reranker?: string | undefined;
    }, {
        vectorDbProvider: string;
        embeddingModel: string;
        chunkSize: number;
        chunkOverlap: number;
        retrievalTopK: number;
        searchFilter?: string | undefined;
        indexingStrategy?: string | undefined;
        reranker?: string | undefined;
    }>>;
    externalServices: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        purpose: z.ZodString;
        authMethod: z.ZodString;
        rateLimit: z.ZodOptional<z.ZodString>;
        fallbackStrategy: z.ZodOptional<z.ZodString>;
        costTier: z.ZodOptional<z.ZodEnum<["free", "low", "medium", "high"]>>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        purpose: string;
        authMethod: string;
        rateLimit?: string | undefined;
        fallbackStrategy?: string | undefined;
        costTier?: "low" | "medium" | "high" | "free" | undefined;
    }, {
        name: string;
        purpose: string;
        authMethod: string;
        rateLimit?: string | undefined;
        fallbackStrategy?: string | undefined;
        costTier?: "low" | "medium" | "high" | "free" | undefined;
    }>, "many">;
    risks: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        description: z.ZodString;
        likelihood: z.ZodEnum<["low", "medium", "high"]>;
        impact: z.ZodEnum<["low", "medium", "high"]>;
        severity: z.ZodEnum<["low", "medium", "high", "critical"]>;
        mitigationStrategy: z.ZodString;
        affectedComponents: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        description: string;
        severity: "low" | "medium" | "high" | "critical";
        id: string;
        impact: "low" | "medium" | "high";
        mitigationStrategy: string;
        likelihood: "low" | "medium" | "high";
        affectedComponents: string[];
    }, {
        description: string;
        severity: "low" | "medium" | "high" | "critical";
        id: string;
        impact: "low" | "medium" | "high";
        mitigationStrategy: string;
        likelihood: "low" | "medium" | "high";
        affectedComponents: string[];
    }>, "many">;
    implementationPlan: z.ZodArray<z.ZodObject<{
        phase: z.ZodNumber;
        name: z.ZodString;
        description: z.ZodString;
        duration: z.ZodString;
        deliverables: z.ZodArray<z.ZodString, "many">;
        tasks: z.ZodArray<z.ZodObject<{
            taskId: z.ZodString;
            name: z.ZodString;
            description: z.ZodString;
            assignedRole: z.ZodString;
            assignedMemberId: z.ZodOptional<z.ZodString>;
            estimatedHours: z.ZodNumber;
            dependencies: z.ZodArray<z.ZodString, "many">;
            priority: z.ZodEnum<["critical", "high", "medium", "low"]>;
            phase: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            name: string;
            description: string;
            priority: "low" | "medium" | "high" | "critical";
            dependencies: string[];
            taskId: string;
            assignedRole: string;
            estimatedHours: number;
            phase: number;
            assignedMemberId?: string | undefined;
        }, {
            name: string;
            description: string;
            priority: "low" | "medium" | "high" | "critical";
            dependencies: string[];
            taskId: string;
            assignedRole: string;
            estimatedHours: number;
            phase: number;
            assignedMemberId?: string | undefined;
        }>, "many">;
        exitCriteria: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        name: string;
        description: string;
        phase: number;
        duration: string;
        deliverables: string[];
        tasks: {
            name: string;
            description: string;
            priority: "low" | "medium" | "high" | "critical";
            dependencies: string[];
            taskId: string;
            assignedRole: string;
            estimatedHours: number;
            phase: number;
            assignedMemberId?: string | undefined;
        }[];
        exitCriteria: string[];
    }, {
        name: string;
        description: string;
        phase: number;
        duration: string;
        deliverables: string[];
        tasks: {
            name: string;
            description: string;
            priority: "low" | "medium" | "high" | "critical";
            dependencies: string[];
            taskId: string;
            assignedRole: string;
            estimatedHours: number;
            phase: number;
            assignedMemberId?: string | undefined;
        }[];
        exitCriteria: string[];
    }>, "many">;
    hackathonTimeline: z.ZodObject<{
        totalHours: z.ZodNumber;
        phases: z.ZodArray<z.ZodObject<{
            phase: z.ZodNumber;
            name: z.ZodString;
            hours: z.ZodNumber;
            startHour: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            name: string;
            phase: number;
            hours: number;
            startHour: number;
        }, {
            name: string;
            phase: number;
            hours: number;
            startHour: number;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        totalHours: number;
        phases: {
            name: string;
            phase: number;
            hours: number;
            startHour: number;
        }[];
    }, {
        totalHours: number;
        phases: {
            name: string;
            phase: number;
            hours: number;
            startHour: number;
        }[];
    }>;
    confidence: z.ZodNumber;
    estimatedDemoReadiness: z.ZodString;
}, "strip", z.ZodTypeAny, {
    confidence: number;
    architectureOverview: string;
    selectedTechStack: {
        name: string;
        optionId: string;
        teamFitScore: number;
        rationale: string;
        components: string[];
    };
    components: {
        type: "other" | "frontend" | "backend" | "database" | "ai_engine" | "vector_db" | "cache" | "background_service" | "external_api";
        name: string;
        technology: string;
        purpose: string;
        responsibilities: string[];
        ports?: string[] | undefined;
        dependencies?: string[] | undefined;
    }[];
    architectureId: string;
    projectId: string;
    dataFlow: {
        description: string;
        step: number;
        action: string;
        actor: string;
        system: string;
        dataPayload?: string | undefined;
    }[];
    databaseSchema: {
        purpose: string;
        collectionName: string;
        fields: {
            type: string;
            name: string;
            description?: string | undefined;
            required?: boolean | undefined;
            indexed?: boolean | undefined;
        }[];
        indexes?: {
            fields: string[];
            type?: "unique" | "compound" | "text" | "single" | undefined;
            reason?: string | undefined;
        }[] | undefined;
        relationships?: {
            type: "reference" | "embedding" | "embedded";
            description: string;
            targetCollection: string;
        }[] | undefined;
    }[];
    apiContracts: {
        path: string;
        description: string;
        method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
        responseSchema: string;
        authRequired?: boolean | undefined;
        requestBody?: {
            contentType: string;
            schema: string;
        } | undefined;
        rateLimit?: string | undefined;
    }[];
    aiArchitecture: {
        llmModels: {
            purpose: string;
            provider: string;
            model: string;
            temperature?: number | undefined;
            maxTokens?: number | undefined;
        }[];
        prompts: {
            type: "user" | "system" | "few_shot" | "chain_of_thought";
            name: string;
            purpose: string;
            template?: string | undefined;
        }[];
        agentTools: {
            type: "other" | "search" | "code_execution" | "web_scraping" | "api_call" | "file_operation";
            name: string;
            integration: string;
            purpose: string;
        }[];
        executionPipeline: {
            name: string;
            description: string;
            inputs: string[];
            outputs: string[];
            stage: number;
        }[];
        fallbackPolicies: {
            scenario: string;
            strategy: string;
        }[];
    };
    externalServices: {
        name: string;
        purpose: string;
        authMethod: string;
        rateLimit?: string | undefined;
        fallbackStrategy?: string | undefined;
        costTier?: "low" | "medium" | "high" | "free" | undefined;
    }[];
    risks: {
        description: string;
        severity: "low" | "medium" | "high" | "critical";
        id: string;
        impact: "low" | "medium" | "high";
        mitigationStrategy: string;
        likelihood: "low" | "medium" | "high";
        affectedComponents: string[];
    }[];
    implementationPlan: {
        name: string;
        description: string;
        phase: number;
        duration: string;
        deliverables: string[];
        tasks: {
            name: string;
            description: string;
            priority: "low" | "medium" | "high" | "critical";
            dependencies: string[];
            taskId: string;
            assignedRole: string;
            estimatedHours: number;
            phase: number;
            assignedMemberId?: string | undefined;
        }[];
        exitCriteria: string[];
    }[];
    hackathonTimeline: {
        totalHours: number;
        phases: {
            name: string;
            phase: number;
            hours: number;
            startHour: number;
        }[];
    };
    estimatedDemoReadiness: string;
    ragArchitecture?: {
        vectorDbProvider: string;
        embeddingModel: string;
        chunkSize: number;
        chunkOverlap: number;
        retrievalTopK: number;
        searchFilter?: string | undefined;
        indexingStrategy?: string | undefined;
        reranker?: string | undefined;
    } | undefined;
}, {
    confidence: number;
    architectureOverview: string;
    selectedTechStack: {
        name: string;
        optionId: string;
        teamFitScore: number;
        rationale: string;
        components: string[];
    };
    components: {
        type: "other" | "frontend" | "backend" | "database" | "ai_engine" | "vector_db" | "cache" | "background_service" | "external_api";
        name: string;
        technology: string;
        purpose: string;
        responsibilities: string[];
        ports?: string[] | undefined;
        dependencies?: string[] | undefined;
    }[];
    architectureId: string;
    projectId: string;
    dataFlow: {
        description: string;
        step: number;
        action: string;
        actor: string;
        system: string;
        dataPayload?: string | undefined;
    }[];
    databaseSchema: {
        purpose: string;
        collectionName: string;
        fields: {
            type: string;
            name: string;
            description?: string | undefined;
            required?: boolean | undefined;
            indexed?: boolean | undefined;
        }[];
        indexes?: {
            fields: string[];
            type?: "unique" | "compound" | "text" | "single" | undefined;
            reason?: string | undefined;
        }[] | undefined;
        relationships?: {
            type: "reference" | "embedding" | "embedded";
            description: string;
            targetCollection: string;
        }[] | undefined;
    }[];
    apiContracts: {
        path: string;
        description: string;
        method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
        responseSchema: string;
        authRequired?: boolean | undefined;
        requestBody?: {
            contentType: string;
            schema: string;
        } | undefined;
        rateLimit?: string | undefined;
    }[];
    aiArchitecture: {
        llmModels: {
            purpose: string;
            provider: string;
            model: string;
            temperature?: number | undefined;
            maxTokens?: number | undefined;
        }[];
        prompts: {
            type: "user" | "system" | "few_shot" | "chain_of_thought";
            name: string;
            purpose: string;
            template?: string | undefined;
        }[];
        agentTools: {
            type: "other" | "search" | "code_execution" | "web_scraping" | "api_call" | "file_operation";
            name: string;
            integration: string;
            purpose: string;
        }[];
        executionPipeline: {
            name: string;
            description: string;
            inputs: string[];
            outputs: string[];
            stage: number;
        }[];
        fallbackPolicies: {
            scenario: string;
            strategy: string;
        }[];
    };
    externalServices: {
        name: string;
        purpose: string;
        authMethod: string;
        rateLimit?: string | undefined;
        fallbackStrategy?: string | undefined;
        costTier?: "low" | "medium" | "high" | "free" | undefined;
    }[];
    risks: {
        description: string;
        severity: "low" | "medium" | "high" | "critical";
        id: string;
        impact: "low" | "medium" | "high";
        mitigationStrategy: string;
        likelihood: "low" | "medium" | "high";
        affectedComponents: string[];
    }[];
    implementationPlan: {
        name: string;
        description: string;
        phase: number;
        duration: string;
        deliverables: string[];
        tasks: {
            name: string;
            description: string;
            priority: "low" | "medium" | "high" | "critical";
            dependencies: string[];
            taskId: string;
            assignedRole: string;
            estimatedHours: number;
            phase: number;
            assignedMemberId?: string | undefined;
        }[];
        exitCriteria: string[];
    }[];
    hackathonTimeline: {
        totalHours: number;
        phases: {
            name: string;
            phase: number;
            hours: number;
            startHour: number;
        }[];
    };
    estimatedDemoReadiness: string;
    ragArchitecture?: {
        vectorDbProvider: string;
        embeddingModel: string;
        chunkSize: number;
        chunkOverlap: number;
        retrievalTopK: number;
        searchFilter?: string | undefined;
        indexingStrategy?: string | undefined;
        reranker?: string | undefined;
    } | undefined;
}>;
export type ArchitectureResult = z.infer<typeof ArchitectureResultSchema>;
export type TechChoice = z.infer<typeof TechChoiceSchema>;
export type Component = z.infer<typeof ComponentSchema>;
export type DataFlowStep = z.infer<typeof DataFlowStepSchema>;
export type DatabaseModel = z.infer<typeof DatabaseModelSchema>;
export type ApiContract = z.infer<typeof ApiContractSchema>;
export type AiArchitecture = z.infer<typeof AiArchitectureSchema>;
export type RagArchitecture = z.infer<typeof RagArchitectureSchema>;
export type ExternalService = z.infer<typeof ExternalServiceSchema>;
export type TechnicalRisk = z.infer<typeof TechnicalRiskSchema>;
export type TaskDependency = z.infer<typeof TaskDependencySchema>;
export type ImplementationPhase = z.infer<typeof ImplementationPhaseSchema>;
export declare const JudgeResultSchema: z.ZodRecord<z.ZodString, z.ZodUnknown>;
export type JudgeResult = z.infer<typeof JudgeResultSchema>;
export declare const BuildResultSchema: z.ZodRecord<z.ZodString, z.ZodUnknown>;
export type BuildResult = z.infer<typeof BuildResultSchema>;
export declare const ImprovementIterationSchema: z.ZodObject<{
    version: z.ZodNumber;
    score: z.ZodNumber;
    changedBy: z.ZodArray<z.ZodString, "many">;
    weaknessesAddressed: z.ZodArray<z.ZodString, "many">;
    summary: z.ZodString;
    timestamp: z.ZodString;
}, "strip", z.ZodTypeAny, {
    summary: string;
    score: number;
    version: number;
    changedBy: string[];
    weaknessesAddressed: string[];
    timestamp: string;
}, {
    summary: string;
    score: number;
    version: number;
    changedBy: string[];
    weaknessesAddressed: string[];
    timestamp: string;
}>;
export declare const WorkflowErrorSchema: z.ZodObject<{
    agent: z.ZodString;
    node: z.ZodString;
    error: z.ZodString;
    timestamp: z.ZodString;
    recoverable: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    error: string;
    timestamp: string;
    agent: string;
    node: string;
    recoverable: boolean;
}, {
    error: string;
    timestamp: string;
    agent: string;
    node: string;
    recoverable: boolean;
}>;
export declare const UsageMetricsSchema: z.ZodObject<{
    geminiCalls: z.ZodDefault<z.ZodNumber>;
    geminiSearchCalls: z.ZodDefault<z.ZodNumber>;
    deepseekCalls: z.ZodDefault<z.ZodNumber>;
    tavilyCalls: z.ZodDefault<z.ZodNumber>;
    githubCalls: z.ZodDefault<z.ZodNumber>;
    llmTokens: z.ZodDefault<z.ZodNumber>;
    cacheHits: z.ZodDefault<z.ZodNumber>;
    cacheMisses: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    geminiSearchCalls: number;
    geminiCalls: number;
    deepseekCalls: number;
    tavilyCalls: number;
    githubCalls: number;
    llmTokens: number;
    cacheHits: number;
    cacheMisses: number;
}, {
    geminiSearchCalls?: number | undefined;
    geminiCalls?: number | undefined;
    deepseekCalls?: number | undefined;
    tavilyCalls?: number | undefined;
    githubCalls?: number | undefined;
    llmTokens?: number | undefined;
    cacheHits?: number | undefined;
    cacheMisses?: number | undefined;
}>;
export declare const HackathonStateSchema: z.ZodObject<{
    projectId: z.ZodString;
    input: z.ZodObject<{
        problemStatement: z.ZodString;
        resumes: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
        githubLinks: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
            githubProfileUrl: z.ZodString;
            username: z.ZodString;
            role: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            githubProfileUrl: string;
            username: string;
            role?: string | undefined;
        }, {
            githubProfileUrl: string;
            username: string;
            role?: string | undefined;
        }>, "many">>>;
        hackathon: z.ZodOptional<z.ZodObject<{
            name: z.ZodOptional<z.ZodString>;
            description: z.ZodOptional<z.ZodString>;
            durationHours: z.ZodOptional<z.ZodNumber>;
            judgingCriteria: z.ZodOptional<z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                weight: z.ZodOptional<z.ZodNumber>;
                description: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                name: string;
                description?: string | undefined;
                weight?: number | undefined;
            }, {
                name: string;
                description?: string | undefined;
                weight?: number | undefined;
            }>, "many">>;
            rules: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            restrictions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            allowedTechnologies: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            forbiddenTechnologies: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            name?: string | undefined;
            description?: string | undefined;
            durationHours?: number | undefined;
            judgingCriteria?: {
                name: string;
                description?: string | undefined;
                weight?: number | undefined;
            }[] | undefined;
            rules?: string[] | undefined;
            restrictions?: string[] | undefined;
            allowedTechnologies?: string[] | undefined;
            forbiddenTechnologies?: string[] | undefined;
        }, {
            name?: string | undefined;
            description?: string | undefined;
            durationHours?: number | undefined;
            judgingCriteria?: {
                name: string;
                description?: string | undefined;
                weight?: number | undefined;
            }[] | undefined;
            rules?: string[] | undefined;
            restrictions?: string[] | undefined;
            allowedTechnologies?: string[] | undefined;
            forbiddenTechnologies?: string[] | undefined;
        }>>;
        userConstraints: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        teamSize: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        problemStatement: string;
        resumes: string[];
        githubLinks: {
            githubProfileUrl: string;
            username: string;
            role?: string | undefined;
        }[];
        hackathon?: {
            name?: string | undefined;
            description?: string | undefined;
            durationHours?: number | undefined;
            judgingCriteria?: {
                name: string;
                description?: string | undefined;
                weight?: number | undefined;
            }[] | undefined;
            rules?: string[] | undefined;
            restrictions?: string[] | undefined;
            allowedTechnologies?: string[] | undefined;
            forbiddenTechnologies?: string[] | undefined;
        } | undefined;
        userConstraints?: string[] | undefined;
        teamSize?: number | undefined;
    }, {
        problemStatement: string;
        resumes?: string[] | undefined;
        githubLinks?: {
            githubProfileUrl: string;
            username: string;
            role?: string | undefined;
        }[] | undefined;
        hackathon?: {
            name?: string | undefined;
            description?: string | undefined;
            durationHours?: number | undefined;
            judgingCriteria?: {
                name: string;
                description?: string | undefined;
                weight?: number | undefined;
            }[] | undefined;
            rules?: string[] | undefined;
            restrictions?: string[] | undefined;
            allowedTechnologies?: string[] | undefined;
            forbiddenTechnologies?: string[] | undefined;
        } | undefined;
        userConstraints?: string[] | undefined;
        teamSize?: number | undefined;
    }>;
    problemAnalysis: z.ZodDefault<z.ZodNullable<z.ZodObject<{
        coreProblem: z.ZodString;
        problemSummary: z.ZodString;
        targetUsers: z.ZodArray<z.ZodObject<{
            role: z.ZodString;
            context: z.ZodString;
            painLevel: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            evidence: z.ZodEnum<["explicit", "inferred"]>;
            reason: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            role: string;
            context: string;
            evidence: "explicit" | "inferred";
            reason: string;
            painLevel?: number | null | undefined;
        }, {
            role: string;
            context: string;
            evidence: "explicit" | "inferred";
            reason: string;
            painLevel?: number | null | undefined;
        }>, "many">;
        painPoints: z.ZodArray<z.ZodObject<{
            description: z.ZodString;
            severity: z.ZodEnum<["low", "medium", "high"]>;
            evidence: z.ZodEnum<["explicit", "inferred"]>;
            reason: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            description: string;
            evidence: "explicit" | "inferred";
            reason: string;
            severity: "low" | "medium" | "high";
        }, {
            description: string;
            evidence: "explicit" | "inferred";
            reason: string;
            severity: "low" | "medium" | "high";
        }>, "many">;
        desiredOutcomes: z.ZodArray<z.ZodObject<{
            description: z.ZodString;
            priority: z.ZodEnum<["high", "medium", "low"]>;
            measurable: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
        }, "strip", z.ZodTypeAny, {
            description: string;
            priority: "low" | "medium" | "high";
            measurable?: boolean | null | undefined;
        }, {
            description: string;
            priority: "low" | "medium" | "high";
            measurable?: boolean | null | undefined;
        }>, "many">;
        explicitRequirements: z.ZodArray<z.ZodObject<{
            description: z.ZodString;
            type: z.ZodEnum<["functional", "non_functional"]>;
            priority: z.ZodEnum<["must", "should", "could"]>;
            evidence: z.ZodEnum<["explicit", "inferred"]>;
            reason: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            type: "functional" | "non_functional";
            description: string;
            evidence: "explicit" | "inferred";
            reason: string;
            priority: "must" | "should" | "could";
        }, {
            type: "functional" | "non_functional";
            description: string;
            evidence: "explicit" | "inferred";
            reason: string;
            priority: "must" | "should" | "could";
        }>, "many">;
        inferredRequirements: z.ZodArray<z.ZodObject<{
            description: z.ZodString;
            type: z.ZodEnum<["functional", "non_functional"]>;
            priority: z.ZodEnum<["must", "should", "could"]>;
            evidence: z.ZodEnum<["explicit", "inferred"]>;
            reason: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            type: "functional" | "non_functional";
            description: string;
            evidence: "explicit" | "inferred";
            reason: string;
            priority: "must" | "should" | "could";
        }, {
            type: "functional" | "non_functional";
            description: string;
            evidence: "explicit" | "inferred";
            reason: string;
            priority: "must" | "should" | "could";
        }>, "many">;
        constraints: z.ZodArray<z.ZodObject<{
            description: z.ZodString;
            category: z.ZodEnum<["time", "budget", "technical", "data", "hardware", "platform", "user", "regulatory", "hackathon", "other"]>;
            severity: z.ZodEnum<["low", "medium", "high"]>;
            evidence: z.ZodEnum<["explicit", "inferred"]>;
        }, "strip", z.ZodTypeAny, {
            description: string;
            evidence: "explicit" | "inferred";
            severity: "low" | "medium" | "high";
            category: "hackathon" | "time" | "budget" | "technical" | "data" | "hardware" | "platform" | "user" | "regulatory" | "other";
        }, {
            description: string;
            evidence: "explicit" | "inferred";
            severity: "low" | "medium" | "high";
            category: "hackathon" | "time" | "budget" | "technical" | "data" | "hardware" | "platform" | "user" | "regulatory" | "other";
        }>, "many">;
        domainKeywords: z.ZodArray<z.ZodString, "many">;
        synonyms: z.ZodArray<z.ZodString, "many">;
        relatedConcepts: z.ZodArray<z.ZodString, "many">;
        mechanisms: z.ZodArray<z.ZodString, "many">;
        assumptions: z.ZodArray<z.ZodObject<{
            statement: z.ZodString;
            confidence: z.ZodNumber;
            reason: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            reason: string;
            statement: string;
            confidence: number;
        }, {
            reason: string;
            statement: string;
            confidence: number;
        }>, "many">;
        ambiguities: z.ZodArray<z.ZodObject<{
            issue: z.ZodString;
            whyItMatters: z.ZodString;
            possibleInterpretations: z.ZodArray<z.ZodString, "many">;
            severity: z.ZodEnum<["low", "medium", "high"]>;
        }, "strip", z.ZodTypeAny, {
            severity: "low" | "medium" | "high";
            issue: string;
            whyItMatters: string;
            possibleInterpretations: string[];
        }, {
            severity: "low" | "medium" | "high";
            issue: string;
            whyItMatters: string;
            possibleInterpretations: string[];
        }>, "many">;
        researchQuestions: z.ZodArray<z.ZodObject<{
            question: z.ZodString;
            category: z.ZodEnum<["existing_solution", "technology", "user", "workflow", "market", "limitation", "hackathon", "open_source", "research", "technical_approaches", "other"]>;
            priority: z.ZodEnum<["high", "medium", "low"]>;
        }, "strip", z.ZodTypeAny, {
            priority: "low" | "medium" | "high";
            category: "hackathon" | "user" | "other" | "existing_solution" | "technology" | "workflow" | "market" | "limitation" | "open_source" | "research" | "technical_approaches";
            question: string;
        }, {
            priority: "low" | "medium" | "high";
            category: "hackathon" | "user" | "other" | "existing_solution" | "technology" | "workflow" | "market" | "limitation" | "open_source" | "research" | "technical_approaches";
            question: string;
        }>, "many">;
        researchDimensions: z.ZodArray<z.ZodObject<{
            name: z.ZodEnum<["commercial_products", "startups", "github", "open_source", "hackathons", "research", "blogs", "technical_approaches", "adjacent_solutions"]>;
            reason: z.ZodString;
            priority: z.ZodEnum<["high", "medium", "low"]>;
            targetQueries: z.ZodArray<z.ZodString, "many">;
        }, "strip", z.ZodTypeAny, {
            name: "open_source" | "research" | "technical_approaches" | "commercial_products" | "startups" | "github" | "hackathons" | "blogs" | "adjacent_solutions";
            reason: string;
            priority: "low" | "medium" | "high";
            targetQueries: string[];
        }, {
            name: "open_source" | "research" | "technical_approaches" | "commercial_products" | "startups" | "github" | "hackathons" | "blogs" | "adjacent_solutions";
            reason: string;
            priority: "low" | "medium" | "high";
            targetQueries: string[];
        }>, "many">;
        searchConcepts: z.ZodArray<z.ZodObject<{
            concept: z.ZodString;
            category: z.ZodEnum<["problem", "user", "domain", "mechanism", "technology", "product", "startup", "hackathon", "open_source", "research"]>;
            priority: z.ZodEnum<["high", "medium", "low"]>;
            searchQueries: z.ZodArray<z.ZodString, "many">;
        }, "strip", z.ZodTypeAny, {
            priority: "low" | "medium" | "high";
            category: "hackathon" | "user" | "technology" | "open_source" | "research" | "problem" | "domain" | "mechanism" | "product" | "startup";
            concept: string;
            searchQueries: string[];
        }, {
            priority: "low" | "medium" | "high";
            category: "hackathon" | "user" | "technology" | "open_source" | "research" | "problem" | "domain" | "mechanism" | "product" | "startup";
            concept: string;
            searchQueries: string[];
        }>, "many">;
        successCriteria: z.ZodArray<z.ZodString, "many">;
        hackathonConsiderations: z.ZodArray<z.ZodString, "many">;
        analysisConfidence: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        coreProblem: string;
        problemSummary: string;
        targetUsers: {
            role: string;
            context: string;
            evidence: "explicit" | "inferred";
            reason: string;
            painLevel?: number | null | undefined;
        }[];
        painPoints: {
            description: string;
            evidence: "explicit" | "inferred";
            reason: string;
            severity: "low" | "medium" | "high";
        }[];
        desiredOutcomes: {
            description: string;
            priority: "low" | "medium" | "high";
            measurable?: boolean | null | undefined;
        }[];
        explicitRequirements: {
            type: "functional" | "non_functional";
            description: string;
            evidence: "explicit" | "inferred";
            reason: string;
            priority: "must" | "should" | "could";
        }[];
        inferredRequirements: {
            type: "functional" | "non_functional";
            description: string;
            evidence: "explicit" | "inferred";
            reason: string;
            priority: "must" | "should" | "could";
        }[];
        constraints: {
            description: string;
            evidence: "explicit" | "inferred";
            severity: "low" | "medium" | "high";
            category: "hackathon" | "time" | "budget" | "technical" | "data" | "hardware" | "platform" | "user" | "regulatory" | "other";
        }[];
        domainKeywords: string[];
        synonyms: string[];
        relatedConcepts: string[];
        mechanisms: string[];
        assumptions: {
            reason: string;
            statement: string;
            confidence: number;
        }[];
        ambiguities: {
            severity: "low" | "medium" | "high";
            issue: string;
            whyItMatters: string;
            possibleInterpretations: string[];
        }[];
        researchQuestions: {
            priority: "low" | "medium" | "high";
            category: "hackathon" | "user" | "other" | "existing_solution" | "technology" | "workflow" | "market" | "limitation" | "open_source" | "research" | "technical_approaches";
            question: string;
        }[];
        researchDimensions: {
            name: "open_source" | "research" | "technical_approaches" | "commercial_products" | "startups" | "github" | "hackathons" | "blogs" | "adjacent_solutions";
            reason: string;
            priority: "low" | "medium" | "high";
            targetQueries: string[];
        }[];
        searchConcepts: {
            priority: "low" | "medium" | "high";
            category: "hackathon" | "user" | "technology" | "open_source" | "research" | "problem" | "domain" | "mechanism" | "product" | "startup";
            concept: string;
            searchQueries: string[];
        }[];
        successCriteria: string[];
        hackathonConsiderations: string[];
        analysisConfidence: number;
    }, {
        coreProblem: string;
        problemSummary: string;
        targetUsers: {
            role: string;
            context: string;
            evidence: "explicit" | "inferred";
            reason: string;
            painLevel?: number | null | undefined;
        }[];
        painPoints: {
            description: string;
            evidence: "explicit" | "inferred";
            reason: string;
            severity: "low" | "medium" | "high";
        }[];
        desiredOutcomes: {
            description: string;
            priority: "low" | "medium" | "high";
            measurable?: boolean | null | undefined;
        }[];
        explicitRequirements: {
            type: "functional" | "non_functional";
            description: string;
            evidence: "explicit" | "inferred";
            reason: string;
            priority: "must" | "should" | "could";
        }[];
        inferredRequirements: {
            type: "functional" | "non_functional";
            description: string;
            evidence: "explicit" | "inferred";
            reason: string;
            priority: "must" | "should" | "could";
        }[];
        constraints: {
            description: string;
            evidence: "explicit" | "inferred";
            severity: "low" | "medium" | "high";
            category: "hackathon" | "time" | "budget" | "technical" | "data" | "hardware" | "platform" | "user" | "regulatory" | "other";
        }[];
        domainKeywords: string[];
        synonyms: string[];
        relatedConcepts: string[];
        mechanisms: string[];
        assumptions: {
            reason: string;
            statement: string;
            confidence: number;
        }[];
        ambiguities: {
            severity: "low" | "medium" | "high";
            issue: string;
            whyItMatters: string;
            possibleInterpretations: string[];
        }[];
        researchQuestions: {
            priority: "low" | "medium" | "high";
            category: "hackathon" | "user" | "other" | "existing_solution" | "technology" | "workflow" | "market" | "limitation" | "open_source" | "research" | "technical_approaches";
            question: string;
        }[];
        researchDimensions: {
            name: "open_source" | "research" | "technical_approaches" | "commercial_products" | "startups" | "github" | "hackathons" | "blogs" | "adjacent_solutions";
            reason: string;
            priority: "low" | "medium" | "high";
            targetQueries: string[];
        }[];
        searchConcepts: {
            priority: "low" | "medium" | "high";
            category: "hackathon" | "user" | "technology" | "open_source" | "research" | "problem" | "domain" | "mechanism" | "product" | "startup";
            concept: string;
            searchQueries: string[];
        }[];
        successCriteria: string[];
        hackathonConsiderations: string[];
        analysisConfidence: number;
    }>>>;
    research: z.ZodDefault<z.ZodNullable<z.ZodObject<{
        researchId: z.ZodString;
        summary: z.ZodObject<{
            queriesRun: z.ZodNumber;
            geminiSearchCalls: z.ZodNumber;
            tavilySearchCalls: z.ZodNumber;
            githubSearchCalls: z.ZodNumber;
            sourcesFound: z.ZodNumber;
            uniqueSources: z.ZodNumber;
            candidateEntities: z.ZodNumber;
            relevantSolutions: z.ZodNumber;
            directSolutions: z.ZodNumber;
            adjacentSolutions: z.ZodNumber;
            technicalApproaches: z.ZodNumber;
            enrichedSolutions: z.ZodNumber;
            discoveryRounds: z.ZodNumber;
            enrichmentRounds: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            queriesRun: number;
            geminiSearchCalls: number;
            tavilySearchCalls: number;
            githubSearchCalls: number;
            sourcesFound: number;
            uniqueSources: number;
            candidateEntities: number;
            relevantSolutions: number;
            directSolutions: number;
            adjacentSolutions: number;
            technicalApproaches: number;
            enrichedSolutions: number;
            discoveryRounds: number;
            enrichmentRounds: number;
        }, {
            queriesRun: number;
            geminiSearchCalls: number;
            tavilySearchCalls: number;
            githubSearchCalls: number;
            sourcesFound: number;
            uniqueSources: number;
            candidateEntities: number;
            relevantSolutions: number;
            directSolutions: number;
            adjacentSolutions: number;
            technicalApproaches: number;
            enrichedSolutions: number;
            discoveryRounds: number;
            enrichmentRounds: number;
        }>;
        sources: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            title: z.ZodString;
            url: z.ZodString;
            canonicalUrl: z.ZodString;
            domain: z.ZodString;
            sourceType: z.ZodEnum<["web", "product", "startup", "github", "open_source", "hackathon", "research", "blog", "other"]>;
            discoveredBy: z.ZodArray<z.ZodEnum<["gemini", "tavily", "github"]>, "many">;
            searchQueryIds: z.ZodArray<z.ZodString, "many">;
            snippet: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            content: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            publishedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            retrievedAt: z.ZodString;
            relevanceScore: z.ZodNumber;
            authorityScore: z.ZodNumber;
            extractionStatus: z.ZodEnum<["success", "partial", "failed"]>;
            metadata: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, "strip", z.ZodTypeAny, {
            domain: string;
            id: string;
            title: string;
            url: string;
            canonicalUrl: string;
            sourceType: "hackathon" | "other" | "open_source" | "research" | "github" | "product" | "startup" | "web" | "blog";
            discoveredBy: ("github" | "gemini" | "tavily")[];
            searchQueryIds: string[];
            retrievedAt: string;
            relevanceScore: number;
            authorityScore: number;
            extractionStatus: "success" | "partial" | "failed";
            metadata: Record<string, unknown>;
            snippet?: string | null | undefined;
            content?: string | null | undefined;
            publishedAt?: string | null | undefined;
        }, {
            domain: string;
            id: string;
            title: string;
            url: string;
            canonicalUrl: string;
            sourceType: "hackathon" | "other" | "open_source" | "research" | "github" | "product" | "startup" | "web" | "blog";
            discoveredBy: ("github" | "gemini" | "tavily")[];
            searchQueryIds: string[];
            retrievedAt: string;
            relevanceScore: number;
            authorityScore: number;
            extractionStatus: "success" | "partial" | "failed";
            snippet?: string | null | undefined;
            content?: string | null | undefined;
            publishedAt?: string | null | undefined;
            metadata?: Record<string, unknown> | undefined;
        }>, "many">;
        discoveredSolutions: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            description: z.ZodString;
            problemSolved: z.ZodString;
            targetUsers: z.ZodArray<z.ZodString, "many">;
            approach: z.ZodString;
            features: z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                description: z.ZodString;
                category: z.ZodEnum<["core", "ai", "automation", "workflow", "analytics", "collaboration", "integration", "other"]>;
                sourceIds: z.ZodArray<z.ZodString, "many">;
            }, "strip", z.ZodTypeAny, {
                name: string;
                description: string;
                category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "collaboration" | "integration";
                sourceIds: string[];
            }, {
                name: string;
                description: string;
                category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "collaboration" | "integration";
                sourceIds: string[];
            }>, "many">;
            workflow: z.ZodArray<z.ZodObject<{
                step: z.ZodNumber;
                action: z.ZodString;
                description: z.ZodString;
                sourceIds: z.ZodArray<z.ZodString, "many">;
            }, "strip", z.ZodTypeAny, {
                description: string;
                sourceIds: string[];
                step: number;
                action: string;
            }, {
                description: string;
                sourceIds: string[];
                step: number;
                action: string;
            }>, "many">;
            inputs: z.ZodArray<z.ZodString, "many">;
            outputs: z.ZodArray<z.ZodString, "many">;
            technologies: z.ZodArray<z.ZodString, "many">;
            limitations: z.ZodArray<z.ZodString, "many">;
            website: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            githubRepository: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            sourceIds: z.ZodArray<z.ZodString, "many">;
            relationToProblem: z.ZodEnum<["direct", "adjacent", "technical"]>;
            confidence: z.ZodNumber;
            lastEnrichedAt: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            name: string;
            description: string;
            confidence: number;
            workflow: {
                description: string;
                sourceIds: string[];
                step: number;
                action: string;
            }[];
            targetUsers: string[];
            id: string;
            sourceIds: string[];
            problemSolved: string;
            approach: string;
            features: {
                name: string;
                description: string;
                category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "collaboration" | "integration";
                sourceIds: string[];
            }[];
            inputs: string[];
            outputs: string[];
            technologies: string[];
            limitations: string[];
            relationToProblem: "technical" | "direct" | "adjacent";
            lastEnrichedAt: string;
            website?: string | null | undefined;
            githubRepository?: string | null | undefined;
        }, {
            name: string;
            description: string;
            confidence: number;
            workflow: {
                description: string;
                sourceIds: string[];
                step: number;
                action: string;
            }[];
            targetUsers: string[];
            id: string;
            sourceIds: string[];
            problemSolved: string;
            approach: string;
            features: {
                name: string;
                description: string;
                category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "collaboration" | "integration";
                sourceIds: string[];
            }[];
            inputs: string[];
            outputs: string[];
            technologies: string[];
            limitations: string[];
            relationToProblem: "technical" | "direct" | "adjacent";
            lastEnrichedAt: string;
            website?: string | null | undefined;
            githubRepository?: string | null | undefined;
        }>, "many">;
        coverage: z.ZodObject<{
            commercialProducts: z.ZodBoolean;
            startups: z.ZodBoolean;
            githubRepos: z.ZodBoolean;
            hackathons: z.ZodBoolean;
            researchPapers: z.ZodBoolean;
        }, "strip", z.ZodTypeAny, {
            startups: boolean;
            hackathons: boolean;
            commercialProducts: boolean;
            githubRepos: boolean;
            researchPapers: boolean;
        }, {
            startups: boolean;
            hackathons: boolean;
            commercialProducts: boolean;
            githubRepos: boolean;
            researchPapers: boolean;
        }>;
        unresolvedQuestions: z.ZodArray<z.ZodString, "many">;
        contradictions: z.ZodArray<z.ZodObject<{
            solutionId: z.ZodString;
            field: z.ZodString;
            conflictingValues: z.ZodArray<z.ZodString, "many">;
            sourceIds: z.ZodArray<z.ZodString, "many">;
            status: z.ZodEnum<["unresolved", "resolved"]>;
        }, "strip", z.ZodTypeAny, {
            status: "unresolved" | "resolved";
            sourceIds: string[];
            solutionId: string;
            field: string;
            conflictingValues: string[];
        }, {
            status: "unresolved" | "resolved";
            sourceIds: string[];
            solutionId: string;
            field: string;
            conflictingValues: string[];
        }>, "many">;
        stoppingReason: z.ZodEnum<["coverage_sufficient", "diminishing_returns", "max_iterations", "budget_limit", "provider_failure"]>;
        quality: z.ZodObject<{
            evidenceQuality: z.ZodEnum<["low", "medium", "high"]>;
            coverageQuality: z.ZodEnum<["low", "medium", "high"]>;
        }, "strip", z.ZodTypeAny, {
            evidenceQuality: "low" | "medium" | "high";
            coverageQuality: "low" | "medium" | "high";
        }, {
            evidenceQuality: "low" | "medium" | "high";
            coverageQuality: "low" | "medium" | "high";
        }>;
    }, "strip", z.ZodTypeAny, {
        researchId: string;
        summary: {
            queriesRun: number;
            geminiSearchCalls: number;
            tavilySearchCalls: number;
            githubSearchCalls: number;
            sourcesFound: number;
            uniqueSources: number;
            candidateEntities: number;
            relevantSolutions: number;
            directSolutions: number;
            adjacentSolutions: number;
            technicalApproaches: number;
            enrichedSolutions: number;
            discoveryRounds: number;
            enrichmentRounds: number;
        };
        sources: {
            domain: string;
            id: string;
            title: string;
            url: string;
            canonicalUrl: string;
            sourceType: "hackathon" | "other" | "open_source" | "research" | "github" | "product" | "startup" | "web" | "blog";
            discoveredBy: ("github" | "gemini" | "tavily")[];
            searchQueryIds: string[];
            retrievedAt: string;
            relevanceScore: number;
            authorityScore: number;
            extractionStatus: "success" | "partial" | "failed";
            metadata: Record<string, unknown>;
            snippet?: string | null | undefined;
            content?: string | null | undefined;
            publishedAt?: string | null | undefined;
        }[];
        discoveredSolutions: {
            name: string;
            description: string;
            confidence: number;
            workflow: {
                description: string;
                sourceIds: string[];
                step: number;
                action: string;
            }[];
            targetUsers: string[];
            id: string;
            sourceIds: string[];
            problemSolved: string;
            approach: string;
            features: {
                name: string;
                description: string;
                category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "collaboration" | "integration";
                sourceIds: string[];
            }[];
            inputs: string[];
            outputs: string[];
            technologies: string[];
            limitations: string[];
            relationToProblem: "technical" | "direct" | "adjacent";
            lastEnrichedAt: string;
            website?: string | null | undefined;
            githubRepository?: string | null | undefined;
        }[];
        coverage: {
            startups: boolean;
            hackathons: boolean;
            commercialProducts: boolean;
            githubRepos: boolean;
            researchPapers: boolean;
        };
        unresolvedQuestions: string[];
        contradictions: {
            status: "unresolved" | "resolved";
            sourceIds: string[];
            solutionId: string;
            field: string;
            conflictingValues: string[];
        }[];
        stoppingReason: "coverage_sufficient" | "diminishing_returns" | "max_iterations" | "budget_limit" | "provider_failure";
        quality: {
            evidenceQuality: "low" | "medium" | "high";
            coverageQuality: "low" | "medium" | "high";
        };
    }, {
        researchId: string;
        summary: {
            queriesRun: number;
            geminiSearchCalls: number;
            tavilySearchCalls: number;
            githubSearchCalls: number;
            sourcesFound: number;
            uniqueSources: number;
            candidateEntities: number;
            relevantSolutions: number;
            directSolutions: number;
            adjacentSolutions: number;
            technicalApproaches: number;
            enrichedSolutions: number;
            discoveryRounds: number;
            enrichmentRounds: number;
        };
        sources: {
            domain: string;
            id: string;
            title: string;
            url: string;
            canonicalUrl: string;
            sourceType: "hackathon" | "other" | "open_source" | "research" | "github" | "product" | "startup" | "web" | "blog";
            discoveredBy: ("github" | "gemini" | "tavily")[];
            searchQueryIds: string[];
            retrievedAt: string;
            relevanceScore: number;
            authorityScore: number;
            extractionStatus: "success" | "partial" | "failed";
            snippet?: string | null | undefined;
            content?: string | null | undefined;
            publishedAt?: string | null | undefined;
            metadata?: Record<string, unknown> | undefined;
        }[];
        discoveredSolutions: {
            name: string;
            description: string;
            confidence: number;
            workflow: {
                description: string;
                sourceIds: string[];
                step: number;
                action: string;
            }[];
            targetUsers: string[];
            id: string;
            sourceIds: string[];
            problemSolved: string;
            approach: string;
            features: {
                name: string;
                description: string;
                category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "collaboration" | "integration";
                sourceIds: string[];
            }[];
            inputs: string[];
            outputs: string[];
            technologies: string[];
            limitations: string[];
            relationToProblem: "technical" | "direct" | "adjacent";
            lastEnrichedAt: string;
            website?: string | null | undefined;
            githubRepository?: string | null | undefined;
        }[];
        coverage: {
            startups: boolean;
            hackathons: boolean;
            commercialProducts: boolean;
            githubRepos: boolean;
            researchPapers: boolean;
        };
        unresolvedQuestions: string[];
        contradictions: {
            status: "unresolved" | "resolved";
            sourceIds: string[];
            solutionId: string;
            field: string;
            conflictingValues: string[];
        }[];
        stoppingReason: "coverage_sufficient" | "diminishing_returns" | "max_iterations" | "budget_limit" | "provider_failure";
        quality: {
            evidenceQuality: "low" | "medium" | "high";
            coverageQuality: "low" | "medium" | "high";
        };
    }>>>;
    innovation: z.ZodDefault<z.ZodNullable<z.ZodObject<{
        innovationId: z.ZodString;
        candidateIdeas: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            oneLineDescription: z.ZodString;
            detailedDescription: z.ZodString;
            targetUsers: z.ZodArray<z.ZodString, "many">;
            problemSolved: z.ZodString;
            keyFeatures: z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                description: z.ZodString;
                category: z.ZodEnum<["core", "ai", "automation", "workflow", "analytics", "collaboration", "integration", "other"]>;
                sourceIds: z.ZodArray<z.ZodString, "many">;
            }, "strip", z.ZodTypeAny, {
                name: string;
                description: string;
                category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "collaboration" | "integration";
                sourceIds: string[];
            }, {
                name: string;
                description: string;
                category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "collaboration" | "integration";
                sourceIds: string[];
            }>, "many">;
            workflow: z.ZodArray<z.ZodObject<{
                step: z.ZodNumber;
                action: z.ZodString;
                description: z.ZodString;
                sourceIds: z.ZodArray<z.ZodString, "many">;
            }, "strip", z.ZodTypeAny, {
                description: string;
                sourceIds: string[];
                step: number;
                action: string;
            }, {
                description: string;
                sourceIds: string[];
                step: number;
                action: string;
            }>, "many">;
            differentiators: z.ZodArray<z.ZodObject<{
                statement: z.ZodString;
                differenceType: z.ZodEnum<["feature", "workflow", "user", "context", "integration", "constraint", "automation", "combination"]>;
                comparedToSolutionIds: z.ZodArray<z.ZodString, "many">;
                evidenceSourceIds: z.ZodArray<z.ZodString, "many">;
                strength: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                statement: string;
                evidenceSourceIds: string[];
                differenceType: "context" | "user" | "workflow" | "automation" | "integration" | "feature" | "constraint" | "combination";
                comparedToSolutionIds: string[];
                strength: number;
            }, {
                statement: string;
                evidenceSourceIds: string[];
                differenceType: "context" | "user" | "workflow" | "automation" | "integration" | "feature" | "constraint" | "combination";
                comparedToSolutionIds: string[];
                strength: number;
            }>, "many">;
            opportunityIds: z.ZodArray<z.ZodString, "many">;
            inspirationSources: z.ZodArray<z.ZodString, "many">;
            potentialRisks: z.ZodArray<z.ZodString, "many">;
            estimatedComplexity: z.ZodEnum<["low", "medium", "high"]>;
            estimatedHackathonFit: z.ZodNumber;
            innovationScore: z.ZodNumber;
            impactScore: z.ZodNumber;
            differentiationScore: z.ZodNumber;
            overallConceptScore: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            name: string;
            workflow: {
                description: string;
                sourceIds: string[];
                step: number;
                action: string;
            }[];
            targetUsers: string[];
            id: string;
            problemSolved: string;
            oneLineDescription: string;
            detailedDescription: string;
            keyFeatures: {
                name: string;
                description: string;
                category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "collaboration" | "integration";
                sourceIds: string[];
            }[];
            differentiators: {
                statement: string;
                evidenceSourceIds: string[];
                differenceType: "context" | "user" | "workflow" | "automation" | "integration" | "feature" | "constraint" | "combination";
                comparedToSolutionIds: string[];
                strength: number;
            }[];
            opportunityIds: string[];
            inspirationSources: string[];
            potentialRisks: string[];
            estimatedComplexity: "low" | "medium" | "high";
            estimatedHackathonFit: number;
            innovationScore: number;
            impactScore: number;
            differentiationScore: number;
            overallConceptScore: number;
        }, {
            name: string;
            workflow: {
                description: string;
                sourceIds: string[];
                step: number;
                action: string;
            }[];
            targetUsers: string[];
            id: string;
            problemSolved: string;
            oneLineDescription: string;
            detailedDescription: string;
            keyFeatures: {
                name: string;
                description: string;
                category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "collaboration" | "integration";
                sourceIds: string[];
            }[];
            differentiators: {
                statement: string;
                evidenceSourceIds: string[];
                differenceType: "context" | "user" | "workflow" | "automation" | "integration" | "feature" | "constraint" | "combination";
                comparedToSolutionIds: string[];
                strength: number;
            }[];
            opportunityIds: string[];
            inspirationSources: string[];
            potentialRisks: string[];
            estimatedComplexity: "low" | "medium" | "high";
            estimatedHackathonFit: number;
            innovationScore: number;
            impactScore: number;
            differentiationScore: number;
            overallConceptScore: number;
        }>, "many">;
        selectedIdea: z.ZodDefault<z.ZodNullable<z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            oneLineDescription: z.ZodString;
            detailedDescription: z.ZodString;
            targetUsers: z.ZodArray<z.ZodString, "many">;
            problemSolved: z.ZodString;
            keyFeatures: z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                description: z.ZodString;
                category: z.ZodEnum<["core", "ai", "automation", "workflow", "analytics", "collaboration", "integration", "other"]>;
                sourceIds: z.ZodArray<z.ZodString, "many">;
            }, "strip", z.ZodTypeAny, {
                name: string;
                description: string;
                category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "collaboration" | "integration";
                sourceIds: string[];
            }, {
                name: string;
                description: string;
                category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "collaboration" | "integration";
                sourceIds: string[];
            }>, "many">;
            workflow: z.ZodArray<z.ZodObject<{
                step: z.ZodNumber;
                action: z.ZodString;
                description: z.ZodString;
                sourceIds: z.ZodArray<z.ZodString, "many">;
            }, "strip", z.ZodTypeAny, {
                description: string;
                sourceIds: string[];
                step: number;
                action: string;
            }, {
                description: string;
                sourceIds: string[];
                step: number;
                action: string;
            }>, "many">;
            differentiators: z.ZodArray<z.ZodObject<{
                statement: z.ZodString;
                differenceType: z.ZodEnum<["feature", "workflow", "user", "context", "integration", "constraint", "automation", "combination"]>;
                comparedToSolutionIds: z.ZodArray<z.ZodString, "many">;
                evidenceSourceIds: z.ZodArray<z.ZodString, "many">;
                strength: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                statement: string;
                evidenceSourceIds: string[];
                differenceType: "context" | "user" | "workflow" | "automation" | "integration" | "feature" | "constraint" | "combination";
                comparedToSolutionIds: string[];
                strength: number;
            }, {
                statement: string;
                evidenceSourceIds: string[];
                differenceType: "context" | "user" | "workflow" | "automation" | "integration" | "feature" | "constraint" | "combination";
                comparedToSolutionIds: string[];
                strength: number;
            }>, "many">;
            opportunityIds: z.ZodArray<z.ZodString, "many">;
            inspirationSources: z.ZodArray<z.ZodString, "many">;
            potentialRisks: z.ZodArray<z.ZodString, "many">;
            estimatedComplexity: z.ZodEnum<["low", "medium", "high"]>;
            estimatedHackathonFit: z.ZodNumber;
            innovationScore: z.ZodNumber;
            impactScore: z.ZodNumber;
            differentiationScore: z.ZodNumber;
            overallConceptScore: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            name: string;
            workflow: {
                description: string;
                sourceIds: string[];
                step: number;
                action: string;
            }[];
            targetUsers: string[];
            id: string;
            problemSolved: string;
            oneLineDescription: string;
            detailedDescription: string;
            keyFeatures: {
                name: string;
                description: string;
                category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "collaboration" | "integration";
                sourceIds: string[];
            }[];
            differentiators: {
                statement: string;
                evidenceSourceIds: string[];
                differenceType: "context" | "user" | "workflow" | "automation" | "integration" | "feature" | "constraint" | "combination";
                comparedToSolutionIds: string[];
                strength: number;
            }[];
            opportunityIds: string[];
            inspirationSources: string[];
            potentialRisks: string[];
            estimatedComplexity: "low" | "medium" | "high";
            estimatedHackathonFit: number;
            innovationScore: number;
            impactScore: number;
            differentiationScore: number;
            overallConceptScore: number;
        }, {
            name: string;
            workflow: {
                description: string;
                sourceIds: string[];
                step: number;
                action: string;
            }[];
            targetUsers: string[];
            id: string;
            problemSolved: string;
            oneLineDescription: string;
            detailedDescription: string;
            keyFeatures: {
                name: string;
                description: string;
                category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "collaboration" | "integration";
                sourceIds: string[];
            }[];
            differentiators: {
                statement: string;
                evidenceSourceIds: string[];
                differenceType: "context" | "user" | "workflow" | "automation" | "integration" | "feature" | "constraint" | "combination";
                comparedToSolutionIds: string[];
                strength: number;
            }[];
            opportunityIds: string[];
            inspirationSources: string[];
            potentialRisks: string[];
            estimatedComplexity: "low" | "medium" | "high";
            estimatedHackathonFit: number;
            innovationScore: number;
            impactScore: number;
            differentiationScore: number;
            overallConceptScore: number;
        }>>>;
        solutionLandscape: z.ZodObject<{
            totalSolutions: z.ZodNumber;
            directSolutions: z.ZodNumber;
            adjacentSolutions: z.ZodNumber;
            dominantApproaches: z.ZodArray<z.ZodString, "many">;
            majorSolutionClusters: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                name: z.ZodString;
                description: z.ZodString;
                solutionIds: z.ZodArray<z.ZodString, "many">;
                commonFeatures: z.ZodArray<z.ZodString, "many">;
                distinguishingCharacteristics: z.ZodArray<z.ZodString, "many">;
            }, "strip", z.ZodTypeAny, {
                name: string;
                description: string;
                id: string;
                solutionIds: string[];
                commonFeatures: string[];
                distinguishingCharacteristics: string[];
            }, {
                name: string;
                description: string;
                id: string;
                solutionIds: string[];
                commonFeatures: string[];
                distinguishingCharacteristics: string[];
            }>, "many">;
        }, "strip", z.ZodTypeAny, {
            directSolutions: number;
            adjacentSolutions: number;
            totalSolutions: number;
            dominantApproaches: string[];
            majorSolutionClusters: {
                name: string;
                description: string;
                id: string;
                solutionIds: string[];
                commonFeatures: string[];
                distinguishingCharacteristics: string[];
            }[];
        }, {
            directSolutions: number;
            adjacentSolutions: number;
            totalSolutions: number;
            dominantApproaches: string[];
            majorSolutionClusters: {
                name: string;
                description: string;
                id: string;
                solutionIds: string[];
                commonFeatures: string[];
                distinguishingCharacteristics: string[];
            }[];
        }>;
        featureLandscape: z.ZodArray<z.ZodObject<{
            featureId: z.ZodString;
            canonicalName: z.ZodString;
            description: z.ZodString;
            category: z.ZodString;
            occurrenceCount: z.ZodNumber;
            totalRelevantSolutions: z.ZodNumber;
            frequency: z.ZodNumber;
            solutionIds: z.ZodArray<z.ZodString, "many">;
            frequencyClass: z.ZodEnum<["common", "moderate", "rare"]>;
            variants: z.ZodArray<z.ZodString, "many">;
            evidenceSourceIds: z.ZodArray<z.ZodString, "many">;
        }, "strip", z.ZodTypeAny, {
            description: string;
            category: string;
            solutionIds: string[];
            featureId: string;
            canonicalName: string;
            occurrenceCount: number;
            totalRelevantSolutions: number;
            frequency: number;
            frequencyClass: "common" | "moderate" | "rare";
            variants: string[];
            evidenceSourceIds: string[];
        }, {
            description: string;
            category: string;
            solutionIds: string[];
            featureId: string;
            canonicalName: string;
            occurrenceCount: number;
            totalRelevantSolutions: number;
            frequency: number;
            frequencyClass: "common" | "moderate" | "rare";
            variants: string[];
            evidenceSourceIds: string[];
        }>, "many">;
        identifiedGaps: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            type: z.ZodEnum<["feature", "workflow", "user", "context", "constraint", "integration", "automation", "data", "other"]>;
            title: z.ZodString;
            description: z.ZodString;
            supportingSolutionIds: z.ZodArray<z.ZodString, "many">;
            supportingSourceIds: z.ZodArray<z.ZodString, "many">;
            impact: z.ZodNumber;
            confidence: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            type: "context" | "data" | "user" | "other" | "workflow" | "automation" | "integration" | "feature" | "constraint";
            description: string;
            confidence: number;
            id: string;
            title: string;
            supportingSolutionIds: string[];
            supportingSourceIds: string[];
            impact: number;
        }, {
            type: "context" | "data" | "user" | "other" | "workflow" | "automation" | "integration" | "feature" | "constraint";
            description: string;
            confidence: number;
            id: string;
            title: string;
            supportingSolutionIds: string[];
            supportingSourceIds: string[];
            impact: number;
        }>, "many">;
        differentiation: z.ZodObject<{
            summary: z.ZodString;
            keyDifferentiators: z.ZodArray<z.ZodObject<{
                statement: z.ZodString;
                differenceType: z.ZodEnum<["feature", "workflow", "user", "context", "integration", "constraint", "automation", "combination"]>;
                comparedToSolutionIds: z.ZodArray<z.ZodString, "many">;
                evidenceSourceIds: z.ZodArray<z.ZodString, "many">;
                strength: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                statement: string;
                evidenceSourceIds: string[];
                differenceType: "context" | "user" | "workflow" | "automation" | "integration" | "feature" | "constraint" | "combination";
                comparedToSolutionIds: string[];
                strength: number;
            }, {
                statement: string;
                evidenceSourceIds: string[];
                differenceType: "context" | "user" | "workflow" | "automation" | "integration" | "feature" | "constraint" | "combination";
                comparedToSolutionIds: string[];
                strength: number;
            }>, "many">;
        }, "strip", z.ZodTypeAny, {
            summary: string;
            keyDifferentiators: {
                statement: string;
                evidenceSourceIds: string[];
                differenceType: "context" | "user" | "workflow" | "automation" | "integration" | "feature" | "constraint" | "combination";
                comparedToSolutionIds: string[];
                strength: number;
            }[];
        }, {
            summary: string;
            keyDifferentiators: {
                statement: string;
                evidenceSourceIds: string[];
                differenceType: "context" | "user" | "workflow" | "automation" | "integration" | "feature" | "constraint" | "combination";
                comparedToSolutionIds: string[];
                strength: number;
            }[];
        }>;
        noveltyAssessment: z.ZodObject<{
            classification: z.ZodEnum<["high_differentiation", "moderate_differentiation", "low_differentiation"]>;
            score: z.ZodNumber;
            reasoning: z.ZodString;
            strongestDifferentiators: z.ZodArray<z.ZodString, "many">;
            majorOverlapAreas: z.ZodArray<z.ZodString, "many">;
            closestExistingSolutions: z.ZodArray<z.ZodString, "many">;
            evidenceSourceIds: z.ZodArray<z.ZodString, "many">;
            confidence: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            confidence: number;
            evidenceSourceIds: string[];
            classification: "high_differentiation" | "moderate_differentiation" | "low_differentiation";
            score: number;
            reasoning: string;
            strongestDifferentiators: string[];
            majorOverlapAreas: string[];
            closestExistingSolutions: string[];
        }, {
            confidence: number;
            evidenceSourceIds: string[];
            classification: "high_differentiation" | "moderate_differentiation" | "low_differentiation";
            score: number;
            reasoning: string;
            strongestDifferentiators: string[];
            majorOverlapAreas: string[];
            closestExistingSolutions: string[];
        }>;
        projectCapabilityRequirements: z.ZodObject<{
            requiredCapabilities: z.ZodArray<z.ZodString, "many">;
            technicalCapabilities: z.ZodArray<z.ZodString, "many">;
            domainCapabilities: z.ZodArray<z.ZodString, "many">;
            likelyTeamRoles: z.ZodArray<z.ZodString, "many">;
            complexityAreas: z.ZodArray<z.ZodString, "many">;
            potentialSkillGaps: z.ZodArray<z.ZodString, "many">;
            criticalDependencies: z.ZodArray<z.ZodString, "many">;
        }, "strip", z.ZodTypeAny, {
            requiredCapabilities: string[];
            technicalCapabilities: string[];
            domainCapabilities: string[];
            likelyTeamRoles: string[];
            complexityAreas: string[];
            potentialSkillGaps: string[];
            criticalDependencies: string[];
        }, {
            requiredCapabilities: string[];
            technicalCapabilities: string[];
            domainCapabilities: string[];
            likelyTeamRoles: string[];
            complexityAreas: string[];
            potentialSkillGaps: string[];
            criticalDependencies: string[];
        }>;
        validationQuestions: z.ZodArray<z.ZodString, "many">;
        confidence: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        confidence: number;
        innovationId: string;
        candidateIdeas: {
            name: string;
            workflow: {
                description: string;
                sourceIds: string[];
                step: number;
                action: string;
            }[];
            targetUsers: string[];
            id: string;
            problemSolved: string;
            oneLineDescription: string;
            detailedDescription: string;
            keyFeatures: {
                name: string;
                description: string;
                category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "collaboration" | "integration";
                sourceIds: string[];
            }[];
            differentiators: {
                statement: string;
                evidenceSourceIds: string[];
                differenceType: "context" | "user" | "workflow" | "automation" | "integration" | "feature" | "constraint" | "combination";
                comparedToSolutionIds: string[];
                strength: number;
            }[];
            opportunityIds: string[];
            inspirationSources: string[];
            potentialRisks: string[];
            estimatedComplexity: "low" | "medium" | "high";
            estimatedHackathonFit: number;
            innovationScore: number;
            impactScore: number;
            differentiationScore: number;
            overallConceptScore: number;
        }[];
        selectedIdea: {
            name: string;
            workflow: {
                description: string;
                sourceIds: string[];
                step: number;
                action: string;
            }[];
            targetUsers: string[];
            id: string;
            problemSolved: string;
            oneLineDescription: string;
            detailedDescription: string;
            keyFeatures: {
                name: string;
                description: string;
                category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "collaboration" | "integration";
                sourceIds: string[];
            }[];
            differentiators: {
                statement: string;
                evidenceSourceIds: string[];
                differenceType: "context" | "user" | "workflow" | "automation" | "integration" | "feature" | "constraint" | "combination";
                comparedToSolutionIds: string[];
                strength: number;
            }[];
            opportunityIds: string[];
            inspirationSources: string[];
            potentialRisks: string[];
            estimatedComplexity: "low" | "medium" | "high";
            estimatedHackathonFit: number;
            innovationScore: number;
            impactScore: number;
            differentiationScore: number;
            overallConceptScore: number;
        } | null;
        solutionLandscape: {
            directSolutions: number;
            adjacentSolutions: number;
            totalSolutions: number;
            dominantApproaches: string[];
            majorSolutionClusters: {
                name: string;
                description: string;
                id: string;
                solutionIds: string[];
                commonFeatures: string[];
                distinguishingCharacteristics: string[];
            }[];
        };
        featureLandscape: {
            description: string;
            category: string;
            solutionIds: string[];
            featureId: string;
            canonicalName: string;
            occurrenceCount: number;
            totalRelevantSolutions: number;
            frequency: number;
            frequencyClass: "common" | "moderate" | "rare";
            variants: string[];
            evidenceSourceIds: string[];
        }[];
        identifiedGaps: {
            type: "context" | "data" | "user" | "other" | "workflow" | "automation" | "integration" | "feature" | "constraint";
            description: string;
            confidence: number;
            id: string;
            title: string;
            supportingSolutionIds: string[];
            supportingSourceIds: string[];
            impact: number;
        }[];
        differentiation: {
            summary: string;
            keyDifferentiators: {
                statement: string;
                evidenceSourceIds: string[];
                differenceType: "context" | "user" | "workflow" | "automation" | "integration" | "feature" | "constraint" | "combination";
                comparedToSolutionIds: string[];
                strength: number;
            }[];
        };
        noveltyAssessment: {
            confidence: number;
            evidenceSourceIds: string[];
            classification: "high_differentiation" | "moderate_differentiation" | "low_differentiation";
            score: number;
            reasoning: string;
            strongestDifferentiators: string[];
            majorOverlapAreas: string[];
            closestExistingSolutions: string[];
        };
        projectCapabilityRequirements: {
            requiredCapabilities: string[];
            technicalCapabilities: string[];
            domainCapabilities: string[];
            likelyTeamRoles: string[];
            complexityAreas: string[];
            potentialSkillGaps: string[];
            criticalDependencies: string[];
        };
        validationQuestions: string[];
    }, {
        confidence: number;
        innovationId: string;
        candidateIdeas: {
            name: string;
            workflow: {
                description: string;
                sourceIds: string[];
                step: number;
                action: string;
            }[];
            targetUsers: string[];
            id: string;
            problemSolved: string;
            oneLineDescription: string;
            detailedDescription: string;
            keyFeatures: {
                name: string;
                description: string;
                category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "collaboration" | "integration";
                sourceIds: string[];
            }[];
            differentiators: {
                statement: string;
                evidenceSourceIds: string[];
                differenceType: "context" | "user" | "workflow" | "automation" | "integration" | "feature" | "constraint" | "combination";
                comparedToSolutionIds: string[];
                strength: number;
            }[];
            opportunityIds: string[];
            inspirationSources: string[];
            potentialRisks: string[];
            estimatedComplexity: "low" | "medium" | "high";
            estimatedHackathonFit: number;
            innovationScore: number;
            impactScore: number;
            differentiationScore: number;
            overallConceptScore: number;
        }[];
        solutionLandscape: {
            directSolutions: number;
            adjacentSolutions: number;
            totalSolutions: number;
            dominantApproaches: string[];
            majorSolutionClusters: {
                name: string;
                description: string;
                id: string;
                solutionIds: string[];
                commonFeatures: string[];
                distinguishingCharacteristics: string[];
            }[];
        };
        featureLandscape: {
            description: string;
            category: string;
            solutionIds: string[];
            featureId: string;
            canonicalName: string;
            occurrenceCount: number;
            totalRelevantSolutions: number;
            frequency: number;
            frequencyClass: "common" | "moderate" | "rare";
            variants: string[];
            evidenceSourceIds: string[];
        }[];
        identifiedGaps: {
            type: "context" | "data" | "user" | "other" | "workflow" | "automation" | "integration" | "feature" | "constraint";
            description: string;
            confidence: number;
            id: string;
            title: string;
            supportingSolutionIds: string[];
            supportingSourceIds: string[];
            impact: number;
        }[];
        differentiation: {
            summary: string;
            keyDifferentiators: {
                statement: string;
                evidenceSourceIds: string[];
                differenceType: "context" | "user" | "workflow" | "automation" | "integration" | "feature" | "constraint" | "combination";
                comparedToSolutionIds: string[];
                strength: number;
            }[];
        };
        noveltyAssessment: {
            confidence: number;
            evidenceSourceIds: string[];
            classification: "high_differentiation" | "moderate_differentiation" | "low_differentiation";
            score: number;
            reasoning: string;
            strongestDifferentiators: string[];
            majorOverlapAreas: string[];
            closestExistingSolutions: string[];
        };
        projectCapabilityRequirements: {
            requiredCapabilities: string[];
            technicalCapabilities: string[];
            domainCapabilities: string[];
            likelyTeamRoles: string[];
            complexityAreas: string[];
            potentialSkillGaps: string[];
            criticalDependencies: string[];
        };
        validationQuestions: string[];
        selectedIdea?: {
            name: string;
            workflow: {
                description: string;
                sourceIds: string[];
                step: number;
                action: string;
            }[];
            targetUsers: string[];
            id: string;
            problemSolved: string;
            oneLineDescription: string;
            detailedDescription: string;
            keyFeatures: {
                name: string;
                description: string;
                category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "collaboration" | "integration";
                sourceIds: string[];
            }[];
            differentiators: {
                statement: string;
                evidenceSourceIds: string[];
                differenceType: "context" | "user" | "workflow" | "automation" | "integration" | "feature" | "constraint" | "combination";
                comparedToSolutionIds: string[];
                strength: number;
            }[];
            opportunityIds: string[];
            inspirationSources: string[];
            potentialRisks: string[];
            estimatedComplexity: "low" | "medium" | "high";
            estimatedHackathonFit: number;
            innovationScore: number;
            impactScore: number;
            differentiationScore: number;
            overallConceptScore: number;
        } | null | undefined;
    }>>>;
    teamAnalysis: z.ZodDefault<z.ZodNullable<z.ZodObject<{
        teamMembers: z.ZodArray<z.ZodObject<{
            memberId: z.ZodString;
            name: z.ZodString;
            parsedSkills: z.ZodArray<z.ZodString, "many">;
            primaryRole: z.ZodString;
            proficiencyLevels: z.ZodRecord<z.ZodString, z.ZodEnum<["beginner", "intermediate", "expert"]>>;
            resumeSnippet: z.ZodString;
            githubUsername: z.ZodOptional<z.ZodString>;
            yearsExperience: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            memberId: string;
            parsedSkills: string[];
            primaryRole: string;
            proficiencyLevels: Record<string, "beginner" | "intermediate" | "expert">;
            resumeSnippet: string;
            githubUsername?: string | undefined;
            yearsExperience?: number | undefined;
        }, {
            name: string;
            memberId: string;
            parsedSkills: string[];
            primaryRole: string;
            proficiencyLevels: Record<string, "beginner" | "intermediate" | "expert">;
            resumeSnippet: string;
            githubUsername?: string | undefined;
            yearsExperience?: number | undefined;
        }>, "many">;
        roleAssignments: z.ZodArray<z.ZodObject<{
            roleTitle: z.ZodString;
            assignedMemberId: z.ZodString;
            assignedMemberName: z.ZodString;
            assignedCapabilities: z.ZodArray<z.ZodString, "many">;
            assignedComponents: z.ZodArray<z.ZodString, "many">;
            workloadPercentage: z.ZodNumber;
            reasoning: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            reasoning: string;
            roleTitle: string;
            assignedMemberId: string;
            assignedMemberName: string;
            assignedCapabilities: string[];
            assignedComponents: string[];
            workloadPercentage: number;
        }, {
            reasoning: string;
            roleTitle: string;
            assignedMemberId: string;
            assignedMemberName: string;
            assignedCapabilities: string[];
            assignedComponents: string[];
            workloadPercentage: number;
        }>, "many">;
        skillGaps: z.ZodArray<z.ZodObject<{
            missingCapability: z.ZodString;
            riskLevel: z.ZodEnum<["low", "medium", "high"]>;
            mitigationStrategy: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            missingCapability: string;
            riskLevel: "low" | "medium" | "high";
            mitigationStrategy: string;
        }, {
            missingCapability: string;
            riskLevel: "low" | "medium" | "high";
            mitigationStrategy: string;
        }>, "many">;
        dataAvailability: z.ZodArray<z.ZodObject<{
            dataType: z.ZodString;
            available: z.ZodBoolean;
            source: z.ZodOptional<z.ZodString>;
            acquisitionStrategy: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            dataType: string;
            available: boolean;
            source?: string | undefined;
            acquisitionStrategy?: string | undefined;
        }, {
            dataType: string;
            available: boolean;
            source?: string | undefined;
            acquisitionStrategy?: string | undefined;
        }>, "many">;
        expandedSolution: z.ZodObject<{
            name: z.ZodString;
            description: z.ZodString;
            problemSolved: z.ZodString;
            targetUsers: z.ZodArray<z.ZodString, "many">;
            keyFeatures: z.ZodArray<z.ZodString, "many">;
            workflow: z.ZodArray<z.ZodString, "many">;
            requiredCapabilities: z.ZodArray<z.ZodString, "many">;
            technicalCapabilities: z.ZodArray<z.ZodString, "many">;
            complexityAreas: z.ZodArray<z.ZodString, "many">;
        }, "strip", z.ZodTypeAny, {
            name: string;
            description: string;
            workflow: string[];
            targetUsers: string[];
            problemSolved: string;
            keyFeatures: string[];
            requiredCapabilities: string[];
            technicalCapabilities: string[];
            complexityAreas: string[];
        }, {
            name: string;
            description: string;
            workflow: string[];
            targetUsers: string[];
            problemSolved: string;
            keyFeatures: string[];
            requiredCapabilities: string[];
            technicalCapabilities: string[];
            complexityAreas: string[];
        }>;
        feasibility: z.ZodObject<{
            score: z.ZodNumber;
            summary: z.ZodString;
            teamStrengths: z.ZodArray<z.ZodString, "many">;
            teamWeaknesses: z.ZodArray<z.ZodString, "many">;
            timeRisk: z.ZodEnum<["low", "medium", "high"]>;
            technicalRisk: z.ZodEnum<["low", "medium", "high"]>;
            dataRisk: z.ZodEnum<["low", "medium", "high"]>;
            recommendations: z.ZodArray<z.ZodString, "many">;
        }, "strip", z.ZodTypeAny, {
            summary: string;
            score: number;
            teamStrengths: string[];
            teamWeaknesses: string[];
            timeRisk: "low" | "medium" | "high";
            technicalRisk: "low" | "medium" | "high";
            dataRisk: "low" | "medium" | "high";
            recommendations: string[];
        }, {
            summary: string;
            score: number;
            teamStrengths: string[];
            teamWeaknesses: string[];
            timeRisk: "low" | "medium" | "high";
            technicalRisk: "low" | "medium" | "high";
            dataRisk: "low" | "medium" | "high";
            recommendations: string[];
        }>;
        techStackOptions: z.ZodArray<z.ZodObject<{
            optionId: z.ZodString;
            rank: z.ZodNumber;
            name: z.ZodString;
            description: z.ZodString;
            frontend: z.ZodArray<z.ZodString, "many">;
            backend: z.ZodArray<z.ZodString, "many">;
            database: z.ZodArray<z.ZodString, "many">;
            aiMl: z.ZodArray<z.ZodString, "many">;
            infrastructure: z.ZodArray<z.ZodString, "many">;
            otherTools: z.ZodArray<z.ZodString, "many">;
            architectureOverview: z.ZodString;
            setupComplexity: z.ZodEnum<["low", "medium", "high"]>;
            timeToPrototype: z.ZodString;
            merits: z.ZodArray<z.ZodString, "many">;
            demerits: z.ZodArray<z.ZodString, "many">;
            teamFitScore: z.ZodNumber;
            overallScore: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            name: string;
            description: string;
            optionId: string;
            rank: number;
            frontend: string[];
            backend: string[];
            database: string[];
            aiMl: string[];
            infrastructure: string[];
            otherTools: string[];
            architectureOverview: string;
            setupComplexity: "low" | "medium" | "high";
            timeToPrototype: string;
            merits: string[];
            demerits: string[];
            teamFitScore: number;
            overallScore: number;
        }, {
            name: string;
            description: string;
            optionId: string;
            rank: number;
            frontend: string[];
            backend: string[];
            database: string[];
            aiMl: string[];
            infrastructure: string[];
            otherTools: string[];
            architectureOverview: string;
            setupComplexity: "low" | "medium" | "high";
            timeToPrototype: string;
            merits: string[];
            demerits: string[];
            teamFitScore: number;
            overallScore: number;
        }>, "many">;
        selectedTechStack: z.ZodDefault<z.ZodNullable<z.ZodObject<{
            optionId: z.ZodString;
            rank: z.ZodNumber;
            name: z.ZodString;
            description: z.ZodString;
            frontend: z.ZodArray<z.ZodString, "many">;
            backend: z.ZodArray<z.ZodString, "many">;
            database: z.ZodArray<z.ZodString, "many">;
            aiMl: z.ZodArray<z.ZodString, "many">;
            infrastructure: z.ZodArray<z.ZodString, "many">;
            otherTools: z.ZodArray<z.ZodString, "many">;
            architectureOverview: z.ZodString;
            setupComplexity: z.ZodEnum<["low", "medium", "high"]>;
            timeToPrototype: z.ZodString;
            merits: z.ZodArray<z.ZodString, "many">;
            demerits: z.ZodArray<z.ZodString, "many">;
            teamFitScore: z.ZodNumber;
            overallScore: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            name: string;
            description: string;
            optionId: string;
            rank: number;
            frontend: string[];
            backend: string[];
            database: string[];
            aiMl: string[];
            infrastructure: string[];
            otherTools: string[];
            architectureOverview: string;
            setupComplexity: "low" | "medium" | "high";
            timeToPrototype: string;
            merits: string[];
            demerits: string[];
            teamFitScore: number;
            overallScore: number;
        }, {
            name: string;
            description: string;
            optionId: string;
            rank: number;
            frontend: string[];
            backend: string[];
            database: string[];
            aiMl: string[];
            infrastructure: string[];
            otherTools: string[];
            architectureOverview: string;
            setupComplexity: "low" | "medium" | "high";
            timeToPrototype: string;
            merits: string[];
            demerits: string[];
            teamFitScore: number;
            overallScore: number;
        }>>>;
        overallTeamStrategy: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        teamMembers: {
            name: string;
            memberId: string;
            parsedSkills: string[];
            primaryRole: string;
            proficiencyLevels: Record<string, "beginner" | "intermediate" | "expert">;
            resumeSnippet: string;
            githubUsername?: string | undefined;
            yearsExperience?: number | undefined;
        }[];
        roleAssignments: {
            reasoning: string;
            roleTitle: string;
            assignedMemberId: string;
            assignedMemberName: string;
            assignedCapabilities: string[];
            assignedComponents: string[];
            workloadPercentage: number;
        }[];
        skillGaps: {
            missingCapability: string;
            riskLevel: "low" | "medium" | "high";
            mitigationStrategy: string;
        }[];
        dataAvailability: {
            dataType: string;
            available: boolean;
            source?: string | undefined;
            acquisitionStrategy?: string | undefined;
        }[];
        expandedSolution: {
            name: string;
            description: string;
            workflow: string[];
            targetUsers: string[];
            problemSolved: string;
            keyFeatures: string[];
            requiredCapabilities: string[];
            technicalCapabilities: string[];
            complexityAreas: string[];
        };
        feasibility: {
            summary: string;
            score: number;
            teamStrengths: string[];
            teamWeaknesses: string[];
            timeRisk: "low" | "medium" | "high";
            technicalRisk: "low" | "medium" | "high";
            dataRisk: "low" | "medium" | "high";
            recommendations: string[];
        };
        techStackOptions: {
            name: string;
            description: string;
            optionId: string;
            rank: number;
            frontend: string[];
            backend: string[];
            database: string[];
            aiMl: string[];
            infrastructure: string[];
            otherTools: string[];
            architectureOverview: string;
            setupComplexity: "low" | "medium" | "high";
            timeToPrototype: string;
            merits: string[];
            demerits: string[];
            teamFitScore: number;
            overallScore: number;
        }[];
        selectedTechStack: {
            name: string;
            description: string;
            optionId: string;
            rank: number;
            frontend: string[];
            backend: string[];
            database: string[];
            aiMl: string[];
            infrastructure: string[];
            otherTools: string[];
            architectureOverview: string;
            setupComplexity: "low" | "medium" | "high";
            timeToPrototype: string;
            merits: string[];
            demerits: string[];
            teamFitScore: number;
            overallScore: number;
        } | null;
        overallTeamStrategy: string;
    }, {
        teamMembers: {
            name: string;
            memberId: string;
            parsedSkills: string[];
            primaryRole: string;
            proficiencyLevels: Record<string, "beginner" | "intermediate" | "expert">;
            resumeSnippet: string;
            githubUsername?: string | undefined;
            yearsExperience?: number | undefined;
        }[];
        roleAssignments: {
            reasoning: string;
            roleTitle: string;
            assignedMemberId: string;
            assignedMemberName: string;
            assignedCapabilities: string[];
            assignedComponents: string[];
            workloadPercentage: number;
        }[];
        skillGaps: {
            missingCapability: string;
            riskLevel: "low" | "medium" | "high";
            mitigationStrategy: string;
        }[];
        dataAvailability: {
            dataType: string;
            available: boolean;
            source?: string | undefined;
            acquisitionStrategy?: string | undefined;
        }[];
        expandedSolution: {
            name: string;
            description: string;
            workflow: string[];
            targetUsers: string[];
            problemSolved: string;
            keyFeatures: string[];
            requiredCapabilities: string[];
            technicalCapabilities: string[];
            complexityAreas: string[];
        };
        feasibility: {
            summary: string;
            score: number;
            teamStrengths: string[];
            teamWeaknesses: string[];
            timeRisk: "low" | "medium" | "high";
            technicalRisk: "low" | "medium" | "high";
            dataRisk: "low" | "medium" | "high";
            recommendations: string[];
        };
        techStackOptions: {
            name: string;
            description: string;
            optionId: string;
            rank: number;
            frontend: string[];
            backend: string[];
            database: string[];
            aiMl: string[];
            infrastructure: string[];
            otherTools: string[];
            architectureOverview: string;
            setupComplexity: "low" | "medium" | "high";
            timeToPrototype: string;
            merits: string[];
            demerits: string[];
            teamFitScore: number;
            overallScore: number;
        }[];
        overallTeamStrategy: string;
        selectedTechStack?: {
            name: string;
            description: string;
            optionId: string;
            rank: number;
            frontend: string[];
            backend: string[];
            database: string[];
            aiMl: string[];
            infrastructure: string[];
            otherTools: string[];
            architectureOverview: string;
            setupComplexity: "low" | "medium" | "high";
            timeToPrototype: string;
            merits: string[];
            demerits: string[];
            teamFitScore: number;
            overallScore: number;
        } | null | undefined;
    }>>>;
    architecture: z.ZodDefault<z.ZodNullable<z.ZodObject<{
        architectureId: z.ZodString;
        projectId: z.ZodString;
        selectedTechStack: z.ZodObject<{
            optionId: z.ZodString;
            name: z.ZodString;
            rationale: z.ZodString;
            teamFitScore: z.ZodNumber;
            components: z.ZodArray<z.ZodString, "many">;
        }, "strip", z.ZodTypeAny, {
            name: string;
            optionId: string;
            teamFitScore: number;
            rationale: string;
            components: string[];
        }, {
            name: string;
            optionId: string;
            teamFitScore: number;
            rationale: string;
            components: string[];
        }>;
        architectureOverview: z.ZodString;
        components: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            type: z.ZodEnum<["frontend", "backend", "ai_engine", "vector_db", "database", "cache", "background_service", "external_api", "other"]>;
            technology: z.ZodString;
            purpose: z.ZodString;
            responsibilities: z.ZodArray<z.ZodString, "many">;
            ports: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            dependencies: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            type: "other" | "frontend" | "backend" | "database" | "ai_engine" | "vector_db" | "cache" | "background_service" | "external_api";
            name: string;
            technology: string;
            purpose: string;
            responsibilities: string[];
            ports?: string[] | undefined;
            dependencies?: string[] | undefined;
        }, {
            type: "other" | "frontend" | "backend" | "database" | "ai_engine" | "vector_db" | "cache" | "background_service" | "external_api";
            name: string;
            technology: string;
            purpose: string;
            responsibilities: string[];
            ports?: string[] | undefined;
            dependencies?: string[] | undefined;
        }>, "many">;
        dataFlow: z.ZodArray<z.ZodObject<{
            step: z.ZodNumber;
            actor: z.ZodString;
            action: z.ZodString;
            system: z.ZodString;
            description: z.ZodString;
            dataPayload: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            description: string;
            step: number;
            action: string;
            actor: string;
            system: string;
            dataPayload?: string | undefined;
        }, {
            description: string;
            step: number;
            action: string;
            actor: string;
            system: string;
            dataPayload?: string | undefined;
        }>, "many">;
        databaseSchema: z.ZodArray<z.ZodObject<{
            collectionName: z.ZodString;
            purpose: z.ZodString;
            fields: z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                type: z.ZodString;
                required: z.ZodOptional<z.ZodBoolean>;
                indexed: z.ZodOptional<z.ZodBoolean>;
                description: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                type: string;
                name: string;
                description?: string | undefined;
                required?: boolean | undefined;
                indexed?: boolean | undefined;
            }, {
                type: string;
                name: string;
                description?: string | undefined;
                required?: boolean | undefined;
                indexed?: boolean | undefined;
            }>, "many">;
            indexes: z.ZodOptional<z.ZodArray<z.ZodObject<{
                fields: z.ZodArray<z.ZodString, "many">;
                type: z.ZodOptional<z.ZodEnum<["unique", "compound", "text", "single"]>>;
                reason: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                fields: string[];
                type?: "unique" | "compound" | "text" | "single" | undefined;
                reason?: string | undefined;
            }, {
                fields: string[];
                type?: "unique" | "compound" | "text" | "single" | undefined;
                reason?: string | undefined;
            }>, "many">>;
            relationships: z.ZodOptional<z.ZodArray<z.ZodObject<{
                type: z.ZodEnum<["reference", "embedding", "embedded"]>;
                targetCollection: z.ZodString;
                description: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                type: "reference" | "embedding" | "embedded";
                description: string;
                targetCollection: string;
            }, {
                type: "reference" | "embedding" | "embedded";
                description: string;
                targetCollection: string;
            }>, "many">>;
        }, "strip", z.ZodTypeAny, {
            purpose: string;
            collectionName: string;
            fields: {
                type: string;
                name: string;
                description?: string | undefined;
                required?: boolean | undefined;
                indexed?: boolean | undefined;
            }[];
            indexes?: {
                fields: string[];
                type?: "unique" | "compound" | "text" | "single" | undefined;
                reason?: string | undefined;
            }[] | undefined;
            relationships?: {
                type: "reference" | "embedding" | "embedded";
                description: string;
                targetCollection: string;
            }[] | undefined;
        }, {
            purpose: string;
            collectionName: string;
            fields: {
                type: string;
                name: string;
                description?: string | undefined;
                required?: boolean | undefined;
                indexed?: boolean | undefined;
            }[];
            indexes?: {
                fields: string[];
                type?: "unique" | "compound" | "text" | "single" | undefined;
                reason?: string | undefined;
            }[] | undefined;
            relationships?: {
                type: "reference" | "embedding" | "embedded";
                description: string;
                targetCollection: string;
            }[] | undefined;
        }>, "many">;
        apiContracts: z.ZodArray<z.ZodObject<{
            method: z.ZodEnum<["GET", "POST", "PUT", "PATCH", "DELETE"]>;
            path: z.ZodString;
            description: z.ZodString;
            authRequired: z.ZodOptional<z.ZodBoolean>;
            requestBody: z.ZodOptional<z.ZodObject<{
                contentType: z.ZodString;
                schema: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                contentType: string;
                schema: string;
            }, {
                contentType: string;
                schema: string;
            }>>;
            responseSchema: z.ZodString;
            rateLimit: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            path: string;
            description: string;
            method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
            responseSchema: string;
            authRequired?: boolean | undefined;
            requestBody?: {
                contentType: string;
                schema: string;
            } | undefined;
            rateLimit?: string | undefined;
        }, {
            path: string;
            description: string;
            method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
            responseSchema: string;
            authRequired?: boolean | undefined;
            requestBody?: {
                contentType: string;
                schema: string;
            } | undefined;
            rateLimit?: string | undefined;
        }>, "many">;
        aiArchitecture: z.ZodObject<{
            llmModels: z.ZodArray<z.ZodObject<{
                provider: z.ZodString;
                model: z.ZodString;
                purpose: z.ZodString;
                temperature: z.ZodOptional<z.ZodNumber>;
                maxTokens: z.ZodOptional<z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                purpose: string;
                provider: string;
                model: string;
                temperature?: number | undefined;
                maxTokens?: number | undefined;
            }, {
                purpose: string;
                provider: string;
                model: string;
                temperature?: number | undefined;
                maxTokens?: number | undefined;
            }>, "many">;
            prompts: z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                type: z.ZodEnum<["system", "user", "few_shot", "chain_of_thought"]>;
                purpose: z.ZodString;
                template: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                type: "user" | "system" | "few_shot" | "chain_of_thought";
                name: string;
                purpose: string;
                template?: string | undefined;
            }, {
                type: "user" | "system" | "few_shot" | "chain_of_thought";
                name: string;
                purpose: string;
                template?: string | undefined;
            }>, "many">;
            agentTools: z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                type: z.ZodEnum<["search", "code_execution", "web_scraping", "api_call", "file_operation", "other"]>;
                purpose: z.ZodString;
                integration: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                type: "other" | "search" | "code_execution" | "web_scraping" | "api_call" | "file_operation";
                name: string;
                integration: string;
                purpose: string;
            }, {
                type: "other" | "search" | "code_execution" | "web_scraping" | "api_call" | "file_operation";
                name: string;
                integration: string;
                purpose: string;
            }>, "many">;
            executionPipeline: z.ZodArray<z.ZodObject<{
                stage: z.ZodNumber;
                name: z.ZodString;
                description: z.ZodString;
                inputs: z.ZodArray<z.ZodString, "many">;
                outputs: z.ZodArray<z.ZodString, "many">;
            }, "strip", z.ZodTypeAny, {
                name: string;
                description: string;
                inputs: string[];
                outputs: string[];
                stage: number;
            }, {
                name: string;
                description: string;
                inputs: string[];
                outputs: string[];
                stage: number;
            }>, "many">;
            fallbackPolicies: z.ZodArray<z.ZodObject<{
                scenario: z.ZodString;
                strategy: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                scenario: string;
                strategy: string;
            }, {
                scenario: string;
                strategy: string;
            }>, "many">;
        }, "strip", z.ZodTypeAny, {
            llmModels: {
                purpose: string;
                provider: string;
                model: string;
                temperature?: number | undefined;
                maxTokens?: number | undefined;
            }[];
            prompts: {
                type: "user" | "system" | "few_shot" | "chain_of_thought";
                name: string;
                purpose: string;
                template?: string | undefined;
            }[];
            agentTools: {
                type: "other" | "search" | "code_execution" | "web_scraping" | "api_call" | "file_operation";
                name: string;
                integration: string;
                purpose: string;
            }[];
            executionPipeline: {
                name: string;
                description: string;
                inputs: string[];
                outputs: string[];
                stage: number;
            }[];
            fallbackPolicies: {
                scenario: string;
                strategy: string;
            }[];
        }, {
            llmModels: {
                purpose: string;
                provider: string;
                model: string;
                temperature?: number | undefined;
                maxTokens?: number | undefined;
            }[];
            prompts: {
                type: "user" | "system" | "few_shot" | "chain_of_thought";
                name: string;
                purpose: string;
                template?: string | undefined;
            }[];
            agentTools: {
                type: "other" | "search" | "code_execution" | "web_scraping" | "api_call" | "file_operation";
                name: string;
                integration: string;
                purpose: string;
            }[];
            executionPipeline: {
                name: string;
                description: string;
                inputs: string[];
                outputs: string[];
                stage: number;
            }[];
            fallbackPolicies: {
                scenario: string;
                strategy: string;
            }[];
        }>;
        ragArchitecture: z.ZodOptional<z.ZodObject<{
            vectorDbProvider: z.ZodString;
            embeddingModel: z.ZodString;
            chunkSize: z.ZodNumber;
            chunkOverlap: z.ZodNumber;
            retrievalTopK: z.ZodNumber;
            searchFilter: z.ZodOptional<z.ZodString>;
            indexingStrategy: z.ZodOptional<z.ZodString>;
            reranker: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            vectorDbProvider: string;
            embeddingModel: string;
            chunkSize: number;
            chunkOverlap: number;
            retrievalTopK: number;
            searchFilter?: string | undefined;
            indexingStrategy?: string | undefined;
            reranker?: string | undefined;
        }, {
            vectorDbProvider: string;
            embeddingModel: string;
            chunkSize: number;
            chunkOverlap: number;
            retrievalTopK: number;
            searchFilter?: string | undefined;
            indexingStrategy?: string | undefined;
            reranker?: string | undefined;
        }>>;
        externalServices: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            purpose: z.ZodString;
            authMethod: z.ZodString;
            rateLimit: z.ZodOptional<z.ZodString>;
            fallbackStrategy: z.ZodOptional<z.ZodString>;
            costTier: z.ZodOptional<z.ZodEnum<["free", "low", "medium", "high"]>>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            purpose: string;
            authMethod: string;
            rateLimit?: string | undefined;
            fallbackStrategy?: string | undefined;
            costTier?: "low" | "medium" | "high" | "free" | undefined;
        }, {
            name: string;
            purpose: string;
            authMethod: string;
            rateLimit?: string | undefined;
            fallbackStrategy?: string | undefined;
            costTier?: "low" | "medium" | "high" | "free" | undefined;
        }>, "many">;
        risks: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            description: z.ZodString;
            likelihood: z.ZodEnum<["low", "medium", "high"]>;
            impact: z.ZodEnum<["low", "medium", "high"]>;
            severity: z.ZodEnum<["low", "medium", "high", "critical"]>;
            mitigationStrategy: z.ZodString;
            affectedComponents: z.ZodArray<z.ZodString, "many">;
        }, "strip", z.ZodTypeAny, {
            description: string;
            severity: "low" | "medium" | "high" | "critical";
            id: string;
            impact: "low" | "medium" | "high";
            mitigationStrategy: string;
            likelihood: "low" | "medium" | "high";
            affectedComponents: string[];
        }, {
            description: string;
            severity: "low" | "medium" | "high" | "critical";
            id: string;
            impact: "low" | "medium" | "high";
            mitigationStrategy: string;
            likelihood: "low" | "medium" | "high";
            affectedComponents: string[];
        }>, "many">;
        implementationPlan: z.ZodArray<z.ZodObject<{
            phase: z.ZodNumber;
            name: z.ZodString;
            description: z.ZodString;
            duration: z.ZodString;
            deliverables: z.ZodArray<z.ZodString, "many">;
            tasks: z.ZodArray<z.ZodObject<{
                taskId: z.ZodString;
                name: z.ZodString;
                description: z.ZodString;
                assignedRole: z.ZodString;
                assignedMemberId: z.ZodOptional<z.ZodString>;
                estimatedHours: z.ZodNumber;
                dependencies: z.ZodArray<z.ZodString, "many">;
                priority: z.ZodEnum<["critical", "high", "medium", "low"]>;
                phase: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                name: string;
                description: string;
                priority: "low" | "medium" | "high" | "critical";
                dependencies: string[];
                taskId: string;
                assignedRole: string;
                estimatedHours: number;
                phase: number;
                assignedMemberId?: string | undefined;
            }, {
                name: string;
                description: string;
                priority: "low" | "medium" | "high" | "critical";
                dependencies: string[];
                taskId: string;
                assignedRole: string;
                estimatedHours: number;
                phase: number;
                assignedMemberId?: string | undefined;
            }>, "many">;
            exitCriteria: z.ZodArray<z.ZodString, "many">;
        }, "strip", z.ZodTypeAny, {
            name: string;
            description: string;
            phase: number;
            duration: string;
            deliverables: string[];
            tasks: {
                name: string;
                description: string;
                priority: "low" | "medium" | "high" | "critical";
                dependencies: string[];
                taskId: string;
                assignedRole: string;
                estimatedHours: number;
                phase: number;
                assignedMemberId?: string | undefined;
            }[];
            exitCriteria: string[];
        }, {
            name: string;
            description: string;
            phase: number;
            duration: string;
            deliverables: string[];
            tasks: {
                name: string;
                description: string;
                priority: "low" | "medium" | "high" | "critical";
                dependencies: string[];
                taskId: string;
                assignedRole: string;
                estimatedHours: number;
                phase: number;
                assignedMemberId?: string | undefined;
            }[];
            exitCriteria: string[];
        }>, "many">;
        hackathonTimeline: z.ZodObject<{
            totalHours: z.ZodNumber;
            phases: z.ZodArray<z.ZodObject<{
                phase: z.ZodNumber;
                name: z.ZodString;
                hours: z.ZodNumber;
                startHour: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                name: string;
                phase: number;
                hours: number;
                startHour: number;
            }, {
                name: string;
                phase: number;
                hours: number;
                startHour: number;
            }>, "many">;
        }, "strip", z.ZodTypeAny, {
            totalHours: number;
            phases: {
                name: string;
                phase: number;
                hours: number;
                startHour: number;
            }[];
        }, {
            totalHours: number;
            phases: {
                name: string;
                phase: number;
                hours: number;
                startHour: number;
            }[];
        }>;
        confidence: z.ZodNumber;
        estimatedDemoReadiness: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        confidence: number;
        architectureOverview: string;
        selectedTechStack: {
            name: string;
            optionId: string;
            teamFitScore: number;
            rationale: string;
            components: string[];
        };
        components: {
            type: "other" | "frontend" | "backend" | "database" | "ai_engine" | "vector_db" | "cache" | "background_service" | "external_api";
            name: string;
            technology: string;
            purpose: string;
            responsibilities: string[];
            ports?: string[] | undefined;
            dependencies?: string[] | undefined;
        }[];
        architectureId: string;
        projectId: string;
        dataFlow: {
            description: string;
            step: number;
            action: string;
            actor: string;
            system: string;
            dataPayload?: string | undefined;
        }[];
        databaseSchema: {
            purpose: string;
            collectionName: string;
            fields: {
                type: string;
                name: string;
                description?: string | undefined;
                required?: boolean | undefined;
                indexed?: boolean | undefined;
            }[];
            indexes?: {
                fields: string[];
                type?: "unique" | "compound" | "text" | "single" | undefined;
                reason?: string | undefined;
            }[] | undefined;
            relationships?: {
                type: "reference" | "embedding" | "embedded";
                description: string;
                targetCollection: string;
            }[] | undefined;
        }[];
        apiContracts: {
            path: string;
            description: string;
            method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
            responseSchema: string;
            authRequired?: boolean | undefined;
            requestBody?: {
                contentType: string;
                schema: string;
            } | undefined;
            rateLimit?: string | undefined;
        }[];
        aiArchitecture: {
            llmModels: {
                purpose: string;
                provider: string;
                model: string;
                temperature?: number | undefined;
                maxTokens?: number | undefined;
            }[];
            prompts: {
                type: "user" | "system" | "few_shot" | "chain_of_thought";
                name: string;
                purpose: string;
                template?: string | undefined;
            }[];
            agentTools: {
                type: "other" | "search" | "code_execution" | "web_scraping" | "api_call" | "file_operation";
                name: string;
                integration: string;
                purpose: string;
            }[];
            executionPipeline: {
                name: string;
                description: string;
                inputs: string[];
                outputs: string[];
                stage: number;
            }[];
            fallbackPolicies: {
                scenario: string;
                strategy: string;
            }[];
        };
        externalServices: {
            name: string;
            purpose: string;
            authMethod: string;
            rateLimit?: string | undefined;
            fallbackStrategy?: string | undefined;
            costTier?: "low" | "medium" | "high" | "free" | undefined;
        }[];
        risks: {
            description: string;
            severity: "low" | "medium" | "high" | "critical";
            id: string;
            impact: "low" | "medium" | "high";
            mitigationStrategy: string;
            likelihood: "low" | "medium" | "high";
            affectedComponents: string[];
        }[];
        implementationPlan: {
            name: string;
            description: string;
            phase: number;
            duration: string;
            deliverables: string[];
            tasks: {
                name: string;
                description: string;
                priority: "low" | "medium" | "high" | "critical";
                dependencies: string[];
                taskId: string;
                assignedRole: string;
                estimatedHours: number;
                phase: number;
                assignedMemberId?: string | undefined;
            }[];
            exitCriteria: string[];
        }[];
        hackathonTimeline: {
            totalHours: number;
            phases: {
                name: string;
                phase: number;
                hours: number;
                startHour: number;
            }[];
        };
        estimatedDemoReadiness: string;
        ragArchitecture?: {
            vectorDbProvider: string;
            embeddingModel: string;
            chunkSize: number;
            chunkOverlap: number;
            retrievalTopK: number;
            searchFilter?: string | undefined;
            indexingStrategy?: string | undefined;
            reranker?: string | undefined;
        } | undefined;
    }, {
        confidence: number;
        architectureOverview: string;
        selectedTechStack: {
            name: string;
            optionId: string;
            teamFitScore: number;
            rationale: string;
            components: string[];
        };
        components: {
            type: "other" | "frontend" | "backend" | "database" | "ai_engine" | "vector_db" | "cache" | "background_service" | "external_api";
            name: string;
            technology: string;
            purpose: string;
            responsibilities: string[];
            ports?: string[] | undefined;
            dependencies?: string[] | undefined;
        }[];
        architectureId: string;
        projectId: string;
        dataFlow: {
            description: string;
            step: number;
            action: string;
            actor: string;
            system: string;
            dataPayload?: string | undefined;
        }[];
        databaseSchema: {
            purpose: string;
            collectionName: string;
            fields: {
                type: string;
                name: string;
                description?: string | undefined;
                required?: boolean | undefined;
                indexed?: boolean | undefined;
            }[];
            indexes?: {
                fields: string[];
                type?: "unique" | "compound" | "text" | "single" | undefined;
                reason?: string | undefined;
            }[] | undefined;
            relationships?: {
                type: "reference" | "embedding" | "embedded";
                description: string;
                targetCollection: string;
            }[] | undefined;
        }[];
        apiContracts: {
            path: string;
            description: string;
            method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
            responseSchema: string;
            authRequired?: boolean | undefined;
            requestBody?: {
                contentType: string;
                schema: string;
            } | undefined;
            rateLimit?: string | undefined;
        }[];
        aiArchitecture: {
            llmModels: {
                purpose: string;
                provider: string;
                model: string;
                temperature?: number | undefined;
                maxTokens?: number | undefined;
            }[];
            prompts: {
                type: "user" | "system" | "few_shot" | "chain_of_thought";
                name: string;
                purpose: string;
                template?: string | undefined;
            }[];
            agentTools: {
                type: "other" | "search" | "code_execution" | "web_scraping" | "api_call" | "file_operation";
                name: string;
                integration: string;
                purpose: string;
            }[];
            executionPipeline: {
                name: string;
                description: string;
                inputs: string[];
                outputs: string[];
                stage: number;
            }[];
            fallbackPolicies: {
                scenario: string;
                strategy: string;
            }[];
        };
        externalServices: {
            name: string;
            purpose: string;
            authMethod: string;
            rateLimit?: string | undefined;
            fallbackStrategy?: string | undefined;
            costTier?: "low" | "medium" | "high" | "free" | undefined;
        }[];
        risks: {
            description: string;
            severity: "low" | "medium" | "high" | "critical";
            id: string;
            impact: "low" | "medium" | "high";
            mitigationStrategy: string;
            likelihood: "low" | "medium" | "high";
            affectedComponents: string[];
        }[];
        implementationPlan: {
            name: string;
            description: string;
            phase: number;
            duration: string;
            deliverables: string[];
            tasks: {
                name: string;
                description: string;
                priority: "low" | "medium" | "high" | "critical";
                dependencies: string[];
                taskId: string;
                assignedRole: string;
                estimatedHours: number;
                phase: number;
                assignedMemberId?: string | undefined;
            }[];
            exitCriteria: string[];
        }[];
        hackathonTimeline: {
            totalHours: number;
            phases: {
                name: string;
                phase: number;
                hours: number;
                startHour: number;
            }[];
        };
        estimatedDemoReadiness: string;
        ragArchitecture?: {
            vectorDbProvider: string;
            embeddingModel: string;
            chunkSize: number;
            chunkOverlap: number;
            retrievalTopK: number;
            searchFilter?: string | undefined;
            indexingStrategy?: string | undefined;
            reranker?: string | undefined;
        } | undefined;
    }>>>;
    judging: z.ZodDefault<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    improvementHistory: z.ZodDefault<z.ZodArray<z.ZodObject<{
        version: z.ZodNumber;
        score: z.ZodNumber;
        changedBy: z.ZodArray<z.ZodString, "many">;
        weaknessesAddressed: z.ZodArray<z.ZodString, "many">;
        summary: z.ZodString;
        timestamp: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        summary: string;
        score: number;
        version: number;
        changedBy: string[];
        weaknessesAddressed: string[];
        timestamp: string;
    }, {
        summary: string;
        score: number;
        version: number;
        changedBy: string[];
        weaknessesAddressed: string[];
        timestamp: string;
    }>, "many">>;
    selectedVersion: z.ZodDefault<z.ZodNumber>;
    build: z.ZodDefault<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    status: z.ZodDefault<z.ZodEnum<["idle", "running", "paused", "completed", "failed", "cancel_requested", "awaiting_selection"]>>;
    errors: z.ZodDefault<z.ZodArray<z.ZodObject<{
        agent: z.ZodString;
        node: z.ZodString;
        error: z.ZodString;
        timestamp: z.ZodString;
        recoverable: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        error: string;
        timestamp: string;
        agent: string;
        node: string;
        recoverable: boolean;
    }, {
        error: string;
        timestamp: string;
        agent: string;
        node: string;
        recoverable: boolean;
    }>, "many">>;
    usage: z.ZodDefault<z.ZodObject<{
        geminiCalls: z.ZodDefault<z.ZodNumber>;
        geminiSearchCalls: z.ZodDefault<z.ZodNumber>;
        deepseekCalls: z.ZodDefault<z.ZodNumber>;
        tavilyCalls: z.ZodDefault<z.ZodNumber>;
        githubCalls: z.ZodDefault<z.ZodNumber>;
        llmTokens: z.ZodDefault<z.ZodNumber>;
        cacheHits: z.ZodDefault<z.ZodNumber>;
        cacheMisses: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        geminiSearchCalls: number;
        geminiCalls: number;
        deepseekCalls: number;
        tavilyCalls: number;
        githubCalls: number;
        llmTokens: number;
        cacheHits: number;
        cacheMisses: number;
    }, {
        geminiSearchCalls?: number | undefined;
        geminiCalls?: number | undefined;
        deepseekCalls?: number | undefined;
        tavilyCalls?: number | undefined;
        githubCalls?: number | undefined;
        llmTokens?: number | undefined;
        cacheHits?: number | undefined;
        cacheMisses?: number | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    status: "failed" | "idle" | "running" | "paused" | "completed" | "cancel_requested" | "awaiting_selection";
    research: {
        researchId: string;
        summary: {
            queriesRun: number;
            geminiSearchCalls: number;
            tavilySearchCalls: number;
            githubSearchCalls: number;
            sourcesFound: number;
            uniqueSources: number;
            candidateEntities: number;
            relevantSolutions: number;
            directSolutions: number;
            adjacentSolutions: number;
            technicalApproaches: number;
            enrichedSolutions: number;
            discoveryRounds: number;
            enrichmentRounds: number;
        };
        sources: {
            domain: string;
            id: string;
            title: string;
            url: string;
            canonicalUrl: string;
            sourceType: "hackathon" | "other" | "open_source" | "research" | "github" | "product" | "startup" | "web" | "blog";
            discoveredBy: ("github" | "gemini" | "tavily")[];
            searchQueryIds: string[];
            retrievedAt: string;
            relevanceScore: number;
            authorityScore: number;
            extractionStatus: "success" | "partial" | "failed";
            metadata: Record<string, unknown>;
            snippet?: string | null | undefined;
            content?: string | null | undefined;
            publishedAt?: string | null | undefined;
        }[];
        discoveredSolutions: {
            name: string;
            description: string;
            confidence: number;
            workflow: {
                description: string;
                sourceIds: string[];
                step: number;
                action: string;
            }[];
            targetUsers: string[];
            id: string;
            sourceIds: string[];
            problemSolved: string;
            approach: string;
            features: {
                name: string;
                description: string;
                category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "collaboration" | "integration";
                sourceIds: string[];
            }[];
            inputs: string[];
            outputs: string[];
            technologies: string[];
            limitations: string[];
            relationToProblem: "technical" | "direct" | "adjacent";
            lastEnrichedAt: string;
            website?: string | null | undefined;
            githubRepository?: string | null | undefined;
        }[];
        coverage: {
            startups: boolean;
            hackathons: boolean;
            commercialProducts: boolean;
            githubRepos: boolean;
            researchPapers: boolean;
        };
        unresolvedQuestions: string[];
        contradictions: {
            status: "unresolved" | "resolved";
            sourceIds: string[];
            solutionId: string;
            field: string;
            conflictingValues: string[];
        }[];
        stoppingReason: "coverage_sufficient" | "diminishing_returns" | "max_iterations" | "budget_limit" | "provider_failure";
        quality: {
            evidenceQuality: "low" | "medium" | "high";
            coverageQuality: "low" | "medium" | "high";
        };
    } | null;
    projectId: string;
    input: {
        problemStatement: string;
        resumes: string[];
        githubLinks: {
            githubProfileUrl: string;
            username: string;
            role?: string | undefined;
        }[];
        hackathon?: {
            name?: string | undefined;
            description?: string | undefined;
            durationHours?: number | undefined;
            judgingCriteria?: {
                name: string;
                description?: string | undefined;
                weight?: number | undefined;
            }[] | undefined;
            rules?: string[] | undefined;
            restrictions?: string[] | undefined;
            allowedTechnologies?: string[] | undefined;
            forbiddenTechnologies?: string[] | undefined;
        } | undefined;
        userConstraints?: string[] | undefined;
        teamSize?: number | undefined;
    };
    problemAnalysis: {
        coreProblem: string;
        problemSummary: string;
        targetUsers: {
            role: string;
            context: string;
            evidence: "explicit" | "inferred";
            reason: string;
            painLevel?: number | null | undefined;
        }[];
        painPoints: {
            description: string;
            evidence: "explicit" | "inferred";
            reason: string;
            severity: "low" | "medium" | "high";
        }[];
        desiredOutcomes: {
            description: string;
            priority: "low" | "medium" | "high";
            measurable?: boolean | null | undefined;
        }[];
        explicitRequirements: {
            type: "functional" | "non_functional";
            description: string;
            evidence: "explicit" | "inferred";
            reason: string;
            priority: "must" | "should" | "could";
        }[];
        inferredRequirements: {
            type: "functional" | "non_functional";
            description: string;
            evidence: "explicit" | "inferred";
            reason: string;
            priority: "must" | "should" | "could";
        }[];
        constraints: {
            description: string;
            evidence: "explicit" | "inferred";
            severity: "low" | "medium" | "high";
            category: "hackathon" | "time" | "budget" | "technical" | "data" | "hardware" | "platform" | "user" | "regulatory" | "other";
        }[];
        domainKeywords: string[];
        synonyms: string[];
        relatedConcepts: string[];
        mechanisms: string[];
        assumptions: {
            reason: string;
            statement: string;
            confidence: number;
        }[];
        ambiguities: {
            severity: "low" | "medium" | "high";
            issue: string;
            whyItMatters: string;
            possibleInterpretations: string[];
        }[];
        researchQuestions: {
            priority: "low" | "medium" | "high";
            category: "hackathon" | "user" | "other" | "existing_solution" | "technology" | "workflow" | "market" | "limitation" | "open_source" | "research" | "technical_approaches";
            question: string;
        }[];
        researchDimensions: {
            name: "open_source" | "research" | "technical_approaches" | "commercial_products" | "startups" | "github" | "hackathons" | "blogs" | "adjacent_solutions";
            reason: string;
            priority: "low" | "medium" | "high";
            targetQueries: string[];
        }[];
        searchConcepts: {
            priority: "low" | "medium" | "high";
            category: "hackathon" | "user" | "technology" | "open_source" | "research" | "problem" | "domain" | "mechanism" | "product" | "startup";
            concept: string;
            searchQueries: string[];
        }[];
        successCriteria: string[];
        hackathonConsiderations: string[];
        analysisConfidence: number;
    } | null;
    innovation: {
        confidence: number;
        innovationId: string;
        candidateIdeas: {
            name: string;
            workflow: {
                description: string;
                sourceIds: string[];
                step: number;
                action: string;
            }[];
            targetUsers: string[];
            id: string;
            problemSolved: string;
            oneLineDescription: string;
            detailedDescription: string;
            keyFeatures: {
                name: string;
                description: string;
                category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "collaboration" | "integration";
                sourceIds: string[];
            }[];
            differentiators: {
                statement: string;
                evidenceSourceIds: string[];
                differenceType: "context" | "user" | "workflow" | "automation" | "integration" | "feature" | "constraint" | "combination";
                comparedToSolutionIds: string[];
                strength: number;
            }[];
            opportunityIds: string[];
            inspirationSources: string[];
            potentialRisks: string[];
            estimatedComplexity: "low" | "medium" | "high";
            estimatedHackathonFit: number;
            innovationScore: number;
            impactScore: number;
            differentiationScore: number;
            overallConceptScore: number;
        }[];
        selectedIdea: {
            name: string;
            workflow: {
                description: string;
                sourceIds: string[];
                step: number;
                action: string;
            }[];
            targetUsers: string[];
            id: string;
            problemSolved: string;
            oneLineDescription: string;
            detailedDescription: string;
            keyFeatures: {
                name: string;
                description: string;
                category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "collaboration" | "integration";
                sourceIds: string[];
            }[];
            differentiators: {
                statement: string;
                evidenceSourceIds: string[];
                differenceType: "context" | "user" | "workflow" | "automation" | "integration" | "feature" | "constraint" | "combination";
                comparedToSolutionIds: string[];
                strength: number;
            }[];
            opportunityIds: string[];
            inspirationSources: string[];
            potentialRisks: string[];
            estimatedComplexity: "low" | "medium" | "high";
            estimatedHackathonFit: number;
            innovationScore: number;
            impactScore: number;
            differentiationScore: number;
            overallConceptScore: number;
        } | null;
        solutionLandscape: {
            directSolutions: number;
            adjacentSolutions: number;
            totalSolutions: number;
            dominantApproaches: string[];
            majorSolutionClusters: {
                name: string;
                description: string;
                id: string;
                solutionIds: string[];
                commonFeatures: string[];
                distinguishingCharacteristics: string[];
            }[];
        };
        featureLandscape: {
            description: string;
            category: string;
            solutionIds: string[];
            featureId: string;
            canonicalName: string;
            occurrenceCount: number;
            totalRelevantSolutions: number;
            frequency: number;
            frequencyClass: "common" | "moderate" | "rare";
            variants: string[];
            evidenceSourceIds: string[];
        }[];
        identifiedGaps: {
            type: "context" | "data" | "user" | "other" | "workflow" | "automation" | "integration" | "feature" | "constraint";
            description: string;
            confidence: number;
            id: string;
            title: string;
            supportingSolutionIds: string[];
            supportingSourceIds: string[];
            impact: number;
        }[];
        differentiation: {
            summary: string;
            keyDifferentiators: {
                statement: string;
                evidenceSourceIds: string[];
                differenceType: "context" | "user" | "workflow" | "automation" | "integration" | "feature" | "constraint" | "combination";
                comparedToSolutionIds: string[];
                strength: number;
            }[];
        };
        noveltyAssessment: {
            confidence: number;
            evidenceSourceIds: string[];
            classification: "high_differentiation" | "moderate_differentiation" | "low_differentiation";
            score: number;
            reasoning: string;
            strongestDifferentiators: string[];
            majorOverlapAreas: string[];
            closestExistingSolutions: string[];
        };
        projectCapabilityRequirements: {
            requiredCapabilities: string[];
            technicalCapabilities: string[];
            domainCapabilities: string[];
            likelyTeamRoles: string[];
            complexityAreas: string[];
            potentialSkillGaps: string[];
            criticalDependencies: string[];
        };
        validationQuestions: string[];
    } | null;
    teamAnalysis: {
        teamMembers: {
            name: string;
            memberId: string;
            parsedSkills: string[];
            primaryRole: string;
            proficiencyLevels: Record<string, "beginner" | "intermediate" | "expert">;
            resumeSnippet: string;
            githubUsername?: string | undefined;
            yearsExperience?: number | undefined;
        }[];
        roleAssignments: {
            reasoning: string;
            roleTitle: string;
            assignedMemberId: string;
            assignedMemberName: string;
            assignedCapabilities: string[];
            assignedComponents: string[];
            workloadPercentage: number;
        }[];
        skillGaps: {
            missingCapability: string;
            riskLevel: "low" | "medium" | "high";
            mitigationStrategy: string;
        }[];
        dataAvailability: {
            dataType: string;
            available: boolean;
            source?: string | undefined;
            acquisitionStrategy?: string | undefined;
        }[];
        expandedSolution: {
            name: string;
            description: string;
            workflow: string[];
            targetUsers: string[];
            problemSolved: string;
            keyFeatures: string[];
            requiredCapabilities: string[];
            technicalCapabilities: string[];
            complexityAreas: string[];
        };
        feasibility: {
            summary: string;
            score: number;
            teamStrengths: string[];
            teamWeaknesses: string[];
            timeRisk: "low" | "medium" | "high";
            technicalRisk: "low" | "medium" | "high";
            dataRisk: "low" | "medium" | "high";
            recommendations: string[];
        };
        techStackOptions: {
            name: string;
            description: string;
            optionId: string;
            rank: number;
            frontend: string[];
            backend: string[];
            database: string[];
            aiMl: string[];
            infrastructure: string[];
            otherTools: string[];
            architectureOverview: string;
            setupComplexity: "low" | "medium" | "high";
            timeToPrototype: string;
            merits: string[];
            demerits: string[];
            teamFitScore: number;
            overallScore: number;
        }[];
        selectedTechStack: {
            name: string;
            description: string;
            optionId: string;
            rank: number;
            frontend: string[];
            backend: string[];
            database: string[];
            aiMl: string[];
            infrastructure: string[];
            otherTools: string[];
            architectureOverview: string;
            setupComplexity: "low" | "medium" | "high";
            timeToPrototype: string;
            merits: string[];
            demerits: string[];
            teamFitScore: number;
            overallScore: number;
        } | null;
        overallTeamStrategy: string;
    } | null;
    architecture: {
        confidence: number;
        architectureOverview: string;
        selectedTechStack: {
            name: string;
            optionId: string;
            teamFitScore: number;
            rationale: string;
            components: string[];
        };
        components: {
            type: "other" | "frontend" | "backend" | "database" | "ai_engine" | "vector_db" | "cache" | "background_service" | "external_api";
            name: string;
            technology: string;
            purpose: string;
            responsibilities: string[];
            ports?: string[] | undefined;
            dependencies?: string[] | undefined;
        }[];
        architectureId: string;
        projectId: string;
        dataFlow: {
            description: string;
            step: number;
            action: string;
            actor: string;
            system: string;
            dataPayload?: string | undefined;
        }[];
        databaseSchema: {
            purpose: string;
            collectionName: string;
            fields: {
                type: string;
                name: string;
                description?: string | undefined;
                required?: boolean | undefined;
                indexed?: boolean | undefined;
            }[];
            indexes?: {
                fields: string[];
                type?: "unique" | "compound" | "text" | "single" | undefined;
                reason?: string | undefined;
            }[] | undefined;
            relationships?: {
                type: "reference" | "embedding" | "embedded";
                description: string;
                targetCollection: string;
            }[] | undefined;
        }[];
        apiContracts: {
            path: string;
            description: string;
            method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
            responseSchema: string;
            authRequired?: boolean | undefined;
            requestBody?: {
                contentType: string;
                schema: string;
            } | undefined;
            rateLimit?: string | undefined;
        }[];
        aiArchitecture: {
            llmModels: {
                purpose: string;
                provider: string;
                model: string;
                temperature?: number | undefined;
                maxTokens?: number | undefined;
            }[];
            prompts: {
                type: "user" | "system" | "few_shot" | "chain_of_thought";
                name: string;
                purpose: string;
                template?: string | undefined;
            }[];
            agentTools: {
                type: "other" | "search" | "code_execution" | "web_scraping" | "api_call" | "file_operation";
                name: string;
                integration: string;
                purpose: string;
            }[];
            executionPipeline: {
                name: string;
                description: string;
                inputs: string[];
                outputs: string[];
                stage: number;
            }[];
            fallbackPolicies: {
                scenario: string;
                strategy: string;
            }[];
        };
        externalServices: {
            name: string;
            purpose: string;
            authMethod: string;
            rateLimit?: string | undefined;
            fallbackStrategy?: string | undefined;
            costTier?: "low" | "medium" | "high" | "free" | undefined;
        }[];
        risks: {
            description: string;
            severity: "low" | "medium" | "high" | "critical";
            id: string;
            impact: "low" | "medium" | "high";
            mitigationStrategy: string;
            likelihood: "low" | "medium" | "high";
            affectedComponents: string[];
        }[];
        implementationPlan: {
            name: string;
            description: string;
            phase: number;
            duration: string;
            deliverables: string[];
            tasks: {
                name: string;
                description: string;
                priority: "low" | "medium" | "high" | "critical";
                dependencies: string[];
                taskId: string;
                assignedRole: string;
                estimatedHours: number;
                phase: number;
                assignedMemberId?: string | undefined;
            }[];
            exitCriteria: string[];
        }[];
        hackathonTimeline: {
            totalHours: number;
            phases: {
                name: string;
                phase: number;
                hours: number;
                startHour: number;
            }[];
        };
        estimatedDemoReadiness: string;
        ragArchitecture?: {
            vectorDbProvider: string;
            embeddingModel: string;
            chunkSize: number;
            chunkOverlap: number;
            retrievalTopK: number;
            searchFilter?: string | undefined;
            indexingStrategy?: string | undefined;
            reranker?: string | undefined;
        } | undefined;
    } | null;
    judging: Record<string, unknown> | null;
    improvementHistory: {
        summary: string;
        score: number;
        version: number;
        changedBy: string[];
        weaknessesAddressed: string[];
        timestamp: string;
    }[];
    selectedVersion: number;
    build: Record<string, unknown> | null;
    errors: {
        error: string;
        timestamp: string;
        agent: string;
        node: string;
        recoverable: boolean;
    }[];
    usage: {
        geminiSearchCalls: number;
        geminiCalls: number;
        deepseekCalls: number;
        tavilyCalls: number;
        githubCalls: number;
        llmTokens: number;
        cacheHits: number;
        cacheMisses: number;
    };
}, {
    projectId: string;
    input: {
        problemStatement: string;
        resumes?: string[] | undefined;
        githubLinks?: {
            githubProfileUrl: string;
            username: string;
            role?: string | undefined;
        }[] | undefined;
        hackathon?: {
            name?: string | undefined;
            description?: string | undefined;
            durationHours?: number | undefined;
            judgingCriteria?: {
                name: string;
                description?: string | undefined;
                weight?: number | undefined;
            }[] | undefined;
            rules?: string[] | undefined;
            restrictions?: string[] | undefined;
            allowedTechnologies?: string[] | undefined;
            forbiddenTechnologies?: string[] | undefined;
        } | undefined;
        userConstraints?: string[] | undefined;
        teamSize?: number | undefined;
    };
    status?: "failed" | "idle" | "running" | "paused" | "completed" | "cancel_requested" | "awaiting_selection" | undefined;
    research?: {
        researchId: string;
        summary: {
            queriesRun: number;
            geminiSearchCalls: number;
            tavilySearchCalls: number;
            githubSearchCalls: number;
            sourcesFound: number;
            uniqueSources: number;
            candidateEntities: number;
            relevantSolutions: number;
            directSolutions: number;
            adjacentSolutions: number;
            technicalApproaches: number;
            enrichedSolutions: number;
            discoveryRounds: number;
            enrichmentRounds: number;
        };
        sources: {
            domain: string;
            id: string;
            title: string;
            url: string;
            canonicalUrl: string;
            sourceType: "hackathon" | "other" | "open_source" | "research" | "github" | "product" | "startup" | "web" | "blog";
            discoveredBy: ("github" | "gemini" | "tavily")[];
            searchQueryIds: string[];
            retrievedAt: string;
            relevanceScore: number;
            authorityScore: number;
            extractionStatus: "success" | "partial" | "failed";
            snippet?: string | null | undefined;
            content?: string | null | undefined;
            publishedAt?: string | null | undefined;
            metadata?: Record<string, unknown> | undefined;
        }[];
        discoveredSolutions: {
            name: string;
            description: string;
            confidence: number;
            workflow: {
                description: string;
                sourceIds: string[];
                step: number;
                action: string;
            }[];
            targetUsers: string[];
            id: string;
            sourceIds: string[];
            problemSolved: string;
            approach: string;
            features: {
                name: string;
                description: string;
                category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "collaboration" | "integration";
                sourceIds: string[];
            }[];
            inputs: string[];
            outputs: string[];
            technologies: string[];
            limitations: string[];
            relationToProblem: "technical" | "direct" | "adjacent";
            lastEnrichedAt: string;
            website?: string | null | undefined;
            githubRepository?: string | null | undefined;
        }[];
        coverage: {
            startups: boolean;
            hackathons: boolean;
            commercialProducts: boolean;
            githubRepos: boolean;
            researchPapers: boolean;
        };
        unresolvedQuestions: string[];
        contradictions: {
            status: "unresolved" | "resolved";
            sourceIds: string[];
            solutionId: string;
            field: string;
            conflictingValues: string[];
        }[];
        stoppingReason: "coverage_sufficient" | "diminishing_returns" | "max_iterations" | "budget_limit" | "provider_failure";
        quality: {
            evidenceQuality: "low" | "medium" | "high";
            coverageQuality: "low" | "medium" | "high";
        };
    } | null | undefined;
    problemAnalysis?: {
        coreProblem: string;
        problemSummary: string;
        targetUsers: {
            role: string;
            context: string;
            evidence: "explicit" | "inferred";
            reason: string;
            painLevel?: number | null | undefined;
        }[];
        painPoints: {
            description: string;
            evidence: "explicit" | "inferred";
            reason: string;
            severity: "low" | "medium" | "high";
        }[];
        desiredOutcomes: {
            description: string;
            priority: "low" | "medium" | "high";
            measurable?: boolean | null | undefined;
        }[];
        explicitRequirements: {
            type: "functional" | "non_functional";
            description: string;
            evidence: "explicit" | "inferred";
            reason: string;
            priority: "must" | "should" | "could";
        }[];
        inferredRequirements: {
            type: "functional" | "non_functional";
            description: string;
            evidence: "explicit" | "inferred";
            reason: string;
            priority: "must" | "should" | "could";
        }[];
        constraints: {
            description: string;
            evidence: "explicit" | "inferred";
            severity: "low" | "medium" | "high";
            category: "hackathon" | "time" | "budget" | "technical" | "data" | "hardware" | "platform" | "user" | "regulatory" | "other";
        }[];
        domainKeywords: string[];
        synonyms: string[];
        relatedConcepts: string[];
        mechanisms: string[];
        assumptions: {
            reason: string;
            statement: string;
            confidence: number;
        }[];
        ambiguities: {
            severity: "low" | "medium" | "high";
            issue: string;
            whyItMatters: string;
            possibleInterpretations: string[];
        }[];
        researchQuestions: {
            priority: "low" | "medium" | "high";
            category: "hackathon" | "user" | "other" | "existing_solution" | "technology" | "workflow" | "market" | "limitation" | "open_source" | "research" | "technical_approaches";
            question: string;
        }[];
        researchDimensions: {
            name: "open_source" | "research" | "technical_approaches" | "commercial_products" | "startups" | "github" | "hackathons" | "blogs" | "adjacent_solutions";
            reason: string;
            priority: "low" | "medium" | "high";
            targetQueries: string[];
        }[];
        searchConcepts: {
            priority: "low" | "medium" | "high";
            category: "hackathon" | "user" | "technology" | "open_source" | "research" | "problem" | "domain" | "mechanism" | "product" | "startup";
            concept: string;
            searchQueries: string[];
        }[];
        successCriteria: string[];
        hackathonConsiderations: string[];
        analysisConfidence: number;
    } | null | undefined;
    innovation?: {
        confidence: number;
        innovationId: string;
        candidateIdeas: {
            name: string;
            workflow: {
                description: string;
                sourceIds: string[];
                step: number;
                action: string;
            }[];
            targetUsers: string[];
            id: string;
            problemSolved: string;
            oneLineDescription: string;
            detailedDescription: string;
            keyFeatures: {
                name: string;
                description: string;
                category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "collaboration" | "integration";
                sourceIds: string[];
            }[];
            differentiators: {
                statement: string;
                evidenceSourceIds: string[];
                differenceType: "context" | "user" | "workflow" | "automation" | "integration" | "feature" | "constraint" | "combination";
                comparedToSolutionIds: string[];
                strength: number;
            }[];
            opportunityIds: string[];
            inspirationSources: string[];
            potentialRisks: string[];
            estimatedComplexity: "low" | "medium" | "high";
            estimatedHackathonFit: number;
            innovationScore: number;
            impactScore: number;
            differentiationScore: number;
            overallConceptScore: number;
        }[];
        solutionLandscape: {
            directSolutions: number;
            adjacentSolutions: number;
            totalSolutions: number;
            dominantApproaches: string[];
            majorSolutionClusters: {
                name: string;
                description: string;
                id: string;
                solutionIds: string[];
                commonFeatures: string[];
                distinguishingCharacteristics: string[];
            }[];
        };
        featureLandscape: {
            description: string;
            category: string;
            solutionIds: string[];
            featureId: string;
            canonicalName: string;
            occurrenceCount: number;
            totalRelevantSolutions: number;
            frequency: number;
            frequencyClass: "common" | "moderate" | "rare";
            variants: string[];
            evidenceSourceIds: string[];
        }[];
        identifiedGaps: {
            type: "context" | "data" | "user" | "other" | "workflow" | "automation" | "integration" | "feature" | "constraint";
            description: string;
            confidence: number;
            id: string;
            title: string;
            supportingSolutionIds: string[];
            supportingSourceIds: string[];
            impact: number;
        }[];
        differentiation: {
            summary: string;
            keyDifferentiators: {
                statement: string;
                evidenceSourceIds: string[];
                differenceType: "context" | "user" | "workflow" | "automation" | "integration" | "feature" | "constraint" | "combination";
                comparedToSolutionIds: string[];
                strength: number;
            }[];
        };
        noveltyAssessment: {
            confidence: number;
            evidenceSourceIds: string[];
            classification: "high_differentiation" | "moderate_differentiation" | "low_differentiation";
            score: number;
            reasoning: string;
            strongestDifferentiators: string[];
            majorOverlapAreas: string[];
            closestExistingSolutions: string[];
        };
        projectCapabilityRequirements: {
            requiredCapabilities: string[];
            technicalCapabilities: string[];
            domainCapabilities: string[];
            likelyTeamRoles: string[];
            complexityAreas: string[];
            potentialSkillGaps: string[];
            criticalDependencies: string[];
        };
        validationQuestions: string[];
        selectedIdea?: {
            name: string;
            workflow: {
                description: string;
                sourceIds: string[];
                step: number;
                action: string;
            }[];
            targetUsers: string[];
            id: string;
            problemSolved: string;
            oneLineDescription: string;
            detailedDescription: string;
            keyFeatures: {
                name: string;
                description: string;
                category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "collaboration" | "integration";
                sourceIds: string[];
            }[];
            differentiators: {
                statement: string;
                evidenceSourceIds: string[];
                differenceType: "context" | "user" | "workflow" | "automation" | "integration" | "feature" | "constraint" | "combination";
                comparedToSolutionIds: string[];
                strength: number;
            }[];
            opportunityIds: string[];
            inspirationSources: string[];
            potentialRisks: string[];
            estimatedComplexity: "low" | "medium" | "high";
            estimatedHackathonFit: number;
            innovationScore: number;
            impactScore: number;
            differentiationScore: number;
            overallConceptScore: number;
        } | null | undefined;
    } | null | undefined;
    teamAnalysis?: {
        teamMembers: {
            name: string;
            memberId: string;
            parsedSkills: string[];
            primaryRole: string;
            proficiencyLevels: Record<string, "beginner" | "intermediate" | "expert">;
            resumeSnippet: string;
            githubUsername?: string | undefined;
            yearsExperience?: number | undefined;
        }[];
        roleAssignments: {
            reasoning: string;
            roleTitle: string;
            assignedMemberId: string;
            assignedMemberName: string;
            assignedCapabilities: string[];
            assignedComponents: string[];
            workloadPercentage: number;
        }[];
        skillGaps: {
            missingCapability: string;
            riskLevel: "low" | "medium" | "high";
            mitigationStrategy: string;
        }[];
        dataAvailability: {
            dataType: string;
            available: boolean;
            source?: string | undefined;
            acquisitionStrategy?: string | undefined;
        }[];
        expandedSolution: {
            name: string;
            description: string;
            workflow: string[];
            targetUsers: string[];
            problemSolved: string;
            keyFeatures: string[];
            requiredCapabilities: string[];
            technicalCapabilities: string[];
            complexityAreas: string[];
        };
        feasibility: {
            summary: string;
            score: number;
            teamStrengths: string[];
            teamWeaknesses: string[];
            timeRisk: "low" | "medium" | "high";
            technicalRisk: "low" | "medium" | "high";
            dataRisk: "low" | "medium" | "high";
            recommendations: string[];
        };
        techStackOptions: {
            name: string;
            description: string;
            optionId: string;
            rank: number;
            frontend: string[];
            backend: string[];
            database: string[];
            aiMl: string[];
            infrastructure: string[];
            otherTools: string[];
            architectureOverview: string;
            setupComplexity: "low" | "medium" | "high";
            timeToPrototype: string;
            merits: string[];
            demerits: string[];
            teamFitScore: number;
            overallScore: number;
        }[];
        overallTeamStrategy: string;
        selectedTechStack?: {
            name: string;
            description: string;
            optionId: string;
            rank: number;
            frontend: string[];
            backend: string[];
            database: string[];
            aiMl: string[];
            infrastructure: string[];
            otherTools: string[];
            architectureOverview: string;
            setupComplexity: "low" | "medium" | "high";
            timeToPrototype: string;
            merits: string[];
            demerits: string[];
            teamFitScore: number;
            overallScore: number;
        } | null | undefined;
    } | null | undefined;
    architecture?: {
        confidence: number;
        architectureOverview: string;
        selectedTechStack: {
            name: string;
            optionId: string;
            teamFitScore: number;
            rationale: string;
            components: string[];
        };
        components: {
            type: "other" | "frontend" | "backend" | "database" | "ai_engine" | "vector_db" | "cache" | "background_service" | "external_api";
            name: string;
            technology: string;
            purpose: string;
            responsibilities: string[];
            ports?: string[] | undefined;
            dependencies?: string[] | undefined;
        }[];
        architectureId: string;
        projectId: string;
        dataFlow: {
            description: string;
            step: number;
            action: string;
            actor: string;
            system: string;
            dataPayload?: string | undefined;
        }[];
        databaseSchema: {
            purpose: string;
            collectionName: string;
            fields: {
                type: string;
                name: string;
                description?: string | undefined;
                required?: boolean | undefined;
                indexed?: boolean | undefined;
            }[];
            indexes?: {
                fields: string[];
                type?: "unique" | "compound" | "text" | "single" | undefined;
                reason?: string | undefined;
            }[] | undefined;
            relationships?: {
                type: "reference" | "embedding" | "embedded";
                description: string;
                targetCollection: string;
            }[] | undefined;
        }[];
        apiContracts: {
            path: string;
            description: string;
            method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
            responseSchema: string;
            authRequired?: boolean | undefined;
            requestBody?: {
                contentType: string;
                schema: string;
            } | undefined;
            rateLimit?: string | undefined;
        }[];
        aiArchitecture: {
            llmModels: {
                purpose: string;
                provider: string;
                model: string;
                temperature?: number | undefined;
                maxTokens?: number | undefined;
            }[];
            prompts: {
                type: "user" | "system" | "few_shot" | "chain_of_thought";
                name: string;
                purpose: string;
                template?: string | undefined;
            }[];
            agentTools: {
                type: "other" | "search" | "code_execution" | "web_scraping" | "api_call" | "file_operation";
                name: string;
                integration: string;
                purpose: string;
            }[];
            executionPipeline: {
                name: string;
                description: string;
                inputs: string[];
                outputs: string[];
                stage: number;
            }[];
            fallbackPolicies: {
                scenario: string;
                strategy: string;
            }[];
        };
        externalServices: {
            name: string;
            purpose: string;
            authMethod: string;
            rateLimit?: string | undefined;
            fallbackStrategy?: string | undefined;
            costTier?: "low" | "medium" | "high" | "free" | undefined;
        }[];
        risks: {
            description: string;
            severity: "low" | "medium" | "high" | "critical";
            id: string;
            impact: "low" | "medium" | "high";
            mitigationStrategy: string;
            likelihood: "low" | "medium" | "high";
            affectedComponents: string[];
        }[];
        implementationPlan: {
            name: string;
            description: string;
            phase: number;
            duration: string;
            deliverables: string[];
            tasks: {
                name: string;
                description: string;
                priority: "low" | "medium" | "high" | "critical";
                dependencies: string[];
                taskId: string;
                assignedRole: string;
                estimatedHours: number;
                phase: number;
                assignedMemberId?: string | undefined;
            }[];
            exitCriteria: string[];
        }[];
        hackathonTimeline: {
            totalHours: number;
            phases: {
                name: string;
                phase: number;
                hours: number;
                startHour: number;
            }[];
        };
        estimatedDemoReadiness: string;
        ragArchitecture?: {
            vectorDbProvider: string;
            embeddingModel: string;
            chunkSize: number;
            chunkOverlap: number;
            retrievalTopK: number;
            searchFilter?: string | undefined;
            indexingStrategy?: string | undefined;
            reranker?: string | undefined;
        } | undefined;
    } | null | undefined;
    judging?: Record<string, unknown> | null | undefined;
    improvementHistory?: {
        summary: string;
        score: number;
        version: number;
        changedBy: string[];
        weaknessesAddressed: string[];
        timestamp: string;
    }[] | undefined;
    selectedVersion?: number | undefined;
    build?: Record<string, unknown> | null | undefined;
    errors?: {
        error: string;
        timestamp: string;
        agent: string;
        node: string;
        recoverable: boolean;
    }[] | undefined;
    usage?: {
        geminiSearchCalls?: number | undefined;
        geminiCalls?: number | undefined;
        deepseekCalls?: number | undefined;
        tavilyCalls?: number | undefined;
        githubCalls?: number | undefined;
        llmTokens?: number | undefined;
        cacheHits?: number | undefined;
        cacheMisses?: number | undefined;
    } | undefined;
}>;
export type HackathonState = z.infer<typeof HackathonStateSchema>;
export declare function createInitialState(projectId: string, input: StrategistInput): HackathonState;
export declare const HackathonStateAnnotation: import("@langchain/langgraph").AnnotationRoot<{
    projectId: {
        (): import("@langchain/langgraph").LastValue<string>;
        (annotation: import("@langchain/langgraph").SingleReducer<string, string>): import("@langchain/langgraph").BinaryOperatorAggregate<string, string>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
    input: {
        (): import("@langchain/langgraph").LastValue<{
            problemStatement: string;
            resumes: string[];
            githubLinks: {
                githubProfileUrl: string;
                username: string;
                role?: string | undefined;
            }[];
            hackathon?: {
                name?: string | undefined;
                description?: string | undefined;
                durationHours?: number | undefined;
                judgingCriteria?: {
                    name: string;
                    description?: string | undefined;
                    weight?: number | undefined;
                }[] | undefined;
                rules?: string[] | undefined;
                restrictions?: string[] | undefined;
                allowedTechnologies?: string[] | undefined;
                forbiddenTechnologies?: string[] | undefined;
            } | undefined;
            userConstraints?: string[] | undefined;
            teamSize?: number | undefined;
        }>;
        (annotation: import("@langchain/langgraph").SingleReducer<{
            problemStatement: string;
            resumes: string[];
            githubLinks: {
                githubProfileUrl: string;
                username: string;
                role?: string | undefined;
            }[];
            hackathon?: {
                name?: string | undefined;
                description?: string | undefined;
                durationHours?: number | undefined;
                judgingCriteria?: {
                    name: string;
                    description?: string | undefined;
                    weight?: number | undefined;
                }[] | undefined;
                rules?: string[] | undefined;
                restrictions?: string[] | undefined;
                allowedTechnologies?: string[] | undefined;
                forbiddenTechnologies?: string[] | undefined;
            } | undefined;
            userConstraints?: string[] | undefined;
            teamSize?: number | undefined;
        }, {
            problemStatement: string;
            resumes: string[];
            githubLinks: {
                githubProfileUrl: string;
                username: string;
                role?: string | undefined;
            }[];
            hackathon?: {
                name?: string | undefined;
                description?: string | undefined;
                durationHours?: number | undefined;
                judgingCriteria?: {
                    name: string;
                    description?: string | undefined;
                    weight?: number | undefined;
                }[] | undefined;
                rules?: string[] | undefined;
                restrictions?: string[] | undefined;
                allowedTechnologies?: string[] | undefined;
                forbiddenTechnologies?: string[] | undefined;
            } | undefined;
            userConstraints?: string[] | undefined;
            teamSize?: number | undefined;
        }>): import("@langchain/langgraph").BinaryOperatorAggregate<{
            problemStatement: string;
            resumes: string[];
            githubLinks: {
                githubProfileUrl: string;
                username: string;
                role?: string | undefined;
            }[];
            hackathon?: {
                name?: string | undefined;
                description?: string | undefined;
                durationHours?: number | undefined;
                judgingCriteria?: {
                    name: string;
                    description?: string | undefined;
                    weight?: number | undefined;
                }[] | undefined;
                rules?: string[] | undefined;
                restrictions?: string[] | undefined;
                allowedTechnologies?: string[] | undefined;
                forbiddenTechnologies?: string[] | undefined;
            } | undefined;
            userConstraints?: string[] | undefined;
            teamSize?: number | undefined;
        }, {
            problemStatement: string;
            resumes: string[];
            githubLinks: {
                githubProfileUrl: string;
                username: string;
                role?: string | undefined;
            }[];
            hackathon?: {
                name?: string | undefined;
                description?: string | undefined;
                durationHours?: number | undefined;
                judgingCriteria?: {
                    name: string;
                    description?: string | undefined;
                    weight?: number | undefined;
                }[] | undefined;
                rules?: string[] | undefined;
                restrictions?: string[] | undefined;
                allowedTechnologies?: string[] | undefined;
                forbiddenTechnologies?: string[] | undefined;
            } | undefined;
            userConstraints?: string[] | undefined;
            teamSize?: number | undefined;
        }>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
    problemAnalysis: import("@langchain/langgraph").BinaryOperatorAggregate<{
        coreProblem: string;
        problemSummary: string;
        targetUsers: {
            role: string;
            context: string;
            evidence: "explicit" | "inferred";
            reason: string;
            painLevel?: number | null | undefined;
        }[];
        painPoints: {
            description: string;
            evidence: "explicit" | "inferred";
            reason: string;
            severity: "low" | "medium" | "high";
        }[];
        desiredOutcomes: {
            description: string;
            priority: "low" | "medium" | "high";
            measurable?: boolean | null | undefined;
        }[];
        explicitRequirements: {
            type: "functional" | "non_functional";
            description: string;
            evidence: "explicit" | "inferred";
            reason: string;
            priority: "must" | "should" | "could";
        }[];
        inferredRequirements: {
            type: "functional" | "non_functional";
            description: string;
            evidence: "explicit" | "inferred";
            reason: string;
            priority: "must" | "should" | "could";
        }[];
        constraints: {
            description: string;
            evidence: "explicit" | "inferred";
            severity: "low" | "medium" | "high";
            category: "hackathon" | "time" | "budget" | "technical" | "data" | "hardware" | "platform" | "user" | "regulatory" | "other";
        }[];
        domainKeywords: string[];
        synonyms: string[];
        relatedConcepts: string[];
        mechanisms: string[];
        assumptions: {
            reason: string;
            statement: string;
            confidence: number;
        }[];
        ambiguities: {
            severity: "low" | "medium" | "high";
            issue: string;
            whyItMatters: string;
            possibleInterpretations: string[];
        }[];
        researchQuestions: {
            priority: "low" | "medium" | "high";
            category: "hackathon" | "user" | "other" | "existing_solution" | "technology" | "workflow" | "market" | "limitation" | "open_source" | "research" | "technical_approaches";
            question: string;
        }[];
        researchDimensions: {
            name: "open_source" | "research" | "technical_approaches" | "commercial_products" | "startups" | "github" | "hackathons" | "blogs" | "adjacent_solutions";
            reason: string;
            priority: "low" | "medium" | "high";
            targetQueries: string[];
        }[];
        searchConcepts: {
            priority: "low" | "medium" | "high";
            category: "hackathon" | "user" | "technology" | "open_source" | "research" | "problem" | "domain" | "mechanism" | "product" | "startup";
            concept: string;
            searchQueries: string[];
        }[];
        successCriteria: string[];
        hackathonConsiderations: string[];
        analysisConfidence: number;
    } | null, {
        coreProblem: string;
        problemSummary: string;
        targetUsers: {
            role: string;
            context: string;
            evidence: "explicit" | "inferred";
            reason: string;
            painLevel?: number | null | undefined;
        }[];
        painPoints: {
            description: string;
            evidence: "explicit" | "inferred";
            reason: string;
            severity: "low" | "medium" | "high";
        }[];
        desiredOutcomes: {
            description: string;
            priority: "low" | "medium" | "high";
            measurable?: boolean | null | undefined;
        }[];
        explicitRequirements: {
            type: "functional" | "non_functional";
            description: string;
            evidence: "explicit" | "inferred";
            reason: string;
            priority: "must" | "should" | "could";
        }[];
        inferredRequirements: {
            type: "functional" | "non_functional";
            description: string;
            evidence: "explicit" | "inferred";
            reason: string;
            priority: "must" | "should" | "could";
        }[];
        constraints: {
            description: string;
            evidence: "explicit" | "inferred";
            severity: "low" | "medium" | "high";
            category: "hackathon" | "time" | "budget" | "technical" | "data" | "hardware" | "platform" | "user" | "regulatory" | "other";
        }[];
        domainKeywords: string[];
        synonyms: string[];
        relatedConcepts: string[];
        mechanisms: string[];
        assumptions: {
            reason: string;
            statement: string;
            confidence: number;
        }[];
        ambiguities: {
            severity: "low" | "medium" | "high";
            issue: string;
            whyItMatters: string;
            possibleInterpretations: string[];
        }[];
        researchQuestions: {
            priority: "low" | "medium" | "high";
            category: "hackathon" | "user" | "other" | "existing_solution" | "technology" | "workflow" | "market" | "limitation" | "open_source" | "research" | "technical_approaches";
            question: string;
        }[];
        researchDimensions: {
            name: "open_source" | "research" | "technical_approaches" | "commercial_products" | "startups" | "github" | "hackathons" | "blogs" | "adjacent_solutions";
            reason: string;
            priority: "low" | "medium" | "high";
            targetQueries: string[];
        }[];
        searchConcepts: {
            priority: "low" | "medium" | "high";
            category: "hackathon" | "user" | "technology" | "open_source" | "research" | "problem" | "domain" | "mechanism" | "product" | "startup";
            concept: string;
            searchQueries: string[];
        }[];
        successCriteria: string[];
        hackathonConsiderations: string[];
        analysisConfidence: number;
    } | null>;
    research: import("@langchain/langgraph").BinaryOperatorAggregate<{
        researchId: string;
        summary: {
            queriesRun: number;
            geminiSearchCalls: number;
            tavilySearchCalls: number;
            githubSearchCalls: number;
            sourcesFound: number;
            uniqueSources: number;
            candidateEntities: number;
            relevantSolutions: number;
            directSolutions: number;
            adjacentSolutions: number;
            technicalApproaches: number;
            enrichedSolutions: number;
            discoveryRounds: number;
            enrichmentRounds: number;
        };
        sources: {
            domain: string;
            id: string;
            title: string;
            url: string;
            canonicalUrl: string;
            sourceType: "hackathon" | "other" | "open_source" | "research" | "github" | "product" | "startup" | "web" | "blog";
            discoveredBy: ("github" | "gemini" | "tavily")[];
            searchQueryIds: string[];
            retrievedAt: string;
            relevanceScore: number;
            authorityScore: number;
            extractionStatus: "success" | "partial" | "failed";
            metadata: Record<string, unknown>;
            snippet?: string | null | undefined;
            content?: string | null | undefined;
            publishedAt?: string | null | undefined;
        }[];
        discoveredSolutions: {
            name: string;
            description: string;
            confidence: number;
            workflow: {
                description: string;
                sourceIds: string[];
                step: number;
                action: string;
            }[];
            targetUsers: string[];
            id: string;
            sourceIds: string[];
            problemSolved: string;
            approach: string;
            features: {
                name: string;
                description: string;
                category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "collaboration" | "integration";
                sourceIds: string[];
            }[];
            inputs: string[];
            outputs: string[];
            technologies: string[];
            limitations: string[];
            relationToProblem: "technical" | "direct" | "adjacent";
            lastEnrichedAt: string;
            website?: string | null | undefined;
            githubRepository?: string | null | undefined;
        }[];
        coverage: {
            startups: boolean;
            hackathons: boolean;
            commercialProducts: boolean;
            githubRepos: boolean;
            researchPapers: boolean;
        };
        unresolvedQuestions: string[];
        contradictions: {
            status: "unresolved" | "resolved";
            sourceIds: string[];
            solutionId: string;
            field: string;
            conflictingValues: string[];
        }[];
        stoppingReason: "coverage_sufficient" | "diminishing_returns" | "max_iterations" | "budget_limit" | "provider_failure";
        quality: {
            evidenceQuality: "low" | "medium" | "high";
            coverageQuality: "low" | "medium" | "high";
        };
    } | null, {
        researchId: string;
        summary: {
            queriesRun: number;
            geminiSearchCalls: number;
            tavilySearchCalls: number;
            githubSearchCalls: number;
            sourcesFound: number;
            uniqueSources: number;
            candidateEntities: number;
            relevantSolutions: number;
            directSolutions: number;
            adjacentSolutions: number;
            technicalApproaches: number;
            enrichedSolutions: number;
            discoveryRounds: number;
            enrichmentRounds: number;
        };
        sources: {
            domain: string;
            id: string;
            title: string;
            url: string;
            canonicalUrl: string;
            sourceType: "hackathon" | "other" | "open_source" | "research" | "github" | "product" | "startup" | "web" | "blog";
            discoveredBy: ("github" | "gemini" | "tavily")[];
            searchQueryIds: string[];
            retrievedAt: string;
            relevanceScore: number;
            authorityScore: number;
            extractionStatus: "success" | "partial" | "failed";
            metadata: Record<string, unknown>;
            snippet?: string | null | undefined;
            content?: string | null | undefined;
            publishedAt?: string | null | undefined;
        }[];
        discoveredSolutions: {
            name: string;
            description: string;
            confidence: number;
            workflow: {
                description: string;
                sourceIds: string[];
                step: number;
                action: string;
            }[];
            targetUsers: string[];
            id: string;
            sourceIds: string[];
            problemSolved: string;
            approach: string;
            features: {
                name: string;
                description: string;
                category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "collaboration" | "integration";
                sourceIds: string[];
            }[];
            inputs: string[];
            outputs: string[];
            technologies: string[];
            limitations: string[];
            relationToProblem: "technical" | "direct" | "adjacent";
            lastEnrichedAt: string;
            website?: string | null | undefined;
            githubRepository?: string | null | undefined;
        }[];
        coverage: {
            startups: boolean;
            hackathons: boolean;
            commercialProducts: boolean;
            githubRepos: boolean;
            researchPapers: boolean;
        };
        unresolvedQuestions: string[];
        contradictions: {
            status: "unresolved" | "resolved";
            sourceIds: string[];
            solutionId: string;
            field: string;
            conflictingValues: string[];
        }[];
        stoppingReason: "coverage_sufficient" | "diminishing_returns" | "max_iterations" | "budget_limit" | "provider_failure";
        quality: {
            evidenceQuality: "low" | "medium" | "high";
            coverageQuality: "low" | "medium" | "high";
        };
    } | null>;
    innovation: import("@langchain/langgraph").BinaryOperatorAggregate<{
        confidence: number;
        innovationId: string;
        candidateIdeas: {
            name: string;
            workflow: {
                description: string;
                sourceIds: string[];
                step: number;
                action: string;
            }[];
            targetUsers: string[];
            id: string;
            problemSolved: string;
            oneLineDescription: string;
            detailedDescription: string;
            keyFeatures: {
                name: string;
                description: string;
                category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "collaboration" | "integration";
                sourceIds: string[];
            }[];
            differentiators: {
                statement: string;
                evidenceSourceIds: string[];
                differenceType: "context" | "user" | "workflow" | "automation" | "integration" | "feature" | "constraint" | "combination";
                comparedToSolutionIds: string[];
                strength: number;
            }[];
            opportunityIds: string[];
            inspirationSources: string[];
            potentialRisks: string[];
            estimatedComplexity: "low" | "medium" | "high";
            estimatedHackathonFit: number;
            innovationScore: number;
            impactScore: number;
            differentiationScore: number;
            overallConceptScore: number;
        }[];
        selectedIdea: {
            name: string;
            workflow: {
                description: string;
                sourceIds: string[];
                step: number;
                action: string;
            }[];
            targetUsers: string[];
            id: string;
            problemSolved: string;
            oneLineDescription: string;
            detailedDescription: string;
            keyFeatures: {
                name: string;
                description: string;
                category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "collaboration" | "integration";
                sourceIds: string[];
            }[];
            differentiators: {
                statement: string;
                evidenceSourceIds: string[];
                differenceType: "context" | "user" | "workflow" | "automation" | "integration" | "feature" | "constraint" | "combination";
                comparedToSolutionIds: string[];
                strength: number;
            }[];
            opportunityIds: string[];
            inspirationSources: string[];
            potentialRisks: string[];
            estimatedComplexity: "low" | "medium" | "high";
            estimatedHackathonFit: number;
            innovationScore: number;
            impactScore: number;
            differentiationScore: number;
            overallConceptScore: number;
        } | null;
        solutionLandscape: {
            directSolutions: number;
            adjacentSolutions: number;
            totalSolutions: number;
            dominantApproaches: string[];
            majorSolutionClusters: {
                name: string;
                description: string;
                id: string;
                solutionIds: string[];
                commonFeatures: string[];
                distinguishingCharacteristics: string[];
            }[];
        };
        featureLandscape: {
            description: string;
            category: string;
            solutionIds: string[];
            featureId: string;
            canonicalName: string;
            occurrenceCount: number;
            totalRelevantSolutions: number;
            frequency: number;
            frequencyClass: "common" | "moderate" | "rare";
            variants: string[];
            evidenceSourceIds: string[];
        }[];
        identifiedGaps: {
            type: "context" | "data" | "user" | "other" | "workflow" | "automation" | "integration" | "feature" | "constraint";
            description: string;
            confidence: number;
            id: string;
            title: string;
            supportingSolutionIds: string[];
            supportingSourceIds: string[];
            impact: number;
        }[];
        differentiation: {
            summary: string;
            keyDifferentiators: {
                statement: string;
                evidenceSourceIds: string[];
                differenceType: "context" | "user" | "workflow" | "automation" | "integration" | "feature" | "constraint" | "combination";
                comparedToSolutionIds: string[];
                strength: number;
            }[];
        };
        noveltyAssessment: {
            confidence: number;
            evidenceSourceIds: string[];
            classification: "high_differentiation" | "moderate_differentiation" | "low_differentiation";
            score: number;
            reasoning: string;
            strongestDifferentiators: string[];
            majorOverlapAreas: string[];
            closestExistingSolutions: string[];
        };
        projectCapabilityRequirements: {
            requiredCapabilities: string[];
            technicalCapabilities: string[];
            domainCapabilities: string[];
            likelyTeamRoles: string[];
            complexityAreas: string[];
            potentialSkillGaps: string[];
            criticalDependencies: string[];
        };
        validationQuestions: string[];
    } | null, {
        confidence: number;
        innovationId: string;
        candidateIdeas: {
            name: string;
            workflow: {
                description: string;
                sourceIds: string[];
                step: number;
                action: string;
            }[];
            targetUsers: string[];
            id: string;
            problemSolved: string;
            oneLineDescription: string;
            detailedDescription: string;
            keyFeatures: {
                name: string;
                description: string;
                category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "collaboration" | "integration";
                sourceIds: string[];
            }[];
            differentiators: {
                statement: string;
                evidenceSourceIds: string[];
                differenceType: "context" | "user" | "workflow" | "automation" | "integration" | "feature" | "constraint" | "combination";
                comparedToSolutionIds: string[];
                strength: number;
            }[];
            opportunityIds: string[];
            inspirationSources: string[];
            potentialRisks: string[];
            estimatedComplexity: "low" | "medium" | "high";
            estimatedHackathonFit: number;
            innovationScore: number;
            impactScore: number;
            differentiationScore: number;
            overallConceptScore: number;
        }[];
        selectedIdea: {
            name: string;
            workflow: {
                description: string;
                sourceIds: string[];
                step: number;
                action: string;
            }[];
            targetUsers: string[];
            id: string;
            problemSolved: string;
            oneLineDescription: string;
            detailedDescription: string;
            keyFeatures: {
                name: string;
                description: string;
                category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "collaboration" | "integration";
                sourceIds: string[];
            }[];
            differentiators: {
                statement: string;
                evidenceSourceIds: string[];
                differenceType: "context" | "user" | "workflow" | "automation" | "integration" | "feature" | "constraint" | "combination";
                comparedToSolutionIds: string[];
                strength: number;
            }[];
            opportunityIds: string[];
            inspirationSources: string[];
            potentialRisks: string[];
            estimatedComplexity: "low" | "medium" | "high";
            estimatedHackathonFit: number;
            innovationScore: number;
            impactScore: number;
            differentiationScore: number;
            overallConceptScore: number;
        } | null;
        solutionLandscape: {
            directSolutions: number;
            adjacentSolutions: number;
            totalSolutions: number;
            dominantApproaches: string[];
            majorSolutionClusters: {
                name: string;
                description: string;
                id: string;
                solutionIds: string[];
                commonFeatures: string[];
                distinguishingCharacteristics: string[];
            }[];
        };
        featureLandscape: {
            description: string;
            category: string;
            solutionIds: string[];
            featureId: string;
            canonicalName: string;
            occurrenceCount: number;
            totalRelevantSolutions: number;
            frequency: number;
            frequencyClass: "common" | "moderate" | "rare";
            variants: string[];
            evidenceSourceIds: string[];
        }[];
        identifiedGaps: {
            type: "context" | "data" | "user" | "other" | "workflow" | "automation" | "integration" | "feature" | "constraint";
            description: string;
            confidence: number;
            id: string;
            title: string;
            supportingSolutionIds: string[];
            supportingSourceIds: string[];
            impact: number;
        }[];
        differentiation: {
            summary: string;
            keyDifferentiators: {
                statement: string;
                evidenceSourceIds: string[];
                differenceType: "context" | "user" | "workflow" | "automation" | "integration" | "feature" | "constraint" | "combination";
                comparedToSolutionIds: string[];
                strength: number;
            }[];
        };
        noveltyAssessment: {
            confidence: number;
            evidenceSourceIds: string[];
            classification: "high_differentiation" | "moderate_differentiation" | "low_differentiation";
            score: number;
            reasoning: string;
            strongestDifferentiators: string[];
            majorOverlapAreas: string[];
            closestExistingSolutions: string[];
        };
        projectCapabilityRequirements: {
            requiredCapabilities: string[];
            technicalCapabilities: string[];
            domainCapabilities: string[];
            likelyTeamRoles: string[];
            complexityAreas: string[];
            potentialSkillGaps: string[];
            criticalDependencies: string[];
        };
        validationQuestions: string[];
    } | null>;
    teamAnalysis: import("@langchain/langgraph").BinaryOperatorAggregate<{
        teamMembers: {
            name: string;
            memberId: string;
            parsedSkills: string[];
            primaryRole: string;
            proficiencyLevels: Record<string, "beginner" | "intermediate" | "expert">;
            resumeSnippet: string;
            githubUsername?: string | undefined;
            yearsExperience?: number | undefined;
        }[];
        roleAssignments: {
            reasoning: string;
            roleTitle: string;
            assignedMemberId: string;
            assignedMemberName: string;
            assignedCapabilities: string[];
            assignedComponents: string[];
            workloadPercentage: number;
        }[];
        skillGaps: {
            missingCapability: string;
            riskLevel: "low" | "medium" | "high";
            mitigationStrategy: string;
        }[];
        dataAvailability: {
            dataType: string;
            available: boolean;
            source?: string | undefined;
            acquisitionStrategy?: string | undefined;
        }[];
        expandedSolution: {
            name: string;
            description: string;
            workflow: string[];
            targetUsers: string[];
            problemSolved: string;
            keyFeatures: string[];
            requiredCapabilities: string[];
            technicalCapabilities: string[];
            complexityAreas: string[];
        };
        feasibility: {
            summary: string;
            score: number;
            teamStrengths: string[];
            teamWeaknesses: string[];
            timeRisk: "low" | "medium" | "high";
            technicalRisk: "low" | "medium" | "high";
            dataRisk: "low" | "medium" | "high";
            recommendations: string[];
        };
        techStackOptions: {
            name: string;
            description: string;
            optionId: string;
            rank: number;
            frontend: string[];
            backend: string[];
            database: string[];
            aiMl: string[];
            infrastructure: string[];
            otherTools: string[];
            architectureOverview: string;
            setupComplexity: "low" | "medium" | "high";
            timeToPrototype: string;
            merits: string[];
            demerits: string[];
            teamFitScore: number;
            overallScore: number;
        }[];
        selectedTechStack: {
            name: string;
            description: string;
            optionId: string;
            rank: number;
            frontend: string[];
            backend: string[];
            database: string[];
            aiMl: string[];
            infrastructure: string[];
            otherTools: string[];
            architectureOverview: string;
            setupComplexity: "low" | "medium" | "high";
            timeToPrototype: string;
            merits: string[];
            demerits: string[];
            teamFitScore: number;
            overallScore: number;
        } | null;
        overallTeamStrategy: string;
    } | null, {
        teamMembers: {
            name: string;
            memberId: string;
            parsedSkills: string[];
            primaryRole: string;
            proficiencyLevels: Record<string, "beginner" | "intermediate" | "expert">;
            resumeSnippet: string;
            githubUsername?: string | undefined;
            yearsExperience?: number | undefined;
        }[];
        roleAssignments: {
            reasoning: string;
            roleTitle: string;
            assignedMemberId: string;
            assignedMemberName: string;
            assignedCapabilities: string[];
            assignedComponents: string[];
            workloadPercentage: number;
        }[];
        skillGaps: {
            missingCapability: string;
            riskLevel: "low" | "medium" | "high";
            mitigationStrategy: string;
        }[];
        dataAvailability: {
            dataType: string;
            available: boolean;
            source?: string | undefined;
            acquisitionStrategy?: string | undefined;
        }[];
        expandedSolution: {
            name: string;
            description: string;
            workflow: string[];
            targetUsers: string[];
            problemSolved: string;
            keyFeatures: string[];
            requiredCapabilities: string[];
            technicalCapabilities: string[];
            complexityAreas: string[];
        };
        feasibility: {
            summary: string;
            score: number;
            teamStrengths: string[];
            teamWeaknesses: string[];
            timeRisk: "low" | "medium" | "high";
            technicalRisk: "low" | "medium" | "high";
            dataRisk: "low" | "medium" | "high";
            recommendations: string[];
        };
        techStackOptions: {
            name: string;
            description: string;
            optionId: string;
            rank: number;
            frontend: string[];
            backend: string[];
            database: string[];
            aiMl: string[];
            infrastructure: string[];
            otherTools: string[];
            architectureOverview: string;
            setupComplexity: "low" | "medium" | "high";
            timeToPrototype: string;
            merits: string[];
            demerits: string[];
            teamFitScore: number;
            overallScore: number;
        }[];
        selectedTechStack: {
            name: string;
            description: string;
            optionId: string;
            rank: number;
            frontend: string[];
            backend: string[];
            database: string[];
            aiMl: string[];
            infrastructure: string[];
            otherTools: string[];
            architectureOverview: string;
            setupComplexity: "low" | "medium" | "high";
            timeToPrototype: string;
            merits: string[];
            demerits: string[];
            teamFitScore: number;
            overallScore: number;
        } | null;
        overallTeamStrategy: string;
    } | null>;
    architecture: import("@langchain/langgraph").BinaryOperatorAggregate<{
        confidence: number;
        architectureOverview: string;
        selectedTechStack: {
            name: string;
            optionId: string;
            teamFitScore: number;
            rationale: string;
            components: string[];
        };
        components: {
            type: "other" | "frontend" | "backend" | "database" | "ai_engine" | "vector_db" | "cache" | "background_service" | "external_api";
            name: string;
            technology: string;
            purpose: string;
            responsibilities: string[];
            ports?: string[] | undefined;
            dependencies?: string[] | undefined;
        }[];
        architectureId: string;
        projectId: string;
        dataFlow: {
            description: string;
            step: number;
            action: string;
            actor: string;
            system: string;
            dataPayload?: string | undefined;
        }[];
        databaseSchema: {
            purpose: string;
            collectionName: string;
            fields: {
                type: string;
                name: string;
                description?: string | undefined;
                required?: boolean | undefined;
                indexed?: boolean | undefined;
            }[];
            indexes?: {
                fields: string[];
                type?: "unique" | "compound" | "text" | "single" | undefined;
                reason?: string | undefined;
            }[] | undefined;
            relationships?: {
                type: "reference" | "embedding" | "embedded";
                description: string;
                targetCollection: string;
            }[] | undefined;
        }[];
        apiContracts: {
            path: string;
            description: string;
            method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
            responseSchema: string;
            authRequired?: boolean | undefined;
            requestBody?: {
                contentType: string;
                schema: string;
            } | undefined;
            rateLimit?: string | undefined;
        }[];
        aiArchitecture: {
            llmModels: {
                purpose: string;
                provider: string;
                model: string;
                temperature?: number | undefined;
                maxTokens?: number | undefined;
            }[];
            prompts: {
                type: "user" | "system" | "few_shot" | "chain_of_thought";
                name: string;
                purpose: string;
                template?: string | undefined;
            }[];
            agentTools: {
                type: "other" | "search" | "code_execution" | "web_scraping" | "api_call" | "file_operation";
                name: string;
                integration: string;
                purpose: string;
            }[];
            executionPipeline: {
                name: string;
                description: string;
                inputs: string[];
                outputs: string[];
                stage: number;
            }[];
            fallbackPolicies: {
                scenario: string;
                strategy: string;
            }[];
        };
        externalServices: {
            name: string;
            purpose: string;
            authMethod: string;
            rateLimit?: string | undefined;
            fallbackStrategy?: string | undefined;
            costTier?: "low" | "medium" | "high" | "free" | undefined;
        }[];
        risks: {
            description: string;
            severity: "low" | "medium" | "high" | "critical";
            id: string;
            impact: "low" | "medium" | "high";
            mitigationStrategy: string;
            likelihood: "low" | "medium" | "high";
            affectedComponents: string[];
        }[];
        implementationPlan: {
            name: string;
            description: string;
            phase: number;
            duration: string;
            deliverables: string[];
            tasks: {
                name: string;
                description: string;
                priority: "low" | "medium" | "high" | "critical";
                dependencies: string[];
                taskId: string;
                assignedRole: string;
                estimatedHours: number;
                phase: number;
                assignedMemberId?: string | undefined;
            }[];
            exitCriteria: string[];
        }[];
        hackathonTimeline: {
            totalHours: number;
            phases: {
                name: string;
                phase: number;
                hours: number;
                startHour: number;
            }[];
        };
        estimatedDemoReadiness: string;
        ragArchitecture?: {
            vectorDbProvider: string;
            embeddingModel: string;
            chunkSize: number;
            chunkOverlap: number;
            retrievalTopK: number;
            searchFilter?: string | undefined;
            indexingStrategy?: string | undefined;
            reranker?: string | undefined;
        } | undefined;
    } | null, {
        confidence: number;
        architectureOverview: string;
        selectedTechStack: {
            name: string;
            optionId: string;
            teamFitScore: number;
            rationale: string;
            components: string[];
        };
        components: {
            type: "other" | "frontend" | "backend" | "database" | "ai_engine" | "vector_db" | "cache" | "background_service" | "external_api";
            name: string;
            technology: string;
            purpose: string;
            responsibilities: string[];
            ports?: string[] | undefined;
            dependencies?: string[] | undefined;
        }[];
        architectureId: string;
        projectId: string;
        dataFlow: {
            description: string;
            step: number;
            action: string;
            actor: string;
            system: string;
            dataPayload?: string | undefined;
        }[];
        databaseSchema: {
            purpose: string;
            collectionName: string;
            fields: {
                type: string;
                name: string;
                description?: string | undefined;
                required?: boolean | undefined;
                indexed?: boolean | undefined;
            }[];
            indexes?: {
                fields: string[];
                type?: "unique" | "compound" | "text" | "single" | undefined;
                reason?: string | undefined;
            }[] | undefined;
            relationships?: {
                type: "reference" | "embedding" | "embedded";
                description: string;
                targetCollection: string;
            }[] | undefined;
        }[];
        apiContracts: {
            path: string;
            description: string;
            method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
            responseSchema: string;
            authRequired?: boolean | undefined;
            requestBody?: {
                contentType: string;
                schema: string;
            } | undefined;
            rateLimit?: string | undefined;
        }[];
        aiArchitecture: {
            llmModels: {
                purpose: string;
                provider: string;
                model: string;
                temperature?: number | undefined;
                maxTokens?: number | undefined;
            }[];
            prompts: {
                type: "user" | "system" | "few_shot" | "chain_of_thought";
                name: string;
                purpose: string;
                template?: string | undefined;
            }[];
            agentTools: {
                type: "other" | "search" | "code_execution" | "web_scraping" | "api_call" | "file_operation";
                name: string;
                integration: string;
                purpose: string;
            }[];
            executionPipeline: {
                name: string;
                description: string;
                inputs: string[];
                outputs: string[];
                stage: number;
            }[];
            fallbackPolicies: {
                scenario: string;
                strategy: string;
            }[];
        };
        externalServices: {
            name: string;
            purpose: string;
            authMethod: string;
            rateLimit?: string | undefined;
            fallbackStrategy?: string | undefined;
            costTier?: "low" | "medium" | "high" | "free" | undefined;
        }[];
        risks: {
            description: string;
            severity: "low" | "medium" | "high" | "critical";
            id: string;
            impact: "low" | "medium" | "high";
            mitigationStrategy: string;
            likelihood: "low" | "medium" | "high";
            affectedComponents: string[];
        }[];
        implementationPlan: {
            name: string;
            description: string;
            phase: number;
            duration: string;
            deliverables: string[];
            tasks: {
                name: string;
                description: string;
                priority: "low" | "medium" | "high" | "critical";
                dependencies: string[];
                taskId: string;
                assignedRole: string;
                estimatedHours: number;
                phase: number;
                assignedMemberId?: string | undefined;
            }[];
            exitCriteria: string[];
        }[];
        hackathonTimeline: {
            totalHours: number;
            phases: {
                name: string;
                phase: number;
                hours: number;
                startHour: number;
            }[];
        };
        estimatedDemoReadiness: string;
        ragArchitecture?: {
            vectorDbProvider: string;
            embeddingModel: string;
            chunkSize: number;
            chunkOverlap: number;
            retrievalTopK: number;
            searchFilter?: string | undefined;
            indexingStrategy?: string | undefined;
            reranker?: string | undefined;
        } | undefined;
    } | null>;
    judging: import("@langchain/langgraph").BinaryOperatorAggregate<Record<string, unknown> | null, Record<string, unknown> | null>;
    improvementHistory: import("@langchain/langgraph").BinaryOperatorAggregate<{
        summary: string;
        score: number;
        version: number;
        changedBy: string[];
        weaknessesAddressed: string[];
        timestamp: string;
    }[], {
        summary: string;
        score: number;
        version: number;
        changedBy: string[];
        weaknessesAddressed: string[];
        timestamp: string;
    }[]>;
    selectedVersion: import("@langchain/langgraph").BinaryOperatorAggregate<number, number>;
    build: import("@langchain/langgraph").BinaryOperatorAggregate<Record<string, unknown> | null, Record<string, unknown> | null>;
    status: import("@langchain/langgraph").BinaryOperatorAggregate<"failed" | "idle" | "running" | "paused" | "completed" | "cancel_requested" | "awaiting_selection", "failed" | "idle" | "running" | "paused" | "completed" | "cancel_requested" | "awaiting_selection">;
    errors: import("@langchain/langgraph").BinaryOperatorAggregate<{
        error: string;
        timestamp: string;
        agent: string;
        node: string;
        recoverable: boolean;
    }[], {
        error: string;
        timestamp: string;
        agent: string;
        node: string;
        recoverable: boolean;
    }[]>;
    usage: import("@langchain/langgraph").BinaryOperatorAggregate<{
        geminiSearchCalls: number;
        geminiCalls: number;
        deepseekCalls: number;
        tavilyCalls: number;
        githubCalls: number;
        llmTokens: number;
        cacheHits: number;
        cacheMisses: number;
    }, {
        geminiSearchCalls: number;
        geminiCalls: number;
        deepseekCalls: number;
        tavilyCalls: number;
        githubCalls: number;
        llmTokens: number;
        cacheHits: number;
        cacheMisses: number;
    }>;
}>;
//# sourceMappingURL=state.d.ts.map