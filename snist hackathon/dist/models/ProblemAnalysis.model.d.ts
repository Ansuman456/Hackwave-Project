import mongoose, { Document } from "mongoose";
import { ProblemAnalysis } from "../graph/state";
export interface IProblemAnalysisRecord extends Document {
    projectId: string;
    agent: string;
    version: number;
    output: ProblemAnalysis;
    createdAt: Date;
    updatedAt: Date;
}
export declare const ProblemAnalysisRecord: mongoose.Model<IProblemAnalysisRecord, {}, {}, {}, mongoose.Document<unknown, {}, IProblemAnalysisRecord, {}, {}> & IProblemAnalysisRecord & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export declare function persistProblemAnalysis(projectId: string, analysis: ProblemAnalysis): Promise<void>;
//# sourceMappingURL=ProblemAnalysis.model.d.ts.map