"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCandidates = generateCandidates;
const messages_1 = require("@langchain/core/messages");
const llmFactory_1 = require("../../utils/llmFactory");
const zod_1 = require("zod");
const CandidateOutputSchema = zod_1.z.object({
    candidates: zod_1.z.array(zod_1.z.object({
        id: zod_1.z.string(),
        name: zod_1.z.string(),
        oneLineDescription: zod_1.z.string(),
        detailedDescription: zod_1.z.string(),
        targetUsers: zod_1.z.array(zod_1.z.string()),
        problemSolved: zod_1.z.string(),
        keyFeatures: zod_1.z.array(zod_1.z.object({
            name: zod_1.z.string(),
            description: zod_1.z.string(),
            category: zod_1.z.enum(["core", "ai", "automation", "workflow", "analytics", "collab", "integration", "other"]),
            sourceIds: zod_1.z.array(zod_1.z.string()),
        })),
        workflow: zod_1.z.array(zod_1.z.object({
            step: zod_1.z.number(),
            action: zod_1.z.string(),
            description: zod_1.z.string(),
            sourceIds: zod_1.z.array(zod_1.z.string()),
        })),
        differentiators: zod_1.z.array(zod_1.z.object({
            statement: zod_1.z.string(),
            differenceType: zod_1.z.enum(["feature", "workflow", "user", "context", "integration", "constraint", "automation", "combination"]),
            comparedToSolutionIds: zod_1.z.array(zod_1.z.string()),
            evidenceSourceIds: zod_1.z.array(zod_1.z.string()),
            strength: zod_1.z.number(),
        })),
        opportunityIds: zod_1.z.array(zod_1.z.string()),
        inspirationSources: zod_1.z.array(zod_1.z.string()),
        potentialRisks: zod_1.z.array(zod_1.z.string()),
        estimatedComplexity: zod_1.z.enum(["low", "medium", "high"]),
        estimatedHackathonFit: zod_1.z.number(),
        innovationScore: zod_1.z.number(),
        impactScore: zod_1.z.number(),
        differentiationScore: zod_1.z.number(),
    })),
});
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
async function generateCandidates(problemAnalysis, research, gaps, featureLandscape, clusters) {
    const model = (0, llmFactory_1.getLLM)("innovation");
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
            new messages_1.SystemMessage(CANDIDATE_GEN_SYSTEM_PROMPT),
            new messages_1.HumanMessage(userPrompt),
        ]));
        // Map to full CandidateIdea type
        return result.candidates.map((c) => ({
            ...c,
            keyFeatures: c.keyFeatures.map((f) => ({
                ...f,
                category: f.category === "collab" ? "collaboration" : f.category,
            })),
            overallConceptScore: 0, // Will be calculated by ranker
        }));
    }
    catch (err) {
        console.error("[Innovation] Candidate generation failed:", err);
        return [];
    }
}
//# sourceMappingURL=candidateGenerator.js.map