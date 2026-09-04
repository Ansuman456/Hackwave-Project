import { CandidateIdea, DiscoveredSolution } from "../../graph/state";

export interface ScoredCandidate extends CandidateIdea {
  overallConceptScore: number;
}

const WEIGHTS = {
  problemFit: 0.15,
  differentiation: 0.20,
  featureNovelty: 0.15,
  workflowNovelty: 0.15,
  impact: 0.15,
  hackathonFit: 0.10,
  demoPotential: 0.05,
  aiNecessity: 0.05,
};

export function scoreCandidates(
  candidates: CandidateIdea[],
  existingSolutions: DiscoveredSolution[]
): ScoredCandidate[] {
  const scored = candidates.map((c) => {
    // Calculate composite score from individual scores
    const overallConceptScore =
      c.innovationScore * WEIGHTS.problemFit +
      c.differentiationScore * WEIGHTS.differentiation +
      c.innovationScore * WEIGHTS.featureNovelty +
      c.innovationScore * WEIGHTS.workflowNovelty +
      c.impactScore * WEIGHTS.impact +
      c.estimatedHackathonFit * WEIGHTS.hackathonFit +
      c.impactScore * WEIGHTS.demoPotential +
      c.innovationScore * WEIGHTS.aiNecessity;

    return {
      ...c,
      overallConceptScore: Math.round(overallConceptScore * 100) / 100,
    };
  });

  // Sort by overall score descending
  scored.sort((a, b) => b.overallConceptScore - a.overallConceptScore);

  return scored;
}

export function filterDuplicateCandidates(
  candidates: ScoredCandidate[],
  existingSolutions: DiscoveredSolution[],
  similarityThreshold: number = 0.7
): ScoredCandidate[] {
  const filtered: ScoredCandidate[] = [];

  for (const candidate of candidates) {
    // Check against existing solutions
    const isTooSimilar = existingSolutions.some((sol) => {
      const overlap = calculateFeatureOverlap(
        candidate.keyFeatures.map((f) => f.name),
        sol.features.map((f) => f.name)
      );
      return overlap > similarityThreshold;
    });

    if (!isTooSimilar) {
      filtered.push(candidate);
    } else {
      console.log(`[Innovation] Filtered candidate "${candidate.name}" - too similar to existing solution`);
    }
  }

  // Also check for duplicate candidates
  const uniqueCandidates: ScoredCandidate[] = [];
  for (const candidate of filtered) {
    const isDuplicate = uniqueCandidates.some((existing) => {
      const overlap = calculateFeatureOverlap(
        candidate.keyFeatures.map((f) => f.name),
        existing.keyFeatures.map((f) => f.name)
      );
      return overlap > similarityThreshold;
    });

    if (!isDuplicate) {
      uniqueCandidates.push(candidate);
    }
  }

  return uniqueCandidates;
}

function calculateFeatureOverlap(featuresA: string[], featuresB: string[]): number {
  if (featuresA.length === 0 || featuresB.length === 0) return 0;

  const setA = new Set(featuresA.map((f) => f.toLowerCase().trim()));
  const setB = new Set(featuresB.map((f) => f.toLowerCase().trim()));

  let intersection = 0;
  for (const f of setA) {
    if (setB.has(f)) intersection++;
  }

  const union = setA.size + setB.size - intersection;
  return union > 0 ? intersection / union : 0;
}

export function getClosestExistingSolutions(
  candidate: CandidateIdea,
  existingSolutions: DiscoveredSolution[],
  topN: number = 3
): Array<{ solutionId: string; overlap: string[]; differences: string[]; strength: number }> {
  const candidateFeatures = new Set(
    candidate.keyFeatures.map((f) => f.name.toLowerCase().trim())
  );

  const similarities = existingSolutions.map((sol) => {
    const solFeatures = new Set(sol.features.map((f) => f.name.toLowerCase().trim()));

    const overlap = [...candidateFeatures].filter((f) => solFeatures.has(f));
    const differences = [
      ...[...candidateFeatures].filter((f) => !solFeatures.has(f)),
      ...[...solFeatures].filter((f) => !candidateFeatures.has(f)),
    ];

    const strength = overlap.length / (overlap.length + differences.length || 1);

    return {
      solutionId: sol.id,
      overlap,
      differences,
      strength,
    };
  });

  similarities.sort((a, b) => b.strength - a.strength);

  return similarities.slice(0, topN);
}
