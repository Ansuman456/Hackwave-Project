import mongoose, { Schema, Document } from "mongoose";
import { ProblemAnalysis } from "../graph/state";

export interface IProblemAnalysisRecord extends Document {
  projectId: string;
  agent: string;
  version: number;
  output: ProblemAnalysis;
  createdAt: Date;
  updatedAt: Date;
}

const ProblemAnalysisRecordSchema = new Schema<IProblemAnalysisRecord>(
  {
    projectId: { type: String, required: true, index: true },
    agent: { type: String, default: "strategist" },
    version: { type: Number, default: 1 },
    output: { type: Schema.Types.Mixed, required: true },
  },
  {
    timestamps: true,
  }
);

ProblemAnalysisRecordSchema.index({ projectId: 1, version: 1 });

export const ProblemAnalysisRecord = mongoose.model<IProblemAnalysisRecord>(
  "ProblemAnalysis",
  ProblemAnalysisRecordSchema
);

export async function persistProblemAnalysis(
  projectId: string,
  analysis: ProblemAnalysis
): Promise<void> {
  // Get the next version number
  const lastRecord = await ProblemAnalysisRecord.findOne({ projectId })
    .sort({ version: -1 })
    .lean();

  const nextVersion = lastRecord ? lastRecord.version + 1 : 1;

  await ProblemAnalysisRecord.create({
    projectId,
    agent: "strategist",
    version: nextVersion,
    output: analysis,
  });
}
