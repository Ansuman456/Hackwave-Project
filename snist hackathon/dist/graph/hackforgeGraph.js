"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hackforgeGraph = void 0;
exports.runHackforgeWorkflow = runHackforgeWorkflow;
exports.resumeAfterCandidateSelection = resumeAfterCandidateSelection;
exports.resumeAfterTechStackSelection = resumeAfterTechStackSelection;
const langgraph_1 = require("@langchain/langgraph");
const state_1 = require("./state");
const strategistNode_1 = require("./nodes/strategistNode");
const researcherNode_1 = require("./nodes/researcherNode");
const innovationNode_1 = require("./nodes/innovationNode");
const teamArchitectNode_1 = require("./nodes/teamArchitectNode");
const ctoNode_1 = require("./nodes/ctoNode");
function shouldContinueAfterStrategist(state) {
    if (state.status === "failed") {
        return "fail";
    }
    if (!state.problemAnalysis) {
        return "fail";
    }
    return "researcher";
}
function shouldContinueAfterResearcher(state) {
    if (state.status === "failed") {
        return "fail";
    }
    if (!state.research) {
        return "fail";
    }
    return "innovationAgent";
}
function shouldContinueAfterInnovation(state) {
    if (state.status === "failed") {
        return "fail";
    }
    if (!state.innovation) {
        return "fail";
    }
    // If no candidate selected yet, PAUSE and wait for user selection
    if (!state.innovation.selectedIdea) {
        return "awaiting_selection";
    }
    return "teamArchitect";
}
function shouldContinueAfterTeamArchitect(state) {
    if (state.status === "failed") {
        return "fail";
    }
    if (!state.teamAnalysis) {
        return "fail";
    }
    return "end";
}
// Phase 1: Strategist → Researcher → Innovation (pauses if no candidate selected)
// teamArchitect is registered but only invoked via resumeAfterCandidateSelection
const phase1Workflow = new langgraph_1.StateGraph(state_1.HackathonStateAnnotation)
    .addNode("strategist", strategistNode_1.strategistNode)
    .addNode("researcher", researcherNode_1.researcherNode)
    .addNode("innovationAgent", innovationNode_1.innovationNode)
    .addNode("teamArchitect", teamArchitectNode_1.teamArchitectNode)
    .addEdge(langgraph_1.START, "strategist")
    .addConditionalEdges("strategist", shouldContinueAfterStrategist, {
    researcher: "researcher",
    fail: langgraph_1.END,
})
    .addConditionalEdges("researcher", shouldContinueAfterResearcher, {
    innovationAgent: "innovationAgent",
    fail: langgraph_1.END,
})
    .addConditionalEdges("innovationAgent", shouldContinueAfterInnovation, {
    teamArchitect: "teamArchitect",
    awaiting_selection: langgraph_1.END,
    fail: langgraph_1.END,
})
    .addConditionalEdges("teamArchitect", shouldContinueAfterTeamArchitect, {
    end: langgraph_1.END,
    fail: langgraph_1.END,
});
exports.hackforgeGraph = phase1Workflow.compile();
/**
 * Phase 1: Run Strategist → Researcher → Innovation.
 * Pauses after Innovation if no candidate is pre-selected.
 */
async function runHackforgeWorkflow(projectId, state) {
    const result = await exports.hackforgeGraph.invoke(state, {
        configurable: { projectId },
    });
    const finalState = result;
    // If innovation completed but no candidate selected, mark as awaiting
    if (finalState.innovation &&
        !finalState.innovation.selectedIdea &&
        finalState.status !== "failed") {
        finalState.status = "awaiting_selection";
    }
    return finalState;
}
/**
 * Phase 2: After user selects a candidate, resume with TeamArchitect.
 * Loads current state, runs only the teamArchitect node.
 */
async function resumeAfterCandidateSelection(projectId, currentState) {
    // Run only the teamArchitect node with the updated state
    const result = await (0, teamArchitectNode_1.teamArchitectNode)(currentState);
    // Merge the result into the current state
    const updatedState = {
        ...currentState,
        ...result,
        status: result.status || currentState.status,
        errors: [
            ...currentState.errors,
            ...(result.errors || []),
        ],
    };
    return updatedState;
}
/**
 * Phase 3: After user selects a tech stack, resume with CTO Agent.
 * Runs the CTO node to generate the complete system architecture.
 */
async function resumeAfterTechStackSelection(projectId, currentState) {
    // Run only the cto node with the updated state
    const result = await (0, ctoNode_1.ctoNode)(currentState);
    // Merge the result into the current state
    const updatedState = {
        ...currentState,
        ...result,
        status: result.status || currentState.status,
        errors: [
            ...currentState.errors,
            ...(result.errors || []),
        ],
    };
    return updatedState;
}
//# sourceMappingURL=hackforgeGraph.js.map