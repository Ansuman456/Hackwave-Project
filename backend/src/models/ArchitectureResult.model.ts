import mongoose, { Schema, Document } from "mongoose";
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

const ArchitectureResultRecordSchema = new Schema<ArchitectureResultRecord>(
  {
    projectId: { type: String, required: true, index: true },
    architectureId: { type: String, required: true },
    status: {
      type: String,
      enum: ["running", "completed", "failed"],
      default: "running",
    },
    componentCount: { type: Number, default: 0 },
    collectionCount: { type: Number, default: 0 },
    endpointCount: { type: Number, default: 0 },
    confidence: { type: Number, default: 0 },
    selectedTechStackId: { type: String, default: "" },
    result: { type: Schema.Types.Mixed, default: null },
    error: { type: String, default: null },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

ArchitectureResultRecordSchema.index({ projectId: 1, createdAt: -1 });

export const ArchitectureResultModel =
  mongoose.models.ArchitectureResult ||
  mongoose.model<ArchitectureResultRecord>(
    "ArchitectureResult",
    ArchitectureResultRecordSchema
  );

export async function persistArchitectureResult(
  projectId: string,
  result: ArchitectureResult
): Promise<void> {
  await ArchitectureResultModel.findOneAndUpdate(
    { projectId },
    {
      projectId,
      architectureId: result.architectureId,
      status: "completed",
      componentCount: result.components.length,
      collectionCount: result.databaseSchema.length,
      endpointCount: result.apiContracts.length,
      confidence: result.confidence,
      selectedTechStackId: result.selectedTechStack.optionId,
      result,
      completedAt: new Date(),
    },
    { upsert: true }
  );
}

export async function markArchitectureRunning(
  projectId: string,
  architectureId: string
): Promise<void> {
  await ArchitectureResultModel.findOneAndUpdate(
    { projectId },
    {
      projectId,
      architectureId,
      status: "running",
      startedAt: new Date(),
    },
    { upsert: true }
  );
}

export async function markArchitectureFailed(
  projectId: string,
  error: string
): Promise<void> {
  await ArchitectureResultModel.findOneAndUpdate(
    { projectId },
    {
      status: "failed",
      error,
      completedAt: new Date(),
    }
  );
}

export async function getArchitectureResult(
  projectId: string
): Promise<ArchitectureResultRecord | null> {
  return ArchitectureResultModel.findOne({ projectId })
    .sort({ createdAt: -1 })
    .lean<ArchitectureResultRecord>();
}
