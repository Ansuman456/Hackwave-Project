import mongoose, { Schema, Document } from "mongoose";
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

const InnovationResultSchema = new Schema<IInnovationResult>(
  {
    projectId: { type: String, required: true, index: true },
    innovationId: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ["running", "completed", "failed"],
      default: "running",
    },
    candidateCount: { type: Number, default: 0 },
    selectedCandidateId: { type: String },
    result: { type: Schema.Types.Mixed },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
    error: { type: String },
  },
  {
    timestamps: true,
  }
);

InnovationResultSchema.index({ projectId: 1, innovationId: 1 }, { unique: true });

export const InnovationResultModel = mongoose.model<IInnovationResult>(
  "InnovationResult",
  InnovationResultSchema
);

export async function createInnovationRun(
  projectId: string,
  innovationId: string
): Promise<IInnovationResult> {
  return InnovationResultModel.create({
    projectId,
    innovationId,
    status: "running",
    startedAt: new Date(),
  });
}

export async function persistInnovationResult(
  projectId: string,
  result: InnovationResult
): Promise<void> {
  await InnovationResultModel.findOneAndUpdate(
    { projectId, innovationId: result.innovationId },
    {
      status: "completed",
      candidateCount: result.candidateIdeas.length,
      result,
      completedAt: new Date(),
    },
    { upsert: true, new: true }
  );
}

export async function selectCandidate(
  projectId: string,
  candidateId: string
): Promise<void> {
  // Update the innovation result with the selected candidate
  const record = await InnovationResultModel.findOne({ projectId }).sort({ createdAt: -1 });
  if (record && record.result) {
    const innovation = record.result as InnovationResult;
    const selected = innovation.candidateIdeas.find((c) => c.id === candidateId);
    if (selected) {
      innovation.selectedIdea = selected;
      await record.save();
    }
  }

  // Also update the project record
  await InnovationResultModel.findOneAndUpdate(
    { projectId },
    { selectedCandidateId: candidateId }
  );
}
