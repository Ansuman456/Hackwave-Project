import { HackathonState } from "../state";
import { runResearcher } from "../../agents/researcher/researcher.agent";
import { emitEvent } from "../../utils/sseStreamer";
import { persistResearchResult } from "../../models/ResearchRun.model";

export async function researcherNode(
  state: HackathonState
): Promise<Partial<HackathonState>> {
  const { projectId } = state;

  emitEvent(
    projectId,
    "researcher",
    "agent_started",
    "Researcher agent starting"
  );

  try {
    const result = await runResearcher(state, "balanced");

    if (!result.success || !result.research) {
      emitEvent(
        projectId,
        "researcher",
        "agent_failed",
        `Researcher failed: ${result.error}`
      );

      return {
        status: "failed",
        errors: [
          ...state.errors,
          {
            agent: "researcher",
            node: "researcherNode",
            error: result.error || "Unknown error",
            timestamp: new Date().toISOString(),
            recoverable: false,
          },
        ],
      };
    }

    // Persist to MongoDB
    try {
      await persistResearchResult(projectId, result.research);
    } catch (persistError) {
      console.error(
        "[RESEARCHER] Failed to persist research result:",
        persistError
      );
    }

    emitEvent(
      projectId,
      "researcher",
      "agent_completed",
      `Research completed: ${result.research.summary.uniqueSources} sources, ${result.research.summary.relevantSolutions} solutions`
    );

    return {
      status: "completed",
      research: result.research,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unexpected error in researcherNode";

    emitEvent(projectId, "researcher", "agent_failed", errorMessage);

    return {
      status: "failed",
      errors: [
        ...state.errors,
        {
          agent: "researcher",
          node: "researcherNode",
          error: errorMessage,
          timestamp: new Date().toISOString(),
          recoverable: false,
        },
      ],
    };
  }
}
