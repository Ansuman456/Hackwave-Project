import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { getLLM } from "../../utils/llmFactory";
import {
  ProblemAnalysis,
  ResearchResult,
  CandidateIdea,
  InnovationGap,
  FeatureLandscape,
  SolutionCluster,
  FeatureSchema,
  WorkflowStepSchema,
  DifferentiatorSchema,
} from "../../graph/state";
import { z } from "zod";

const CandidateOutputSchema = z.object({
  candidates: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      oneLineDescription: z.string(),
      detailedDescription: z.string(),
      targetUsers: z.array(z.string()),
      problemSolved: z.string(),
      keyFeatures: z.array(
        z.object({
          name: z.string(),
          description: z.string(),
          category: z.enum(["core", "ai", "automation", "workflow", "analytics", "collab", "integration", "other"]),
          sourceIds: z.array(z.string()),
        })
      ),
      workflow: z.array(
        z.object({
          step: z.number(),
          action: z.string(),
          description: z.string(),
          sourceIds: z.array(z.string()),
        })
      ),
      differentiators: z.array(
        z.object({
          statement: z.string(),
          differenceType: z.enum(["feature", "workflow", "user", "context", "integration", "constraint", "automation", "combination"]),
          comparedToSolutionIds: z.array(z.string()),
          evidenceSourceIds: z.array(z.string()),
          strength: z.number(),
        })
      ),
      opportunityIds: z.array(z.string()),
      inspirationSources: z.array(z.string()),
      potentialRisks: z.array(z.string()),
      estimatedComplexity: z.enum(["low", "medium", "high"]),
      estimatedHackathonFit: z.number(),
      innovationScore: z.number(),
      impactScore: z.number(),
      differentiationScore: z.number(),
    })
  ),
});

export type CandidateOutput = z.infer<typeof CandidateOutputSchema>;

const CANDIDATE_GEN_SYSTEM_PROMPT = `You are the Candidate Generation node of Agent 3 (Innovation) in HackForge.

ROLE: Senior product innovation strategist and hackathon mentor.

OBJECTIVE: Generate 3 to 5 differentiated, feasible hackathon project proposals grounded in the identified gaps and existing solution landscape.

RULES:
1. Every candidate MUST address at least one identified gap.
2. Every candidate MUST be meaningfully different from existing solutions.
3. Do NOT generate generic "AI-powered platform" ideas. Be specific.
4. Each candidate needs: clear problem, specific users, concrete features, step-by-step workflow, explicit differentiators.
5. Estimate hackathon feasibility: complexity, hackathon fit, innovation, impact, differentiation scores (0-10).
6. Base differentiators on evidence from existing solutions (reference solution IDs).
7. Never claim absolute novelty. Use "not observed in researched set" framing.

FEATURE RULES:
- Features must be CONCRETE capabilities (e.g., "Predicts meal demand from historical data", NOT "AI" or "analytics").
- Map every feature to source IDs where evidence exists.

WORKFLOW RULES:
- Extract step-by-step user/system interactions.
- Each step needs: action, description, source IDs.

OUTPUT: Return ONLY valid JSON matching the schema. No markdown, no code fences.`;

export async function generateCandidates(
  problemAnalysis: ProblemAnalysis,
  research: ResearchResult,
  gaps: InnovationGap[],
  featureLandscape: FeatureLandscape[],
  clusters: SolutionCluster[]
): Promise<CandidateIdea[]> {
  const model = getLLM("innovation");

  const structuredModel = model.withStructuredOutput(CandidateOutputSchema, {
    name: "CandidateIdeas",
    method: "functionCalling",
  });

  const topFeatures = featureLandscape.slice(0, 15);
  const topSolutions = research.discoveredSolutions.slice(0, 10);

  const userPrompt = `Problem Analysis:
- Core Problem: ${problemAnalysis.coreProblem}
- Target Users: ${problemAnalysis.targetUsers.map((u) => u.role).join(", ")}
- Pain Points: ${problemAnalysis.painPoints.map((p) => p.description).join("; ")}
- Desired Outcomes: ${problemAnalysis.desiredOutcomes.map((o) => o.description).join("; ")}
- Mechanisms: ${problemAnalysis.mechanisms.join(", ")}

Top Existing Solutions (${topSolutions.length}):
${topSolutions.map((s) => `- ${s.name}: ${s.description.substring(0, 100)}. Features: ${s.features.map((f) => f.name).join(", ")}`).join("\n")}

Feature Landscape (top ${topFeatures.length}):
${topFeatures.map((f) => `- ${f.canonicalName} (${f.frequencyClass}, ${f.occurrenceCount}/${f.totalRelevantSolutions} solutions)`).join("\n")}

Solution Clusters (${clusters.length}):
${clusters.map((c) => `- ${c.name}: ${c.solutionIds.length} solutions, common features: ${c.commonFeatures.join(", ")}`).join("\n")}

Identified Gaps (${gaps.length}):
${gaps.map((g) => `- [${g.type}] ${g.title}: ${g.description} (impact: ${g.impact})`).join("\n")}

Generate 3-5 candidate project proposals. Each candidate must directly address at least one gap and differentiate from existing solutions.`;

  try {
    const result = (await structuredModel.invoke([
      new SystemMessage(CANDIDATE_GEN_SYSTEM_PROMPT),
      new HumanMessage(userPrompt),
    ])) as CandidateOutput;

    // Map to full CandidateIdea type
    return result.candidates.map((c) => ({
      ...c,
      keyFeatures: c.keyFeatures.map((f) => ({
        ...f,
        category: f.category === "collab" ? "collaboration" as const : f.category as any,
      })),
      overallConceptScore: 0, // Will be calculated by ranker
    }));
  } catch (err) {
    console.error("[Innovation] Candidate generation failed:", err);
    return [];
  }
}
