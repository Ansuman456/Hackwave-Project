import mongoose, { Document } from "mongoose";
import { UsageMetricsSchema } from "../graph/state";
import { z } from "zod";
type UsageMetrics = z.infer<typeof UsageMetricsSchema>;
export interface IHackathonProject extends Document {
    projectId: string;
    problemStatement: string;
    resumes?: string[];
    githubLinks?: Array<{
        githubProfileUrl: string;
        username: string;
        role?: string;
    }>;
    workflowState?: Record<string, unknown>;
    hackathon?: {
        name?: string;
        description?: string;
        durationHours?: number;
        judgingCriteria?: Array<{
            name: string;
            weight?: number;
            description?: string;
        }>;
        rules?: string[];
        restrictions?: string[];
        allowedTechnologies?: string[];
        forbiddenTechnologies?: string[];
    };
    userConstraints?: string[];
    teamSize?: number;
    status: "idle" | "running" | "paused" | "completed" | "failed" | "cancel_requested" | "awaiting_selection";
    lastError?: string;
    executionErrors?: Array<{
        agent: string;
        node: string;
        error: string;
        timestamp: string;
    }>;
    usage: UsageMetrics;
    createdAt: Date;
    updatedAt: Date;
}
export declare const HackathonProject: mongoose.Model<IHackathonProject, {}, {}, {}, mongoose.Document<unknown, {}, IHackathonProject, {}, {}> & IHackathonProject & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export declare function addUsageMetrics(projectId: string, partial: Partial<UsageMetrics>): Promise<void>;
export {};
//# sourceMappingURL=HackathonProject.model.d.ts.map