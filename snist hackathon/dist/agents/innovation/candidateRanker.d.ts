import { CandidateIdea, DiscoveredSolution } from "../../graph/state";
export interface ScoredCandidate extends CandidateIdea {
    overallConceptScore: number;
}
export declare function scoreCandidates(candidates: CandidateIdea[], existingSolutions: DiscoveredSolution[]): ScoredCandidate[];
export declare function filterDuplicateCandidates(candidates: ScoredCandidate[], existingSolutions: DiscoveredSolution[], similarityThreshold?: number): ScoredCandidate[];
export declare function getClosestExistingSolutions(candidate: CandidateIdea, existingSolutions: DiscoveredSolution[], topN?: number): Array<{
    solutionId: string;
    overlap: string[];
    differences: string[];
    strength: number;
}>;
//# sourceMappingURL=candidateRanker.d.ts.map