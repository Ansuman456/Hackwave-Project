import mongoose, { Document } from "mongoose";
import { InnovationResult } from "../graph/state";
export interface IInnovationResult extends Document {
    projectId: string;
    innovationId: string;
    status: "running" | "completed" | "failed";
    candidateCount: number;
    selectedCandidateId?: string;
    result?: InnovationResult;
    startedAt: Date;
    completedAt?: Date;
    error?: string;
}
export declare const InnovationResultModel: mongoose.Model<IInnovationResult, {}, {}, {}, mongoose.Document<unknown, {}, IInnovationResult, {}, {}> & IInnovationResult & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export declare function createInnovationRun(projectId: string, innovationId: string): Promise<IInnovationResult>;
export declare function persistInnovationResult(projectId: string, result: InnovationResult): Promise<void>;
export declare function selectCandidate(projectId: string, candidateId: string): Promise<void>;
//# sourceMappingURL=InnovationResult.model.d.ts.map