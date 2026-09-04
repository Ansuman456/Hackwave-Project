import mongoose, { Document } from "mongoose";
import { TeamAnalysis } from "../graph/state";
export interface TeamAnalysisRecord extends Document {
    projectId: string;
    teamAnalysisId: string;
    status: "running" | "completed" | "failed";
    teamMemberCount: number;
    feasibilityScore: number;
    techStackOptionCount: number;
    selectedTechStackId: string | null;
    result: TeamAnalysis | null;
    error: string | null;
    startedAt: Date;
    completedAt: Date;
}
interface TeamAnalysisLean {
    projectId: string;
    teamAnalysisId: string;
    status: "running" | "completed" | "failed";
    teamMemberCount: number;
    feasibilityScore: number;
    techStackOptionCount: number;
    selectedTechStackId: string | null;
    result: TeamAnalysis | null;
    error: string | null;
    startedAt: Date;
    completedAt: Date;
    _id: unknown;
}
export declare const TeamAnalysisRecordModel: mongoose.Model<any, {}, {}, {}, any, any>;
export declare function persistTeamAnalysis(projectId: string, teamAnalysis: TeamAnalysis): Promise<void>;
export declare function selectTechStack(projectId: string, optionId: string): Promise<TeamAnalysisLean | null>;
export declare function getTeamAnalysis(projectId: string): Promise<TeamAnalysisLean | null>;
export {};
//# sourceMappingURL=TeamAnalysis.model.d.ts.map