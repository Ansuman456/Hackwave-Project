import { DiscoveredSolution, SolutionCluster } from "../../graph/state";
interface EmbeddedSolution {
    solutionId: string;
    embedding: number[];
}
export declare function generateEmbeddings(solutions: DiscoveredSolution[]): Promise<EmbeddedSolution[]>;
export declare function clusterSolutions(embedded: EmbeddedSolution[], solutions: DiscoveredSolution[], maxClusters?: number): SolutionCluster[];
export declare function assignClusterNames(clusters: SolutionCluster[], solutions: DiscoveredSolution[]): SolutionCluster[];
export {};
//# sourceMappingURL=vectorClustering.d.ts.map