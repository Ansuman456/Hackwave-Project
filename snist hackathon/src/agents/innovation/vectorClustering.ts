import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { getConfig } from "../../config/env";
import { DiscoveredSolution, SolutionCluster } from "../../graph/state";

let embeddingsInstance: GoogleGenerativeAIEmbeddings | null = null;

function getEmbeddings(): GoogleGenerativeAIEmbeddings {
  if (!embeddingsInstance) {
    const config = getConfig();
    embeddingsInstance = new GoogleGenerativeAIEmbeddings({
      apiKey: config.GEMINI_API_KEY,
      model: "text-embedding-004",
    });
  }
  return embeddingsInstance;
}

function normalizeSolutionText(sol: DiscoveredSolution): string {
  const featureNames = sol.features.map((f) => f.name).join(", ");
  return `${sol.name}: ${sol.description}. Problem: ${sol.problemSolved}. Approach: ${sol.approach}. Features: ${featureNames}.`;
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

interface EmbeddedSolution {
  solutionId: string;
  embedding: number[];
}

export async function generateEmbeddings(
  solutions: DiscoveredSolution[]
): Promise<EmbeddedSolution[]> {
  const embeddings = getEmbeddings();
  const texts = solutions.map(normalizeSolutionText);

  // Batch embed (API supports batching)
  const vectors = await embeddings.embedDocuments(texts);

  return solutions.map((sol, i) => ({
    solutionId: sol.id,
    embedding: vectors[i],
  }));
}

export function clusterSolutions(
  embedded: EmbeddedSolution[],
  solutions: DiscoveredSolution[],
  maxClusters: number = 4
): SolutionCluster[] {
  if (embedded.length === 0) return [];
  if (embedded.length <= maxClusters) {
    // Each solution is its own cluster
    return embedded.map((e, i) => {
      const sol = solutions.find((s) => s.id === e.solutionId);
      return {
        id: `cluster_${i + 1}`,
        name: sol?.name || `Cluster ${i + 1}`,
        description: sol?.description || "",
        solutionIds: [e.solutionId],
        commonFeatures: sol?.features.map((f) => f.name) || [],
        distinguishingCharacteristics: [],
      };
    });
  }

  // Simple agglomerative clustering using cosine similarity
  const n = embedded.length;
  const simMatrix: number[][] = Array.from({ length: n }, () => Array(n).fill(0));

  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      const sim = cosineSimilarity(embedded[i].embedding, embedded[j].embedding);
      simMatrix[i][j] = sim;
      simMatrix[j][i] = sim;
    }
  }

  // Greedy clustering: assign each solution to the most similar existing cluster seed
  const clusterSeeds: number[] = [0];
  const assignments: number[] = Array(n).fill(-1);
  assignments[0] = 0;

  for (let i = 1; i < n; i++) {
    let bestCluster = 0;
    let bestSim = -1;

    for (const seed of clusterSeeds) {
      if (simMatrix[i][seed] > bestSim) {
        bestSim = simMatrix[i][seed];
        bestCluster = assignments[seed];
      }
    }

    // If best similarity is very low, create new cluster
    if (bestSim < 0.3 && clusterSeeds.length < maxClusters) {
      clusterSeeds.push(i);
      assignments[i] = clusterSeeds.length - 1;
    } else {
      assignments[i] = bestCluster;
    }
  }

  // Build clusters
  const clusterMap = new Map<number, string[]>();
  for (let i = 0; i < n; i++) {
    const cId = assignments[i];
    if (!clusterMap.has(cId)) clusterMap.set(cId, []);
    clusterMap.get(cId)!.push(embedded[i].solutionId);
  }

  const clusters: SolutionCluster[] = [];
  let clusterIdx = 1;

  for (const [_, solIds] of clusterMap) {
    // Find common features across solutions in this cluster
    const featureCounts = new Map<string, number>();
    for (const solId of solIds) {
      const sol = solutions.find((s) => s.id === solId);
      if (sol) {
        for (const f of sol.features) {
          const canonical = f.name.toLowerCase().trim();
          featureCounts.set(canonical, (featureCounts.get(canonical) || 0) + 1);
        }
      }
    }

    const commonFeatures = Array.from(featureCounts.entries())
      .filter(([_, count]) => count >= Math.ceil(solIds.length * 0.5))
      .map(([name]) => name);

    const firstSol = solutions.find((s) => s.id === solIds[0]);

    clusters.push({
      id: `cluster_${clusterIdx}`,
      name: `Cluster ${clusterIdx}`,
      description: `Solutions cluster containing ${solIds.length} related solutions`,
      solutionIds: solIds,
      commonFeatures,
      distinguishingCharacteristics: [],
    });

    clusterIdx++;
  }

  return clusters;
}

export function assignClusterNames(
  clusters: SolutionCluster[],
  solutions: DiscoveredSolution[]
): SolutionCluster[] {
  // Use dominant feature themes to name clusters
  return clusters.map((cluster) => {
    const sols = cluster.solutionIds
      .map((id) => solutions.find((s) => s.id === id))
      .filter(Boolean) as DiscoveredSolution[];

    if (sols.length === 0) return cluster;

    // Use the most common approach keyword as cluster name
    const approaches = sols.map((s) => s.approach.substring(0, 50));
    const name = approaches[0]?.substring(0, 40) || cluster.name;

    return {
      ...cluster,
      name,
      description: `Cluster of ${sols.length} solutions: ${sols.map((s) => s.name).join(", ")}`,
    };
  });
}
