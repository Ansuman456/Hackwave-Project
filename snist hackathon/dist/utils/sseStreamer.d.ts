import { Response } from "express";
export type AgentName = "strategist" | "researcher" | "innovation" | "teamArchitect" | "cto" | "judge" | "builder";
export type AgentEventType = "agent_started" | "agent_completed" | "agent_failed" | "tool_started" | "tool_completed" | "source_found" | "candidate_found" | "solution_enriched" | "research_started" | "planning_started" | "planning_completed" | "query_generated" | "search_started" | "search_completed" | "sources_merged" | "candidate_selected" | "enrichment_started" | "enrichment_completed" | "contradiction_found" | "coverage_updated" | "research_completed" | "research_partial" | "research_failed" | "discovery_round_started" | "sources_found" | "research_plan_built" | "discovery_queries_generated" | "dual_search_executing" | "github_search_executing" | "candidates_classifying" | "innovation_started" | "innovation_completed" | "judge_started" | "judge_completed" | "improvement_started" | "build_started" | "build_completed" | "workflow_error";
export interface AgentEvent {
    id: string;
    projectId: string;
    timestamp: string;
    agent: AgentName;
    type: AgentEventType;
    message: string;
    metadata?: Record<string, unknown>;
}
export declare function registerSSEConnection(projectId: string, res: Response): () => void;
export declare function emitEvent(projectId: string, agent: AgentName, type: AgentEventType, message: string, metadata?: Record<string, unknown>): void;
//# sourceMappingURL=sseStreamer.d.ts.map