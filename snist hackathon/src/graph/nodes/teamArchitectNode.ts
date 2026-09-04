import { HackathonState } from "../state";
import { runTeamArchitect } from "../../agents/team/team.agent";
import { emitEvent } from "../../utils/sseStreamer";
import { persistTeamAnalysis } from "../../models/TeamAnalysis.model";
import { addUsageMetrics } from "../../models/HackathonProject.model";

export async function teamArchitectNode(
  state: HackathonState
): Promise<Partial<HackathonState>> {
  const { projectId, problemAnalysis, research, innovation, input } = state;

  emitEvent(
    projectId,
    "teamArchitect",
    "agent_started",
    "Team Architect agent starting"
  );

  if (!problemAnalysis || !research || !innovation) {
    emitEvent(
      projectId,
      "teamArchitect",
      "agent_failed",
      "Missing required data from previous agents"
    );
    return {
      status: "failed",
      errors: [
        ...state.errors,
        {
          agent: "teamArchitect",
          node: "teamArchitectNode",
          error: "Missing problemAnalysis, research, or innovation data",
          timestamp: new Date().toISOString(),
          recoverable: false,
        },
      ],
    };
  }

  try {
    const resumes = input.resumes || [];
    const result = await runTeamArchitect(
      projectId,
      problemAnalysis,
      research,
      innovation,
      resumes
    );

    if (!result.success || !result.teamAnalysis) {
      emitEvent(
        projectId,
        "teamArchitect",
        "agent_failed",
        `Team Architect failed: ${result.error}`
      );
      return {
        status: "failed",
        errors: [
          ...state.errors,
          {
            agent: "teamArchitect",
            node: "teamArchitectNode",
            error: result.error || "Unknown error",
            timestamp: new Date().toISOString(),
            recoverable: false,
          },
        ],
      };
    }

    // Persist to MongoDB
    try {
      await persistTeamAnalysis(projectId, result.teamAnalysis);
    } catch (persistError) {
      console.error(
        "[TEAM_ARCHITECT] Failed to persist result:",
        persistError
      );
    }

    // Track usage: 4 DeepSeek calls (resume parse, feasibility, roles, tech stack)
    addUsageMetrics(projectId, {
      deepseekCalls: 4,
      llmTokens: 4000,
    }).catch(() => {});

    emitEvent(
      projectId,
      "teamArchitect",
      "agent_completed",
      `Team analysis complete: ${result.teamAnalysis.teamMembers.length} members, feasibility ${result.teamAnalysis.feasibility.score}/10, ${result.teamAnalysis.techStackOptions.length} tech options`
    );

    return {
      teamAnalysis: result.teamAnalysis,
      status: "completed",
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Unexpected error in teamArchitectNode";

    emitEvent(projectId, "teamArchitect", "agent_failed", errorMessage);

    return {
      status: "failed",
      errors: [
        ...state.errors,
        {
          agent: "teamArchitect",
          node: "teamArchitectNode",
          error: errorMessage,
          timestamp: new Date().toISOString(),
          recoverable: false,
        },
      ],
    };
  }
}
