"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ctoNode = ctoNode;
const cto_agent_1 = require("../../agents/cto/cto.agent");
const sseStreamer_1 = require("../../utils/sseStreamer");
const ArchitectureResult_model_1 = require("../../models/ArchitectureResult.model");
const HackathonProject_model_1 = require("../../models/HackathonProject.model");
async function ctoNode(state) {
    const { projectId, problemAnalysis, research, innovation, teamAnalysis, input } = state;
    const architectureId = `arch_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    (0, sseStreamer_1.emitEvent)(projectId, "cto", "agent_started", "CTO Agent starting architecture generation");
    if (!problemAnalysis || !research || !innovation || !teamAnalysis) {
        (0, sseStreamer_1.emitEvent)(projectId, "cto", "agent_failed", "Missing required data from previous agents");
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
        await (0, ArchitectureResult_model_1.markArchitectureRunning)(projectId, architectureId);
    }
    catch (persistError) {
        console.error("[CTO] Failed to mark as running:", persistError);
    }
    try {
        const result = await (0, cto_agent_1.runCTO)(projectId, innovation.selectedIdea, teamAnalysis, {
            durationHours: input.hackathon?.durationHours,
            rules: input.hackathon?.rules,
            restrictions: input.hackathon?.restrictions,
        }, input.githubLinks || []);
        if (!result.success || !result.architecture) {
            (0, sseStreamer_1.emitEvent)(projectId, "cto", "agent_failed", `CTO Agent failed: ${result.error}`);
            // Mark as failed in MongoDB
            try {
                await (0, ArchitectureResult_model_1.markArchitectureFailed)(projectId, result.error || "Unknown error");
            }
            catch (persistError) {
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
            await (0, ArchitectureResult_model_1.persistArchitectureResult)(projectId, result.architecture);
        }
        catch (persistError) {
            console.error("[CTO] Failed to persist result:", persistError);
        }
        // Track usage: 4 DeepSeek calls (architecture, schema, AI/RAG, implementation)
        (0, HackathonProject_model_1.addUsageMetrics)(projectId, {
            deepseekCalls: 4,
            llmTokens: 6000,
        }).catch(() => { });
        (0, sseStreamer_1.emitEvent)(projectId, "cto", "agent_completed", `Architecture complete: ${result.architecture.components.length} components, ${result.architecture.databaseSchema.length} collections, ${result.architecture.apiContracts.length} endpoints, confidence ${result.architecture.confidence}`);
        return {
            architecture: result.architecture,
            status: "completed",
        };
    }
    catch (error) {
        const errorMessage = error instanceof Error
            ? error.message
            : "Unexpected error in ctoNode";
        (0, sseStreamer_1.emitEvent)(projectId, "cto", "agent_failed", errorMessage);
        // Mark as failed in MongoDB
        try {
            await (0, ArchitectureResult_model_1.markArchitectureFailed)(projectId, errorMessage);
        }
        catch (persistError) {
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
//# sourceMappingURL=ctoNode.js.map