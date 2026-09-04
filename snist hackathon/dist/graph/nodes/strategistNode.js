"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.strategistNode = strategistNode;
const strategist_agent_1 = require("../../agents/strategist/strategist.agent");
const sseStreamer_1 = require("../../utils/sseStreamer");
const ProblemAnalysis_model_1 = require("../../models/ProblemAnalysis.model");
const HackathonProject_model_1 = require("../../models/HackathonProject.model");
async function strategistNode(state) {
    const { projectId, input } = state;
    (0, sseStreamer_1.emitEvent)(projectId, "strategist", "agent_started", "Strategist agent starting problem analysis");
    try {
        const result = await (0, strategist_agent_1.runStrategist)(input);
        if (!result.success || !result.analysis) {
            console.error("[STRATEGIST FAILED ERROR]:", result.error);
            (0, sseStreamer_1.emitEvent)(projectId, "strategist", "agent_failed", `Strategist failed: ${result.error}`, {
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
            await (0, ProblemAnalysis_model_1.persistProblemAnalysis)(projectId, result.analysis);
        }
        catch (persistError) {
            console.error("[STRATEGIST] Failed to persist analysis:", persistError);
            // Continue with state update even if persistence fails
        }
        // Track usage: strategist runs on DeepSeek
        (0, HackathonProject_model_1.addUsageMetrics)(projectId, {
            deepseekCalls: 1,
            llmTokens: 2000,
        }).catch(() => { });
        (0, sseStreamer_1.emitEvent)(projectId, "strategist", "agent_completed", "Strategist analysis completed successfully", {
            researchQuestions: result.analysis.researchQuestions.length,
            researchDimensions: result.analysis.researchDimensions.length,
            targetUsers: result.analysis.targetUsers.length,
            domainKeywords: result.analysis.domainKeywords.length,
            retryCount: result.retryCount,
            confidence: result.analysis.analysisConfidence,
        });
        return {
            problemAnalysis: result.analysis,
        };
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unexpected error in strategistNode";
        (0, sseStreamer_1.emitEvent)(projectId, "strategist", "agent_failed", errorMessage, {
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
//# sourceMappingURL=strategistNode.js.map