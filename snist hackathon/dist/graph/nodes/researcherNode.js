"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.researcherNode = researcherNode;
const researcher_agent_1 = require("../../agents/researcher/researcher.agent");
const sseStreamer_1 = require("../../utils/sseStreamer");
const ResearchRun_model_1 = require("../../models/ResearchRun.model");
async function researcherNode(state) {
    const { projectId } = state;
    (0, sseStreamer_1.emitEvent)(projectId, "researcher", "agent_started", "Researcher agent starting");
    try {
        const result = await (0, researcher_agent_1.runResearcher)(state, "balanced");
        if (!result.success || !result.research) {
            (0, sseStreamer_1.emitEvent)(projectId, "researcher", "agent_failed", `Researcher failed: ${result.error}`);
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
            await (0, ResearchRun_model_1.persistResearchResult)(projectId, result.research);
        }
        catch (persistError) {
            console.error("[RESEARCHER] Failed to persist research result:", persistError);
        }
        (0, sseStreamer_1.emitEvent)(projectId, "researcher", "agent_completed", `Research completed: ${result.research.summary.uniqueSources} sources, ${result.research.summary.relevantSolutions} solutions`);
        return {
            status: "completed",
            research: result.research,
        };
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unexpected error in researcherNode";
        (0, sseStreamer_1.emitEvent)(projectId, "researcher", "agent_failed", errorMessage);
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
//# sourceMappingURL=researcherNode.js.map