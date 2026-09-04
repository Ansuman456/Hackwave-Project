import { HackathonState, ProblemAnalysis } from "../state";
import { runStrategist, StrategistResult } from "../../agents/strategist/strategist.agent";
import { emitEvent } from "../../utils/sseStreamer";
import { v4 as uuidv4 } from "uuid";
import { persistProblemAnalysis } from "../../models/ProblemAnalysis.model";
import { addUsageMetrics } from "../../models/HackathonProject.model";

export async function strategistNode(
  state: HackathonState
): Promise<Partial<HackathonState>> {
  const { projectId, input } = state;

  emitEvent(projectId, "strategist", "agent_started", "Strategist agent starting problem analysis");

  try {
    const result: StrategistResult = await runStrategist(input);

    if (!result.success || !result.analysis) {
      console.error("[STRATEGIST FAILED ERROR]:", result.error);
      emitEvent(projectId, "strategist", "agent_failed", `Strategist failed: ${result.error}`, {
        retryCount: result.retryCount,
        recoverable: false,
      });

      return {
        status: "failed",
        errors: [
          ...state.errors,
          {
            agent: "strategist",
            node: "strategistNode",
            error: result.error || "Unknown error",
            timestamp: new Date().toISOString(),
            recoverable: false,
          },
        ],
      };
    }

    // Persist to MongoDB
    try {
      await persistProblemAnalysis(projectId, result.analysis);
    } catch (persistError) {
      console.error("[STRATEGIST] Failed to persist analysis:", persistError);
      // Continue with state update even if persistence fails
    }

    // Track usage: strategist runs on Groq LLM
    addUsageMetrics(projectId, {
      llmTokens: 2000,
    }).catch(() => {});

    emitEvent(
      projectId,
      "strategist",
      "agent_completed",
      "Strategist analysis completed successfully",
      {
        researchQuestions: result.analysis.researchQuestions.length,
        researchDimensions: result.analysis.researchDimensions.length,
        targetUsers: result.analysis.targetUsers.length,
        domainKeywords: result.analysis.domainKeywords.length,
        retryCount: result.retryCount,
        confidence: result.analysis.analysisConfidence,
      }
    );

    return {
      problemAnalysis: result.analysis,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unexpected error in strategistNode";

    emitEvent(projectId, "strategist", "agent_failed", errorMessage, {
      recoverable: false,
    });

    return {
      status: "failed",
      errors: [
        ...state.errors,
        {
          agent: "strategist",
          node: "strategistNode",
          error: errorMessage,
          timestamp: new Date().toISOString(),
          recoverable: false,
        },
      ],
    };
  }
}
