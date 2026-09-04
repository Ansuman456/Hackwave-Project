import { HackathonState } from "../state";
import { runCTO } from "../../agents/cto/cto.agent";
import { emitEvent } from "../../utils/sseStreamer";
import {
  persistArchitectureResult,
  markArchitectureRunning,
  markArchitectureFailed,
} from "../../models/ArchitectureResult.model";
import { addUsageMetrics } from "../../models/HackathonProject.model";

export async function ctoNode(
  state: HackathonState
): Promise<Partial<HackathonState>> {
  const { projectId, problemAnalysis, research, innovation, teamAnalysis, input } = state;

  const architectureId = `arch_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

  emitEvent(projectId, "cto", "agent_started", "CTO Agent starting architecture generation");

  if (!problemAnalysis || !research || !innovation || !teamAnalysis) {
    emitEvent(
      projectId,
      "cto",
      "agent_failed",
      "Missing required data from previous agents"
    );
    return {
      status: "failed",
      errors: [
        ...state.errors,
        {
          agent: "cto",
          node: "ctoNode",
          error: "Missing problemAnalysis, research, innovation, or teamAnalysis data",
          timestamp: new Date().toISOString(),
          recoverable: false,
        },
      ],
    };
  }

  // Mark as running in MongoDB
  try {
    await markArchitectureRunning(projectId, architectureId);
  } catch (persistError) {
    console.error("[CTO] Failed to mark as running:", persistError);
  }

  try {
    const result = await runCTO(
      projectId,
      innovation.selectedIdea,
      teamAnalysis,
      {
        durationHours: input.hackathon?.durationHours,
        rules: input.hackathon?.rules,
        restrictions: input.hackathon?.restrictions,
      },
      input.githubLinks || []
    );

    if (!result.success || !result.architecture) {
      emitEvent(
        projectId,
        "cto",
        "agent_failed",
        `CTO Agent failed: ${result.error}`
      );

      // Mark as failed in MongoDB
      try {
        await markArchitectureFailed(projectId, result.error || "Unknown error");
      } catch (persistError) {
        console.error("[CTO] Failed to mark as failed:", persistError);
      }

      return {
        status: "failed",
        errors: [
          ...state.errors,
          {
            agent: "cto",
            node: "ctoNode",
            error: result.error || "Unknown error",
            timestamp: new Date().toISOString(),
            recoverable: false,
          },
        ],
      };
    }

    // Persist to MongoDB
    try {
      await persistArchitectureResult(projectId, result.architecture);
    } catch (persistError) {
      console.error("[CTO] Failed to persist result:", persistError);
    }

    // Track usage: 4 DeepSeek calls (architecture, schema, AI/RAG, implementation)
    addUsageMetrics(projectId, {
      deepseekCalls: 4,
      llmTokens: 6000,
    }).catch(() => {});

    emitEvent(
      projectId,
      "cto",
      "agent_completed",
      `Architecture complete: ${result.architecture.components.length} components, ${result.architecture.databaseSchema.length} collections, ${result.architecture.apiContracts.length} endpoints, confidence ${result.architecture.confidence}`
    );

    return {
      architecture: result.architecture,
      status: "completed",
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Unexpected error in ctoNode";

    emitEvent(projectId, "cto", "agent_failed", errorMessage);

    // Mark as failed in MongoDB
    try {
      await markArchitectureFailed(projectId, errorMessage);
    } catch (persistError) {
      console.error("[CTO] Failed to mark as failed:", persistError);
    }

    return {
      status: "failed",
      errors: [
        ...state.errors,
        {
          agent: "cto",
          node: "ctoNode",
          error: errorMessage,
          timestamp: new Date().toISOString(),
          recoverable: false,
        },
      ],
    };
  }
}
