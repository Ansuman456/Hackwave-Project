import { StateGraph, END, START } from "@langchain/langgraph";
import { HackathonState, HackathonStateAnnotation } from "./state";
import { strategistNode } from "./nodes/strategistNode";
import { researcherNode } from "./nodes/researcherNode";
import { innovationNode } from "./nodes/innovationNode";
import { teamArchitectNode } from "./nodes/teamArchitectNode";
import { skillAllocatorNode } from "./nodes/skillAllocatorNode";

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
): "skillAllocator" | "end" | "fail" {
  if (state.status === "failed") {
    return "fail";
  }
  if (!state.teamAnalysis) {
    return "fail";
  }
  return "skillAllocator";
}

function shouldContinueAfterSkillAllocator(
  state: HackathonState
): "end" | "fail" {
  if (state.status === "failed") {
    return "fail";
  }
  return "end";
}

// Phase 1: Strategist → Researcher → Innovation (pauses if no candidate selected)
// Phase 2: teamArchitect → skillAllocator (invoked via resumeAfterCandidateSelection)
const phase1Workflow = new StateGraph(HackathonStateAnnotation)
  .addNode("strategist", strategistNode)
  .addNode("researcher", researcherNode)
  .addNode("innovationAgent", innovationNode)
  .addNode("teamArchitect", teamArchitectNode)
  .addNode("skillAllocator", skillAllocatorNode)
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
    skillAllocator: "skillAllocator",
    end: END,
    fail: END,
  })
  .addConditionalEdges("skillAllocator", shouldContinueAfterSkillAllocator, {
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
 * Phase 2: After user selects a candidate, resume with TeamArchitect + skillAllocator.
 * Loads current state, runs teamArchitect then skillAllocator.
 */
export async function resumeAfterCandidateSelection(
  projectId: string,
  currentState: HackathonState
): Promise<HackathonState> {
  // Run only the teamArchitect node with the updated state
  const teamResult = await teamArchitectNode(currentState);

  const afterTeam: HackathonState = {
    ...currentState,
    ...teamResult,
    status: teamResult.status || currentState.status,
    errors: [...currentState.errors, ...(teamResult.errors || [])],
  };

  // If teamArchitect failed, do not proceed to skillAllocator
  if (afterTeam.status === "failed" || !afterTeam.teamAnalysis) {
    return afterTeam;
  }

  // Run the skillAllocator (Agent 5)
  const skillResult = await skillAllocatorNode(afterTeam);

  const updatedState: HackathonState = {
    ...afterTeam,
    ...skillResult,
    status: skillResult.status || afterTeam.status,
    errors: [...afterTeam.errors, ...(skillResult.errors || [])],
  };

  return updatedState;
}
