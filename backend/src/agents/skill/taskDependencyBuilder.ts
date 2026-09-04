import {
  ProjectTask,
  TaskDependencyEdge,
  TaskDependencyGraph,
} from "../../graph/state";

export function buildTaskDependencyGraph(
  tasks: ProjectTask[],
  llmEdges: TaskDependencyEdge[] = []
): TaskDependencyGraph {
  const taskIds = new Set(tasks.map((t) => t.id));

  // Edges represent "from must happen before to".
  const edgeMap = new Map<string, TaskDependencyEdge>();

  const addEdge = (fromTaskId: string, toTaskId: string, type: TaskDependencyEdge["type"]) => {
    if (!taskIds.has(fromTaskId) || !taskIds.has(toTaskId)) return;
    if (fromTaskId === toTaskId) return;
    const key = `${fromTaskId}->${toTaskId}`;
    if (!edgeMap.has(key)) {
      edgeMap.set(key, { fromTaskId, toTaskId, type });
    }
  };

  // 1. Task.dependencies -> required_before edges
  for (const task of tasks) {
    for (const depId of task.dependencies || []) {
      addEdge(depId, task.id, "required_before");
    }
  }

  // 2. LLM-provided edges
  for (const edge of llmEdges) {
    addEdge(edge.fromTaskId, edge.toTaskId, edge.type);
  }

  const edges = Array.from(edgeMap.values());

  const criticalPath = computeCriticalPath(tasks, edges);

  return {
    tasks: tasks.map((t) => t.id),
    edges,
    criticalPath,
  };
}

function computeCriticalPath(tasks: ProjectTask[], edges: TaskDependencyEdge[]): string[] {
  if (tasks.length === 0) return [];

  const weight = new Map<string, number>(tasks.map((t) => [t.id, Math.max(t.estimatedHours, 0.5)]));
  const adj = new Map<string, string[]>();
  const indegree = new Map<string, number>(tasks.map((t) => [t.id, 0]));

  for (const task of tasks) {
    if (!adj.has(task.id)) adj.set(task.id, []);
  }

  for (const edge of edges) {
    if (!adj.has(edge.fromTaskId)) adj.set(edge.fromTaskId, []);
    adj.get(edge.fromTaskId)!.push(edge.toTaskId);
    indegree.set(edge.toTaskId, (indegree.get(edge.toTaskId) || 0) + 1);
  }

  // Kahn topological sort
  const queue: string[] = [];
  for (const [id, deg] of indegree) {
    if (deg === 0) queue.push(id);
  }

  const order: string[] = [];
  const inDeg = new Map(indegree);
  const q = [...queue];

  while (q.length > 0) {
    const node = q.shift()!;
    order.push(node);
    for (const next of adj.get(node) || []) {
      const d = (inDeg.get(next) || 1) - 1;
      inDeg.set(next, d);
      if (d === 0) q.push(next);
    }
  }

  // Longest path DP (node weight = estimated hours)
  const dist = new Map<string, number>();
  const prev = new Map<string, string | null>();

  for (const id of tasks.map((t) => t.id)) {
    dist.set(id, weight.get(id) || 0.5);
    prev.set(id, null);
  }

  for (const node of order) {
    for (const next of adj.get(node) || []) {
      const candidate = (dist.get(node) || 0) + (weight.get(next) || 0.5);
      if (candidate > (dist.get(next) || 0)) {
        dist.set(next, candidate);
        prev.set(next, node);
      }
    }
  }

  // Find end of longest path
  let endNode = tasks[0].id;
  let maxDist = -1;
  for (const id of tasks.map((t) => t.id)) {
    const d = dist.get(id) || 0;
    if (d > maxDist) {
      maxDist = d;
      endNode = id;
    }
  }

  // Reconstruct path
  const path: string[] = [];
  let cur: string | null | undefined = endNode;
  while (cur) {
    path.unshift(cur);
    cur = prev.get(cur) || null;
  }

  return path;
}
