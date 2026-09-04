"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTechStacks = generateTechStacks;
const messages_1 = require("@langchain/core/messages");
const llmFactory_1 = require("../../utils/llmFactory");
const llmRetry_1 = require("../../utils/llmRetry");
const techStackGenerator_1 = require("../../prompts/techStackGenerator");
const MAX_RETRIES = 4;
async function generateTechStacks(expandedSolution, teamProfiles, feasibilitySummary, projectRequirements, hackathonDuration, forbiddenTech) {
    const model = (0, llmFactory_1.getLLM)("strategic_analysis");
    const structuredModel = model.withStructuredOutput(techStackGenerator_1.TechStackOutputSchema, {
        name: "TechStackOptions",
        method: "functionCalling",
    });
    const systemMessage = new messages_1.SystemMessage(techStackGenerator_1.TECH_STACK_SYSTEM_PROMPT);
    const profilesText = teamProfiles
        .map((p) => `[${p.memberId}] ${p.name} — ${p.primaryRole}\nSkills: ${p.parsedSkills.join(", ")}\nProficiency: ${Object.entries(p.proficiencyLevels).map(([k, v]) => `${k}(${v})`).join(", ")}`)
        .join("\n\n");
    const userPrompt = (0, techStackGenerator_1.TECH_STACK_USER_TEMPLATE)(expandedSolution, profilesText, feasibilitySummary, `Required: ${projectRequirements.requiredCapabilities.join(", ")}\nTechnical: ${projectRequirements.technicalCapabilities.join(", ")}`, hackathonDuration, forbiddenTech);
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
            // Ensure proper ranking
            const sorted = result.techStackOptions
                .sort((a, b) => b.overallScore - a.overallScore)
                .map((opt, i) => ({ ...opt, rank: i + 1 }));
            return { success: true, techStackOptions: sorted, retryCount };
        }
        catch (err) {
            lastError =
                err instanceof Error ? err.message : "Unknown error during LLM call";
            if ((0, llmRetry_1.isTransientLLMError)(lastError)) {
                const delay = (0, llmRetry_1.backoffDelay)(attempt);
                console.log(`[TECH_STACK] Transient error encountered. Backing off ${delay}ms...`);
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
//# sourceMappingURL=techStackGenerator.js.map