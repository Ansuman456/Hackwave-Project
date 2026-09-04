import mongoose, { Document } from "mongoose";
import { ArchitectureResult } from "../graph/state";
export interface ArchitectureResultRecord extends Document {
    projectId: string;
    architectureId: string;
    status: "running" | "completed" | "failed";
    componentCount: number;
    collectionCount: number;
    endpointCount: number;
    confidence: number;
    selectedTechStackId: string;
    result: ArchitectureResult | null;
    error: string | null;
    startedAt: Date;
    completedAt: Date;
}
export declare const ArchitectureResultModel: mongoose.Model<any, {}, {}, {}, any, any>;
export declare function persistArchitectureResult(projectId: string, result: ArchitectureResult): Promise<void>;
export declare function markArchitectureRunning(projectId: string, architectureId: string): Promise<void>;
export declare function markArchitectureFailed(projectId: string, error: string): Promise<void>;
export declare function getArchitectureResult(projectId: string): Promise<ArchitectureResultRecord | null>;
//# sourceMappingURL=ArchitectureResult.model.d.ts.map