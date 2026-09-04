import mongoose, { Document } from "mongoose";
import { ResearchResult } from "../graph/state";
import { ResearchMode } from "../config/research.config";
export interface IResearchRun extends Document {
    projectId: string;
    researchId: string;
    status: "running" | "completed" | "failed" | "partial";
    mode: ResearchMode;
    budget: {
        maxDiscoveryRounds: number;
        maxInitialQueries: number;
        maxCandidatesForEnrichment: number;
        maxEnrichmentRoundsPerCandidate: number;
    };
    metrics: {
        geminiSearchCalls: number;
        tavilySearchCalls: number;
        githubSearchCalls: number;
        totalSearchCalls: number;
        sourcesFound: number;
        uniqueSources: number;
        candidateEntities: number;
        enrichedSolutions: number;
    };
    stoppingReason?: string;
    result?: ResearchResult;
    startedAt: Date;
    completedAt?: Date;
    error?: string;
}
export declare const ResearchRun: mongoose.Model<IResearchRun, {}, {}, {}, mongoose.Document<unknown, {}, IResearchRun, {}, {}> & IResearchRun & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export declare function createResearchRun(projectId: string, researchId: string, mode: ResearchMode, budget: any): Promise<IResearchRun>;
export declare function updateResearchMetrics(researchId: string, metrics: Partial<IResearchRun["metrics"]>): Promise<void>;
export declare function completeResearchRun(researchId: string, status: "completed" | "failed" | "partial", result?: ResearchResult, stoppingReason?: string, error?: string): Promise<void>;
export declare function persistResearchResult(projectId: string, result: ResearchResult): Promise<void>;
//# sourceMappingURL=ResearchRun.model.d.ts.map