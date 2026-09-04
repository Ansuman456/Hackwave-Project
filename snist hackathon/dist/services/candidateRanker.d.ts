/**
 * Candidate Ranker Service
 *
 * Deterministic scoring of candidate entities using weighted formula:
 * Score = (Relevance × 0.40) + (Directness × 0.30) + (Authority × 0.20) + (Evidence × 0.10)
 */
export interface CandidateForRanking {
    id: string;
    name: string;
    relevanceScore: number;
    directnessScore: number;
    authorityScore: number;
    evidenceCount: number;
    sources: any[];
}
export interface RankedCandidate extends CandidateForRanking {
    compositeScore: number;
}
export declare function rankCandidates(candidates: CandidateForRanking[], maxCount?: number): RankedCandidate[];
//# sourceMappingURL=candidateRanker.d.ts.map