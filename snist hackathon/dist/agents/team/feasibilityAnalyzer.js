"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeFeasibility = analyzeFeasibility;
const messages_1 = require("@langchain/core/messages");
const llmFactory_1 = require("../../utils/llmFactory");
const llmRetry_1 = require("../../utils/llmRetry");
const feasibilityAnalyzer_1 = require("../../prompts/feasibilityAnalyzer");
const MAX_RETRIES = 4;
async function analyzeFeasibility(selectedIdea, teamProfiles, projectRequirements, hackathonDuration, judgingCriteria) {
    const model = (0, llmFactory_1.getLLM)("strategic_analysis");
    const structuredModel = model.withStructuredOutput(feasibilityAnalyzer_1.FeasibilityOutputSchema, {
        name: "FeasibilityAnalysis",
        method: "functionCalling",
    });
    const systemMessage = new messages_1.SystemMessage(feasibilityAnalyzer_1.FEASIBILITY_SYSTEM_PROMPT);
    const ideaText = `
Name: ${selectedIdea.name}
Description: ${selectedIdea.detailedDescription || selectedIdea.oneLineDescription}
Problem: ${selectedIdea.problemSolved}
Users: ${selectedIdea.targetUsers.join(", ")}
Features: ${selectedIdea.keyFeatures.map((f) => f.name).join(", ")}
Complexity: ${selectedIdea.estimatedComplexity}
Innovation Score: ${selectedIdea.innovationScore}/10
Impact Score: ${selectedIdea.impactScore}/10
  `.trim();
    const profilesText = teamProfiles
        .map((p) => `[${p.memberId}] ${p.name} — ${p.primaryRole}\nSkills: ${p.parsedSkills.join(", ")}\nSnippet: ${p.resumeSnippet}`)
        .join("\n\n");
    const reqText = `
Required Capabilities: ${projectRequirements.requiredCapabilities.join(", ")}
Technical Capabilities: ${projectRequirements.technicalCapabilities.join(", ")}
Complexity Areas: ${projectRequirements.complexityAreas.join(", ")}
Potential Skill Gaps: ${projectRequirements.potentialSkillGaps.join(", ")}
  `.trim();
    const userPrompt = (0, feasibilityAnalyzer_1.FEASIBILITY_USER_TEMPLATE)(ideaText, profilesText, reqText, hackathonDuration, judgingCriteria);
    let lastError = "";
    let retryCount = 0;
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
            let currentPrompt = userPrompt;
            if (attempt > 0) {
                retryCount = attempt;
                currentPrompt = [
                    userPrompt,
                    "",
                    "=== RETRY INSTRUCTIONS ===",
                    `Your previous attempt failed: ${lastError}`,
                    "Fix the issues and return ONLY valid JSON.",
                ].join("\n");
            }
            const userMessage = new messages_1.HumanMessage(currentPrompt);
            const result = await structuredModel.invoke([
                systemMessage,
                userMessage,
            ]);
            return {
                success: true,
                expandedSolution: result.expandedSolution,
                dataAvailability: result.dataAvailability,
                feasibility: result.feasibility,
                retryCount,
            };
        }
        catch (err) {
            lastError =
                err instanceof Error ? err.message : "Unknown error during LLM call";
            if ((0, llmRetry_1.isTransientLLMError)(lastError)) {
                const delay = (0, llmRetry_1.backoffDelay)(attempt);
                console.log(`[FEASIBILITY] Transient error encountered. Backing off ${delay}ms...`);
                await (0, llmRetry_1.sleep)(delay);
            }
        }
    }
    return {
        success: false,
        retryCount,
        error: `Failed after ${MAX_RETRIES + 1} attempts. Last error: ${lastError}`,
    };
}
//# sourceMappingURL=feasibilityAnalyzer.js.map