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

const WEIGHTS = {
  relevance: 0.40,
  directness: 0.30,
  authority: 0.20,
  evidence: 0.10,
};

export function rankCandidates(
  candidates: CandidateForRanking[],
  maxCount: number = 15
): RankedCandidate[] {
  const scored = candidates.map((c) => ({
    ...c,
    compositeScore: calculateCompositeScore(c),
  }));

  // Sort by composite score descending
  scored.sort((a, b) => b.compositeScore - a.compositeScore);

  return scored.slice(0, maxCount);
}

function calculateCompositeScore(candidate: CandidateForRanking): number {
  const relevance = clamp(candidate.relevanceScore, 0, 1);
  const directness = clamp(candidate.directnessScore, 0, 1);
  const authority = clamp(candidate.authorityScore, 0, 1);
  const evidence = normalizeEvidenceCount(candidate.evidenceCount);

  return (
    relevance * WEIGHTS.relevance +
    directness * WEIGHTS.directness +
    authority * WEIGHTS.authority +
    evidence * WEIGHTS.evidence
  );
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function normalizeEvidenceCount(count: number): number {
  // Normalize evidence count to 0-1 scale
  // 1 source = 0.2, 5 sources = 0.6, 10+ sources = 1.0
  if (count <= 0) return 0;
  if (count >= 10) return 1;
  return 0.1 + (count / 10) * 0.9;
}
