import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { StrategistInputSchema, createInitialState, HackathonState } from "../graph/state";
import { HackathonProject } from "../models/HackathonProject.model";
import { hackforgeGraph, resumeAfterCandidateSelection } from "../graph/hackforgeGraph";
import { registerSSEConnection } from "../utils/sseStreamer";
import { selectCandidate, InnovationResultModel } from "../models/InnovationResult.model";
import {
  getTeamAnalysis as getTeamAnalysisRecord,
  selectTechStack as selectTechStackRecord,
  TeamAnalysisRecordModel,
} from "../models/TeamAnalysis.model";
import { getTeamSkillAnalysis } from "../models/TeamSkillAnalysis.model";

function getProjectId(req: Request): string {
  return req.params.id as string;
}

export async function createHackathon(req: Request, res: Response): Promise<void> {
  try {
    const input = StrategistInputSchema.parse(req.body);
    const projectId = uuidv4();

    const project = await HackathonProject.create({
      projectId,
      problemStatement: input.problemStatement,
      resumes: input.resumes || [],
      hackathon: input.hackathon,
      userConstraints: input.userConstraints,
      teamSize: input.teamSize,
      status: "idle",
    });

    res.status(201).json({
      success: true,
      data: {
        projectId: project.projectId,
        status: project.status,
        createdAt: project.createdAt,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      res.status(400).json({ success: false, error: "Invalid input", details: error.message });
      return;
    }
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}

export async function getHackathonStatus(req: Request, res: Response): Promise<void> {
  try {
    const id = getProjectId(req);
    const project = await HackathonProject.findOne({ projectId: id }).lean();

    if (!project) {
      res.status(404).json({ success: false, error: "Project not found" });
      return;
    }

    res.json({
      success: true,
      data: {
        projectId: project.projectId,
        status: project.status,
        lastError: project.lastError || null,
        executionErrors: project.executionErrors || [],
        usage: project.usage,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}

export async function startHackathon(req: Request, res: Response): Promise<void> {
  try {
    const id = getProjectId(req);
    const project = await HackathonProject.findOne({ projectId: id }).lean();

    if (!project) {
      res.status(404).json({ success: false, error: "Project not found" });
      return;
    }

    if (project.status === "running") {
      res.status(409).json({ success: false, error: "Workflow already running" });
      return;
    }

    // Update status to running
    await HackathonProject.findOneAndUpdate(
      { projectId: id },
      { status: "running", lastError: "", executionErrors: [] }
    );

    // Build initial state
    const initialState = createInitialState(id, {
      problemStatement: project.problemStatement,
      hackathon: project.hackathon as any,
      userConstraints: project.userConstraints,
      teamSize: project.teamSize,
      resumes: (project as any).resumes || [],
    });

    // Run workflow asynchronously
    runWorkflowAsync(id, initialState).catch((err) => {
      console.error(`[WORKFLOW] Failed for ${id}:`, err);
    });

    res.json({
      success: true,
      data: { projectId: id, status: "running" },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}

async function runWorkflowAsync(
  projectId: string,
  initialState: HackathonState
): Promise<void> {
  try {
    const result = (await hackforgeGraph.invoke(initialState)) as HackathonState;

    const lastErr = result.errors && result.errors.length > 0
      ? result.errors[result.errors.length - 1].error
      : "";

    // Persist the full workflow state so it can be resumed after user selection
    const stateToSave = {
      projectId: result.projectId,
      input: result.input,
      problemAnalysis: result.problemAnalysis,
      research: result.research,
      innovation: result.innovation,
      teamAnalysis: result.teamAnalysis,
      teamSkillAnalysis: result.teamSkillAnalysis,
      status: result.status,
      errors: result.errors,
      usage: result.usage,
    };

    await HackathonProject.findOneAndUpdate(
      { projectId },
      {
        status: result.status as "idle" | "running" | "paused" | "completed" | "failed" | "cancel_requested" | "awaiting_selection",
        lastError: lastErr,
        executionErrors: result.errors || [],
        workflowState: stateToSave,
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unexpected error in graph execution";
    console.error(`[WORKFLOW] Error for ${projectId}:`, error);

    await HackathonProject.findOneAndUpdate(
      { projectId },
      {
        status: "failed",
        lastError: errorMessage,
        executionErrors: [
          {
            agent: "system",
            node: "graphInvocation",
            error: errorMessage,
            timestamp: new Date().toISOString(),
          },
        ],
      }
    );
  }
}

export function streamEvents(req: Request, res: Response): void {
  const id = getProjectId(req);

  const cleanup = registerSSEConnection(id, res);

  req.on("close", () => {
    cleanup();
  });
}

export async function getProblemAnalysis(req: Request, res: Response): Promise<void> {
  try {
    const id = getProjectId(req);

    const { ProblemAnalysisRecord } = await import(
      "../models/ProblemAnalysis.model"
    );

    const record = await ProblemAnalysisRecord.findOne({ projectId: id })
      .sort({ version: -1 })
      .lean();

    if (!record) {
      res.status(404).json({
        success: false,
        error: "Problem analysis not found",
      });
      return;
    }

    res.json({
      success: true,
      data: {
        projectId: id,
        version: record.version,
        analysis: record.output,
        createdAt: record.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}

export async function getResearchResult(req: Request, res: Response): Promise<void> {
  try {
    const id = getProjectId(req);

    const { ResearchRun } = await import(
      "../models/ResearchRun.model"
    );

    const record = await ResearchRun.findOne({ projectId: id })
      .sort({ createdAt: -1 })
      .lean();

    if (!record) {
      // Check if project exists and is running
      const project = await HackathonProject.findOne({ projectId: id }).lean();
      if (project) {
        res.json({
          success: true,
          data: {
            projectId: id,
            status: project.status,
            message: project.status === "running" ? "Research agent is currently executing..." : "No research run recorded yet.",
          },
        });
        return;
      }

      res.status(404).json({
        success: false,
        error: "Project not found",
      });
      return;
    }

    if (!record.result) {
      res.json({
        success: true,
        data: {
          projectId: id,
          researchId: record.researchId,
          status: record.status,
          message: record.status === "running" ? "Research agent is currently executing discovery & enrichment..." : "Research ended without final payload.",
          metrics: record.metrics,
          error: record.error || null,
        },
      });
      return;
    }

    res.json({
      success: true,
      data: {
        projectId: id,
        researchId: record.researchId,
        status: record.status,
        result: record.result,
        metrics: record.metrics,
        startedAt: record.startedAt,
        completedAt: record.completedAt,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}

export async function getInnovationResult(req: Request, res: Response): Promise<void> {
  try {
    const id = getProjectId(req);

    const record = await InnovationResultModel.findOne({ projectId: id })
      .sort({ createdAt: -1 })
      .lean();

    if (!record) {
      res.status(404).json({
        success: false,
        error: "Innovation result not found",
      });
      return;
    }

    res.json({
      success: true,
      data: {
        projectId: id,
        innovationId: record.innovationId,
        status: record.status,
        candidateCount: record.candidateCount,
        selectedCandidateId: record.selectedCandidateId || null,
        result: record.result || null,
        startedAt: record.startedAt,
        completedAt: record.completedAt,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}

export async function selectCandidateHandler(req: Request, res: Response): Promise<void> {
  try {
    const id = getProjectId(req);
    const { candidateId } = req.body;

    if (!candidateId || typeof candidateId !== "string") {
      res.status(400).json({ success: false, error: "candidateId is required" });
      return;
    }

    // Find the latest innovation result for this project
    const record = await InnovationResultModel.findOne({ projectId: id })
      .sort({ createdAt: -1 })
      .lean();

    if (!record || !record.result) {
      res.status(404).json({
        success: false,
        error: "No innovation result found for this project",
      });
      return;
    }

    // Validate candidate exists
    const innovation = record.result as any;
    const candidate = innovation.candidateIdeas?.find((c: any) => c.id === candidateId);
    if (!candidate) {
      res.status(404).json({
        success: false,
        error: `Candidate with id "${candidateId}" not found`,
      });
      return;
    }

    // Persist selection in innovation result
    await selectCandidate(id, candidateId);

    // Load the persisted workflow state
    const project = await HackathonProject.findOne({ projectId: id }).lean();
    if (!project || !project.workflowState) {
      res.status(400).json({
        success: false,
        error: "No workflow state found. Workflow may not have completed Phase 1.",
      });
      return;
    }

    // Reconstruct state with selected candidate (full CandidateIdea object, not just ID)
    const currentState = project.workflowState as any;
    currentState.innovation = currentState.innovation || {};
    currentState.innovation.selectedIdea = candidate;

    // Update project status to running (teamArchitect is executing)
    await HackathonProject.findOneAndUpdate(
      { projectId: id },
      { status: "running", lastError: "", executionErrors: [] }
    );

    // Emit SSE event: resuming
    const { emitEvent } = await import("../utils/sseStreamer");
    emitEvent(
      id,
      "teamArchitect",
      "agent_started",
      `Resuming workflow — Team Architect processing candidate "${candidate.name}"`
    );

    // Resume Phase 2 asynchronously: run teamArchitect
    resumePhase2Async(id, currentState).catch((err) => {
      console.error(`[WORKFLOW] Phase 2 resume failed for ${id}:`, err);
    });

    res.json({
      success: true,
      data: {
        projectId: id,
        selectedCandidateId: candidateId,
        candidateName: candidate.name,
        oneLineDescription: candidate.oneLineDescription,
        message: "Candidate selected. Team Architect is now executing...",
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}

async function resumePhase2Async(
  projectId: string,
  currentState: any
): Promise<void> {
  try {
    const result = await resumeAfterCandidateSelection(projectId, currentState);

    const lastErr = result.errors && result.errors.length > 0
      ? result.errors[result.errors.length - 1].error
      : "";

    // Persist the updated workflow state and team analysis
    const stateToSave = {
      projectId: result.projectId,
      input: result.input,
      problemAnalysis: result.problemAnalysis,
      research: result.research,
      innovation: result.innovation,
      teamAnalysis: result.teamAnalysis,
      teamSkillAnalysis: result.teamSkillAnalysis,
      status: result.status,
      errors: result.errors,
      usage: result.usage,
    };

    await HackathonProject.findOneAndUpdate(
      { projectId },
      {
        status: result.status || "completed",
        lastError: lastErr,
        executionErrors: result.errors || [],
        workflowState: stateToSave,
      }
    );

    // Persist team analysis to its own collection
    const { persistTeamAnalysis } = await import("../models/TeamAnalysis.model");
    if (result.teamAnalysis) {
      await persistTeamAnalysis(projectId, result.teamAnalysis as any);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unexpected error in Phase 2";
    console.error(`[WORKFLOW] Phase 2 error for ${projectId}:`, error);

    await HackathonProject.findOneAndUpdate(
      { projectId },
      {
        status: "failed",
        lastError: errorMessage,
        executionErrors: [
          {
            agent: "teamArchitect",
            node: "resumePhase2",
            error: errorMessage,
            timestamp: new Date().toISOString(),
          },
        ],
      }
    );
  }
}

export async function getTeamAnalysis(req: Request, res: Response): Promise<void> {
  try {
    const id = getProjectId(req);

    const record = await getTeamAnalysisRecord(id);

    if (!record) {
      const project = await HackathonProject.findOne({ projectId: id }).lean();
      if (project) {
        res.json({
          success: true,
          data: {
            projectId: id,
            status: project.status,
            message:
              project.status === "running"
                ? "Team Architect agent is currently executing..."
                : "No team analysis recorded yet.",
          },
        });
        return;
      }

      res.status(404).json({
        success: false,
        error: "Project not found",
      });
      return;
    }

    if (!record.result) {
      res.json({
        success: true,
        data: {
          projectId: id,
          teamAnalysisId: record.teamAnalysisId,
          status: record.status,
          message:
            record.status === "running"
              ? "Team analysis is currently executing..."
              : "Team analysis ended without final payload.",
          error: record.error || null,
        },
      });
      return;
    }

    res.json({
      success: true,
      data: {
        projectId: id,
        teamAnalysisId: record.teamAnalysisId,
        status: record.status,
        teamMemberCount: record.teamMemberCount,
        feasibilityScore: record.feasibilityScore,
        techStackOptionCount: record.techStackOptionCount,
        selectedTechStackId: record.selectedTechStackId || null,
        result: record.result,
        startedAt: record.startedAt,
        completedAt: record.completedAt,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}

export async function getTeamSkillAnalysisHandler(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const id = getProjectId(req);

    const record = await getTeamSkillAnalysis(id);

    if (!record || !record.result) {
      const project = await HackathonProject.findOne({ projectId: id }).lean();
      if (project) {
        res.json({
          success: true,
          data: {
            projectId: id,
            status: project.status,
            message:
              project.status === "running"
                ? "Team Skill Graph agent is currently executing..."
                : "No team skill analysis recorded yet.",
          },
        });
        return;
      }

      res.status(404).json({
        success: false,
        error: "Project not found",
      });
      return;
    }

    res.json({
      success: true,
      data: {
        projectId: id,
        teamSkillAnalysisId: record.teamSkillAnalysisId,
        status: record.status,
        taskCount: record.taskCount,
        assignmentCount: record.assignmentCount,
        teamFitScore: record.teamFitScore,
        result: record.result,
        startedAt: record.startedAt,
        completedAt: record.completedAt,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}

export async function selectTechStackHandler(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const id = getProjectId(req);
    const { optionId } = req.body;

    if (!optionId || typeof optionId !== "string") {
      res.status(400).json({ success: false, error: "optionId is required" });
      return;
    }

    const record = await selectTechStackRecord(id, optionId);

    if (!record || !record.result) {
      res.status(404).json({
        success: false,
        error: "No team analysis found for this project",
      });
      return;
    }

    const teamAnalysis = record.result as any;
    const selectedOption = teamAnalysis.techStackOptions?.find(
      (opt: any) => opt.optionId === optionId
    );

    // Update project status
    await HackathonProject.findOneAndUpdate(
      { projectId: id },
      { status: "awaiting_selection" }
    );

    res.json({
      success: true,
      data: {
        projectId: id,
        selectedOptionId: optionId,
        optionName: selectedOption?.name || "Unknown",
        message:
          "Tech stack selected. Ready to continue workflow to next agent.",
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}
