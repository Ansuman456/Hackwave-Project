import mongoose, { Schema, Document } from "mongoose";
import { TeamAnalysis, TechStackOption } from "../graph/state";

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

const TeamAnalysisRecordSchema = new Schema<TeamAnalysisRecord>(
  {
    projectId: { type: String, required: true, index: true },
    teamAnalysisId: { type: String, required: true },
    status: {
      type: String,
      enum: ["running", "completed", "failed"],
      default: "running",
    },
    teamMemberCount: { type: Number, default: 0 },
    feasibilityScore: { type: Number, default: 0 },
    techStackOptionCount: { type: Number, default: 0 },
    selectedTechStackId: { type: String, default: null },
    result: { type: Schema.Types.Mixed, default: null },
    error: { type: String, default: null },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

TeamAnalysisRecordSchema.index({ projectId: 1, createdAt: -1 });

export const TeamAnalysisRecordModel =
  mongoose.models.TeamAnalysisRecord ||
  mongoose.model<TeamAnalysisRecord>(
    "TeamAnalysisRecord",
    TeamAnalysisRecordSchema
  );

export async function persistTeamAnalysis(
  projectId: string,
  teamAnalysis: TeamAnalysis
): Promise<void> {
  const teamAnalysisId = `ta_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

  await TeamAnalysisRecordModel.findOneAndUpdate(
    { projectId },
    {
      projectId,
      teamAnalysisId,
      status: "completed",
      teamMemberCount: teamAnalysis.teamMembers.length,
      feasibilityScore: teamAnalysis.feasibility.score,
      techStackOptionCount: teamAnalysis.techStackOptions.length,
      result: teamAnalysis,
      completedAt: new Date(),
    },
    { upsert: true }
  );
}

export async function selectTechStack(
  projectId: string,
  optionId: string
): Promise<TeamAnalysisLean | null> {
  const record = await TeamAnalysisRecordModel.findOne({ projectId })
    .sort({ createdAt: -1 })
    .lean<TeamAnalysisLean>();

  if (!record || !record.result) return null;

  const teamAnalysis = record.result as TeamAnalysis;
  const selectedOption = teamAnalysis.techStackOptions.find(
    (opt) => opt.optionId === optionId
  );

  if (!selectedOption) return null;

  teamAnalysis.selectedTechStack = selectedOption;

  await TeamAnalysisRecordModel.findOneAndUpdate(
    { projectId },
    {
      selectedTechStackId: optionId,
      result: teamAnalysis,
    }
  );

  return record;
}

export async function getTeamAnalysis(
  projectId: string
): Promise<TeamAnalysisLean | null> {
  return TeamAnalysisRecordModel.findOne({ projectId })
    .sort({ createdAt: -1 })
    .lean<TeamAnalysisLean>();
}
