import mongoose, { Schema, Document } from "mongoose";
import { TeamSkillAnalysis } from "../graph/state";

export interface ITeamSkillAnalysisRecord extends Document {
  projectId: string;
  teamSkillAnalysisId: string;
  status: "running" | "completed" | "failed" | "conditionally_feasible" | "infeasible";
  taskCount: number;
  assignmentCount: number;
  teamFitScore: number;
  result: TeamSkillAnalysis | null;
  error: string | null;
  startedAt: Date;
  completedAt: Date;
}

interface TeamSkillAnalysisLean {
  projectId: string;
  teamSkillAnalysisId: string;
  status: string;
  taskCount: number;
  assignmentCount: number;
  teamFitScore: number;
  result: TeamSkillAnalysis | null;
  error: string | null;
  startedAt: Date;
  completedAt: Date;
  _id: unknown;
}

const TeamSkillAnalysisSchema = new Schema<ITeamSkillAnalysisRecord>(
  {
    projectId: { type: String, required: true, index: true },
    teamSkillAnalysisId: { type: String, required: true },
    status: {
      type: String,
      enum: ["running", "completed", "failed", "conditionally_feasible", "infeasible"],
      default: "running",
    },
    taskCount: { type: Number, default: 0 },
    assignmentCount: { type: Number, default: 0 },
    teamFitScore: { type: Number, default: 0 },
    result: { type: Schema.Types.Mixed, default: null },
    error: { type: String, default: null },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

TeamSkillAnalysisSchema.index({ projectId: 1, createdAt: -1 });

export const TeamSkillAnalysisRecordModel =
  mongoose.models.TeamSkillAnalysisRecord ||
  mongoose.model<ITeamSkillAnalysisRecord>(
    "TeamSkillAnalysisRecord",
    TeamSkillAnalysisSchema
  );

export async function persistTeamSkillAnalysis(
  projectId: string,
  teamSkillAnalysis: TeamSkillAnalysis
): Promise<void> {
  await TeamSkillAnalysisRecordModel.findOneAndUpdate(
    { projectId },
    {
      projectId,
      teamSkillAnalysisId: teamSkillAnalysis.teamSkillAnalysisId,
      status: teamSkillAnalysis.status,
      taskCount: teamSkillAnalysis.projectTasks.length,
      assignmentCount: teamSkillAnalysis.assignments.length,
      teamFitScore: teamSkillAnalysis.teamFit.score,
      result: teamSkillAnalysis,
      completedAt: new Date(),
    },
    { upsert: true }
  );
}

export async function getTeamSkillAnalysis(
  projectId: string
): Promise<TeamSkillAnalysisLean | null> {
  return TeamSkillAnalysisRecordModel.findOne({ projectId })
    .sort({ createdAt: -1 })
    .lean<TeamSkillAnalysisLean>();
}
