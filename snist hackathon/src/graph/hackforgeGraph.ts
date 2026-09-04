import { StateGraph, END, START } from "@langchain/langgraph";
import { HackathonState, HackathonStateAnnotation } from "./state";
import { strategistNode } from "./nodes/strategistNode";
import { researcherNode } from "./nodes/researcherNode";
import { innovationNode } from "./nodes/innovationNode";
import { teamArchitectNode } from "./nodes/teamArchitectNode";
import { ctoNode } from "./nodes/ctoNode";

function shouldContinueAfterStrategist(
  state: HackathonState
): "researcher" | "fail" {
  if (state.status === "failed") {
    return "fail";
  }
  if (!state.problemAnalysis) {
    return "fail";
  }
  return "researcher";
}

function shouldContinueAfterResearcher(
  state: HackathonState
): "innovationAgent" | "fail" {
  if (state.status === "failed") {
    return "fail";
  }
  if (!state.research) {
    return "fail";
  }
  return "innovationAgent";
}

function shouldContinueAfterInnovation(
  state: HackathonState
): "teamArchitect" | "awaiting_selection" | "fail" {
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

function shouldContinueAfterTeamArchitect(
  state: HackathonState
): "end" | "fail" {
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
const phase1Workflow = new StateGraph(HackathonStateAnnotation)
  .addNode("strategist", strategistNode)
  .addNode("researcher", researcherNode)
  .addNode("innovationAgent", innovationNode)
  .addNode("teamArchitect", teamArchitectNode)
  .addEdge(START, "strategist")
  .addConditionalEdges("strategist", shouldContinueAfterStrategist, {
    researcher: "researcher",
    fail: END,
  })
  .addConditionalEdges("researcher", shouldContinueAfterResearcher, {
    innovationAgent: "innovationAgent",
    fail: END,
  })
  .addConditionalEdges("innovationAgent", shouldContinueAfterInnovation, {
    teamArchitect: "teamArchitect",
    awaiting_selection: END,
    fail: END,
  })
  .addConditionalEdges("teamArchitect", shouldContinueAfterTeamArchitect, {
    end: END,
    fail: END,
  });

export const hackforgeGraph = phase1Workflow.compile();

/**
 * Phase 1: Run Strategist → Researcher → Innovation.
 * Pauses after Innovation if no candidate is pre-selected.
 */
export async function runHackforgeWorkflow(
  projectId: string,
  state: HackathonState
): Promise<HackathonState> {
  const result = await hackforgeGraph.invoke(state, {
    configurable: { projectId },
  });

  const finalState = result as HackathonState;

  // If innovation completed but no candidate selected, mark as awaiting
  if (
    finalState.innovation &&
    !finalState.innovation.selectedIdea &&
    finalState.status !== "failed"
  ) {
    finalState.status = "awaiting_selection" as typeof finalState.status;
  }

  return finalState;
}

/**
 * Phase 2: After user selects a candidate, resume with TeamArchitect.
 * Loads current state, runs only the teamArchitect node.
 */
export async function resumeAfterCandidateSelection(
  projectId: string,
  currentState: HackathonState
): Promise<HackathonState> {
  // Run only the teamArchitect node with the updated state
  const result = await teamArchitectNode(currentState);

  // Merge the result into the current state
  const updatedState: HackathonState = {
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
export async function resumeAfterTechStackSelection(
  projectId: string,
  currentState: HackathonState
): Promise<HackathonState> {
  // Run only the cto node with the updated state
  const result = await ctoNode(currentState);

  // Merge the result into the current state
  const updatedState: HackathonState = {
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
