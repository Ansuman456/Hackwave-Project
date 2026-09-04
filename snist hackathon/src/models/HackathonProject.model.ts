import mongoose, { Schema, Document } from "mongoose";
import { UsageMetricsSchema } from "../graph/state";
import { z } from "zod";

type UsageMetrics = z.infer<typeof UsageMetricsSchema>;

export interface IHackathonProject extends Document {
  projectId: string;
  problemStatement: string;
  resumes?: string[];
  githubLinks?: Array<{ githubProfileUrl: string; username: string; role?: string }>;
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

const HackathonProjectSchema = new Schema<IHackathonProject>(
  {
    projectId: { type: String, required: true, unique: true },
    problemStatement: { type: String, required: true },
    resumes: { type: [String], default: [] },
    githubLinks: {
      type: [
        {
          githubProfileUrl: { type: String, required: true },
          username: { type: String, required: true },
          role: { type: String },
        },
      ],
      default: [],
    },
    workflowState: { type: Schema.Types.Mixed, default: null },
    hackathon: {
      name: String,
      description: String,
      durationHours: Number,
      judgingCriteria: [
        {
          name: String,
          weight: Number,
          description: String,
        },
      ],
      rules: [String],
      restrictions: [String],
      allowedTechnologies: [String],
      forbiddenTechnologies: [String],
    },
    userConstraints: [String],
    teamSize: Number,
    status: {
      type: String,
      enum: ["idle", "running", "paused", "completed", "failed", "cancel_requested", "awaiting_selection"],
      default: "idle",
    },
    lastError: { type: String, default: "" },
    executionErrors: [
      {
        agent: String,
        node: String,
        error: String,
        timestamp: String,
      },
    ],
    usage: {
      geminiCalls: { type: Number, default: 0 },
      geminiSearchCalls: { type: Number, default: 0 },
      deepseekCalls: { type: Number, default: 0 },
      tavilyCalls: { type: Number, default: 0 },
      githubCalls: { type: Number, default: 0 },
      llmTokens: { type: Number, default: 0 },
      cacheHits: { type: Number, default: 0 },
      cacheMisses: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

export const HackathonProject = mongoose.model<IHackathonProject>(
  "HackathonProject",
  HackathonProjectSchema
);

export async function addUsageMetrics(
  projectId: string,
  partial: Partial<UsageMetrics>
): Promise<void> {
  const update: Record<string, number> = {};

  // Use explicit undefined checks instead of truthy checks.
  // Truthy checks would skip 0 values, which is incorrect when a caller
  // explicitly passes a field set to 0.
  if (partial.geminiCalls !== undefined) update["usage.geminiCalls"] = partial.geminiCalls;
  if (partial.geminiSearchCalls !== undefined)
    update["usage.geminiSearchCalls"] = partial.geminiSearchCalls;
  if (partial.deepseekCalls !== undefined)
    update["usage.deepseekCalls"] = partial.deepseekCalls;
  if (partial.tavilyCalls !== undefined) update["usage.tavilyCalls"] = partial.tavilyCalls;
  if (partial.githubCalls !== undefined) update["usage.githubCalls"] = partial.githubCalls;
  if (partial.llmTokens !== undefined) update["usage.llmTokens"] = partial.llmTokens;
  if (partial.cacheHits !== undefined) update["usage.cacheHits"] = partial.cacheHits;
  if (partial.cacheMisses !== undefined) update["usage.cacheMisses"] = partial.cacheMisses;

  if (Object.keys(update).length > 0) {
    await HackathonProject.findOneAndUpdate(
      { projectId },
      { $inc: update },
      { new: true }
    );
  }

  // Sync search-related metrics to active ResearchRun document
  const rrUpdate: Record<string, number> = {};
  if (partial.geminiSearchCalls !== undefined)
    rrUpdate["metrics.geminiSearchCalls"] = partial.geminiSearchCalls;
  if (partial.tavilyCalls !== undefined)
    rrUpdate["metrics.tavilySearchCalls"] = partial.tavilyCalls;
  if (partial.githubCalls !== undefined)
    rrUpdate["metrics.githubSearchCalls"] = partial.githubCalls;

  const searchTotal =
    (partial.geminiSearchCalls || 0) +
    (partial.tavilyCalls || 0) +
    (partial.githubCalls || 0);
  if (searchTotal > 0) {
    rrUpdate["metrics.totalSearchCalls"] = searchTotal;
  }

  if (Object.keys(rrUpdate).length > 0) {
    try {
      const { ResearchRun } = await import("./ResearchRun.model");
      await ResearchRun.findOneAndUpdate(
        { projectId, status: "running" },
        { $inc: rrUpdate }
      );
    } catch (syncErr) {
      console.error("[addUsageMetrics] Failed to sync metrics to ResearchRun:", syncErr);
    }
  }
}
