import { Response } from "express";
import { v4 as uuidv4 } from "uuid";

export type AgentName =
  | "strategist"
  | "researcher"
  | "innovation"
  | "teamArchitect"
  | "skillAllocator"
  | "cto"
  | "judge"
  | "builder";

export type AgentEventType =
  | "agent_started"
  | "agent_completed"
  | "agent_failed"
  | "tool_started"
  | "tool_completed"
  | "source_found"
  | "candidate_found"
  | "solution_enriched"
  | "research_started"
  | "planning_started"
  | "planning_completed"
  | "query_generated"
  | "search_started"
  | "search_completed"
  | "sources_merged"
  | "candidate_selected"
  | "enrichment_started"
  | "enrichment_completed"
  | "contradiction_found"
  | "coverage_updated"
  | "research_completed"
  | "research_partial"
  | "research_failed"
  | "discovery_round_started"
  | "sources_found"
  | "research_plan_built"
  | "discovery_queries_generated"
  | "dual_search_executing"
  | "github_search_executing"
  | "candidates_classifying"
  | "innovation_started"
  | "innovation_completed"
  | "judge_started"
  | "judge_completed"
  | "improvement_started"
  | "build_started"
  | "build_completed"
  | "team_analysis_started"
  | "resume_analysis_started"
  | "resume_analysis_completed"
  | "github_analysis_started"
  | "github_analysis_completed"
  | "skill_graph_created"
  | "project_tasks_generated"
  | "task_dependency_graph_created"
  | "compatibility_matrix_created"
  | "initial_assignment_created"
  | "assignment_optimization_started"
  | "assignment_rebalanced"
  | "team_plan_validated"
  | "team_analysis_completed"
  | "workflow_error";

export interface AgentEvent {
  id: string;
  projectId: string;
  timestamp: string;
  agent: AgentName;
  type: AgentEventType;
  message: string;
  metadata?: Record<string, unknown>;
}

const projectConnections = new Map<string, Set<Response>>();

export function registerSSEConnection(
  projectId: string,
  res: Response
): () => void {
  if (!projectConnections.has(projectId)) {
    projectConnections.set(projectId, new Set());
  }
  projectConnections.get(projectId)!.add(res);

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders();

  const heartbeat = setInterval(() => {
    res.write(":\n\n");
  }, 30000);

  return () => {
    clearInterval(heartbeat);
    projectConnections.get(projectId)?.delete(res);
    if (projectConnections.get(projectId)?.size === 0) {
      projectConnections.delete(projectId);
    }
  };
}

export function emitEvent(
  projectId: string,
  agent: AgentName,
  type: AgentEventType,
  message: string,
  metadata?: Record<string, unknown>
): void {
  const event: AgentEvent = {
    id: uuidv4(),
    projectId,
    timestamp: new Date().toISOString(),
    agent,
    type,
    message,
    metadata,
  };

  const connections = projectConnections.get(projectId);
  if (!connections || connections.size === 0) return;

  const data = JSON.stringify(event);

  for (const res of connections) {
    try {
      res.write(`id: ${event.id}\n`);
      res.write(`event: ${type}\n`);
      res.write(`data: ${data}\n\n`);
    } catch {
      connections.delete(res);
    }
  }
}
