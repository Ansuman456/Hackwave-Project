import { HackathonState } from "../state";
import { runSkillAllocator } from "../../agents/skill/skill.agent";
import { emitEvent } from "../../utils/sseStreamer";
import { persistTeamSkillAnalysis } from "../../models/TeamSkillAnalysis.model";
import { addUsageMetrics } from "../../models/HackathonProject.model";

export async function skillAllocatorNode(
  state: HackathonState
): Promise<Partial<HackathonState>> {
  const { projectId } = state;

  emitEvent(projectId, "skillAllocator", "agent_started", "Team Skill Graph agent starting");

  if (!state.teamAnalysis || !state.innovation) {
    emitEvent(
      projectId,
      "skillAllocator",
      "agent_failed",
      "Missing team analysis or innovation data"
    );
    return {
      status: "failed",
      errors: [
        ...state.errors,
        {
          agent: "skillAllocator",
          node: "skillAllocatorNode",
          error: "Missing team analysis or innovation data",
          timestamp: new Date().toISOString(),
          recoverable: false,
        },
      ],
    };
  }

  try {
    const result = await runSkillAllocator(projectId, state);

    if (!result.success || !result.teamSkillAnalysis) {
      emitEvent(
        projectId,
        "skillAllocator",
        "agent_failed",
        `Team Skill Graph failed: ${result.error}`
      );
      return {
        status: "failed",
        errors: [
          ...state.errors,
          {
            agent: "skillAllocator",
            node: "skillAllocatorNode",
            error: result.error || "Unknown error",
            timestamp: new Date().toISOString(),
            recoverable: false,
          },
        ],
      };
    }

    try {
      await persistTeamSkillAnalysis(projectId, result.teamSkillAnalysis);
    } catch (persistError) {
      console.error("[SKILL_ALLOCATOR] Failed to persist result:", persistError);
    }

    addUsageMetrics(projectId, { llmTokens: 3000 }).catch(() => {});

    emitEvent(
      projectId,
      "skillAllocator",
      "agent_completed",
      `Team Skill Graph complete: ${result.teamSkillAnalysis.projectTasks.length} tasks, ${result.teamSkillAnalysis.assignments.length} assignments`
    );

    return {
      teamSkillAnalysis: result.teamSkillAnalysis,
      status: "completed",
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unexpected error in skillAllocatorNode";

    emitEvent(projectId, "skillAllocator", "agent_failed", errorMessage);

    return {
      status: "failed",
      errors: [
        ...state.errors,
        {
          agent: "skillAllocator",
          node: "skillAllocatorNode",
          error: errorMessage,
          timestamp: new Date().toISOString(),
          recoverable: false,
        },
      ],
    };
  }
}
