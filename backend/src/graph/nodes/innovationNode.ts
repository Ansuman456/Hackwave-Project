import { HackathonState, InnovationResult } from "../state";
import { runInnovation } from "../../agents/innovation/innovation.agent";
import { emitEvent } from "../../utils/sseStreamer";
import { persistInnovationResult } from "../../models/InnovationResult.model";
import { addUsageMetrics } from "../../models/HackathonProject.model";

export async function innovationNode(
  state: HackathonState
): Promise<Partial<HackathonState>> {
  const { projectId, problemAnalysis, research } = state;

  emitEvent(projectId, "innovation", "agent_started", "Innovation agent starting");

  if (!problemAnalysis || !research) {
    emitEvent(
      projectId,
      "innovation",
      "agent_failed",
      "Missing problem analysis or research data"
    );
    return {
      status: "failed",
      errors: [
        ...state.errors,
        {
          agent: "innovation",
          node: "innovationNode",
          error: "Missing problem analysis or research data",
          timestamp: new Date().toISOString(),
          recoverable: false,
        },
      ],
    };
  }

  try {
    const result = await runInnovation(projectId, problemAnalysis, research);

    if (!result.success || !result.innovation) {
      emitEvent(
        projectId,
        "innovation",
        "agent_failed",
        `Innovation failed: ${result.error}`
      );
      return {
        status: "failed",
        errors: [
          ...state.errors,
          {
            agent: "innovation",
            node: "innovationNode",
            error: result.error || "Unknown error",
            timestamp: new Date().toISOString(),
            recoverable: false,
          },
        ],
      };
    }

    // Persist to MongoDB
    try {
      await persistInnovationResult(projectId, result.innovation);
    } catch (persistError) {
      console.error("[INNOVATION] Failed to persist result:", persistError);
    }

    // Track usage: innovation uses Gemini
    addUsageMetrics(projectId, {
      llmTokens: 3000,
    }).catch(() => {});

    emitEvent(
      projectId,
      "innovation",
      "agent_completed",
      `Innovation completed: ${result.innovation.candidateIdeas.length} candidates generated`
    );

    return {
      innovation: result.innovation,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unexpected error in innovationNode";

    emitEvent(projectId, "innovation", "agent_failed", errorMessage);

    return {
      status: "failed",
      errors: [
        ...state.errors,
        {
          agent: "innovation",
          node: "innovationNode",
          error: errorMessage,
          timestamp: new Date().toISOString(),
          recoverable: false,
        },
      ],
    };
  }
}
