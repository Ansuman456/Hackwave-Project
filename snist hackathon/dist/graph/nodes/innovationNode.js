"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.innovationNode = innovationNode;
const innovation_agent_1 = require("../../agents/innovation/innovation.agent");
const sseStreamer_1 = require("../../utils/sseStreamer");
const InnovationResult_model_1 = require("../../models/InnovationResult.model");
const HackathonProject_model_1 = require("../../models/HackathonProject.model");
async function innovationNode(state) {
    const { projectId, problemAnalysis, research } = state;
    (0, sseStreamer_1.emitEvent)(projectId, "innovation", "agent_started", "Innovation agent starting");
    if (!problemAnalysis || !research) {
        (0, sseStreamer_1.emitEvent)(projectId, "innovation", "agent_failed", "Missing problem analysis or research data");
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
        const result = await (0, innovation_agent_1.runInnovation)(projectId, problemAnalysis, research);
        if (!result.success || !result.innovation) {
            (0, sseStreamer_1.emitEvent)(projectId, "innovation", "agent_failed", `Innovation failed: ${result.error}`);
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
            await (0, InnovationResult_model_1.persistInnovationResult)(projectId, result.innovation);
        }
        catch (persistError) {
            console.error("[INNOVATION] Failed to persist result:", persistError);
        }
        // Track usage: innovation uses DeepSeek
        (0, HackathonProject_model_1.addUsageMetrics)(projectId, {
            deepseekCalls: 1,
            llmTokens: 3000,
        }).catch(() => { });
        (0, sseStreamer_1.emitEvent)(projectId, "innovation", "agent_completed", `Innovation completed: ${result.innovation.candidateIdeas.length} candidates generated`);
        return {
            innovation: result.innovation,
        };
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unexpected error in innovationNode";
        (0, sseStreamer_1.emitEvent)(projectId, "innovation", "agent_failed", errorMessage);
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
//# sourceMappingURL=innovationNode.js.map