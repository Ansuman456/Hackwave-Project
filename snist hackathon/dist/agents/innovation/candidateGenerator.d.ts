import { ProblemAnalysis, ResearchResult, CandidateIdea, InnovationGap, FeatureLandscape, SolutionCluster } from "../../graph/state";
import { z } from "zod";
declare const CandidateOutputSchema: z.ZodObject<{
    candidates: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        oneLineDescription: z.ZodString;
        detailedDescription: z.ZodString;
        targetUsers: z.ZodArray<z.ZodString, "many">;
        problemSolved: z.ZodString;
        keyFeatures: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            description: z.ZodString;
            category: z.ZodEnum<["core", "ai", "automation", "workflow", "analytics", "collab", "integration", "other"]>;
            sourceIds: z.ZodArray<z.ZodString, "many">;
        }, "strip", z.ZodTypeAny, {
            name: string;
            description: string;
            category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "integration" | "collab";
            sourceIds: string[];
        }, {
            name: string;
            description: string;
            category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "integration" | "collab";
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
            category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "integration" | "collab";
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
            category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "integration" | "collab";
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
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    candidates: {
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
            category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "integration" | "collab";
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
    }[];
}, {
    candidates: {
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
            category: "other" | "workflow" | "core" | "ai" | "automation" | "analytics" | "integration" | "collab";
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
    }[];
}>;
export type CandidateOutput = z.infer<typeof CandidateOutputSchema>;
export declare function generateCandidates(problemAnalysis: ProblemAnalysis, research: ResearchResult, gaps: InnovationGap[], featureLandscape: FeatureLandscape[], clusters: SolutionCluster[]): Promise<CandidateIdea[]>;
export {};
//# sourceMappingURL=candidateGenerator.d.ts.map