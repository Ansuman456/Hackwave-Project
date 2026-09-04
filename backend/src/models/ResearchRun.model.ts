import mongoose, { Schema, Document } from "mongoose";
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

const ResearchRunSchema = new Schema<IResearchRun>(
  {
    projectId: { type: String, required: true, index: true },
    researchId: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ["running", "completed", "failed", "partial"],
      default: "running",
    },
    mode: {
      type: String,
      enum: ["fast", "balanced", "deep"],
      default: "balanced",
    },
    budget: {
      maxDiscoveryRounds: { type: Number, default: 3 },
      maxInitialQueries: { type: Number, default: 10 },
      maxCandidatesForEnrichment: { type: Number, default: 15 },
      maxEnrichmentRoundsPerCandidate: { type: Number, default: 2 },
    },
    metrics: {
      geminiSearchCalls: { type: Number, default: 0 },
      tavilySearchCalls: { type: Number, default: 0 },
      githubSearchCalls: { type: Number, default: 0 },
      totalSearchCalls: { type: Number, default: 0 },
      sourcesFound: { type: Number, default: 0 },
      uniqueSources: { type: Number, default: 0 },
      candidateEntities: { type: Number, default: 0 },
      enrichedSolutions: { type: Number, default: 0 },
    },
    stoppingReason: { type: String },
    result: { type: Schema.Types.Mixed },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
    error: { type: String },
  },
  {
    timestamps: true,
  }
);

ResearchRunSchema.index({ projectId: 1, researchId: 1 }, { unique: true });

export const ResearchRun = mongoose.model<IResearchRun>(
  "ResearchRun",
  ResearchRunSchema
);

export async function createResearchRun(
  projectId: string,
  researchId: string,
  mode: ResearchMode,
  budget: any
): Promise<IResearchRun> {
  return ResearchRun.create({
    projectId,
    researchId,
    status: "running",
    mode,
    budget,
    metrics: {
      geminiSearchCalls: 0,
      tavilySearchCalls: 0,
      githubSearchCalls: 0,
      totalSearchCalls: 0,
      sourcesFound: 0,
      uniqueSources: 0,
      candidateEntities: 0,
      enrichedSolutions: 0,
    },
    startedAt: new Date(),
  });
}

export async function updateResearchMetrics(
  researchId: string,
  metrics: Partial<IResearchRun["metrics"]>
): Promise<void> {
  const update: Record<string, number> = {};
  if (metrics.sourcesFound !== undefined) update["metrics.sourcesFound"] = metrics.sourcesFound;
  if (metrics.uniqueSources !== undefined) update["metrics.uniqueSources"] = metrics.uniqueSources;
  if (metrics.candidateEntities !== undefined) update["metrics.candidateEntities"] = metrics.candidateEntities;
  if (metrics.enrichedSolutions !== undefined) update["metrics.enrichedSolutions"] = metrics.enrichedSolutions;
  if (metrics.geminiSearchCalls !== undefined) update["metrics.geminiSearchCalls"] = metrics.geminiSearchCalls;
  if (metrics.tavilySearchCalls !== undefined) update["metrics.tavilySearchCalls"] = metrics.tavilySearchCalls;
  if (metrics.githubSearchCalls !== undefined) update["metrics.githubSearchCalls"] = metrics.githubSearchCalls;
  if (metrics.totalSearchCalls !== undefined) update["metrics.totalSearchCalls"] = metrics.totalSearchCalls;

  await ResearchRun.findOneAndUpdate(
    { researchId },
    { $set: update }
  );
}

export async function completeResearchRun(
  researchId: string,
  status: "completed" | "failed" | "partial",
  result?: ResearchResult,
  stoppingReason?: string,
  error?: string
): Promise<void> {
  await ResearchRun.findOneAndUpdate(
    { researchId },
    {
      status,
      result,
      stoppingReason,
      error,
      completedAt: new Date(),
    }
  );
}

export async function persistResearchResult(
  projectId: string,
  result: ResearchResult
): Promise<void> {
  await ResearchRun.findOneAndUpdate(
    { projectId, researchId: result.researchId },
    {
      status: "completed",
      result,
      completedAt: new Date(),
    },
    { upsert: true, new: true }
  );
}
