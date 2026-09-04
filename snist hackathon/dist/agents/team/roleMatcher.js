"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchRoles = matchRoles;
const messages_1 = require("@langchain/core/messages");
const llmFactory_1 = require("../../utils/llmFactory");
const llmRetry_1 = require("../../utils/llmRetry");
const roleAssignment_1 = require("../../prompts/roleAssignment");
const MAX_RETRIES = 4;
async function matchRoles(teamProfiles, projectRequirements, hackathonDuration) {
    if (teamProfiles.length === 0) {
        return {
            success: false,
            error: "No team profiles to analyze",
            retryCount: 0,
        };
    }
    const model = (0, llmFactory_1.getLLM)("strategic_analysis");
    const structuredModel = model.withStructuredOutput(roleAssignment_1.RoleAssignmentOutputSchema, { name: "RoleAssignment", method: "functionCalling" });
    const systemMessage = new messages_1.SystemMessage(roleAssignment_1.ROLE_ASSIGNMENT_SYSTEM_PROMPT);
    const profilesText = teamProfiles
        .map((p) => `[${p.memberId}] ${p.name} — ${p.primaryRole}\nSkills: ${p.parsedSkills.join(", ")}\nProficiency: ${Object.entries(p.proficiencyLevels).map(([k, v]) => `${k}(${v})`).join(", ")}${p.yearsExperience ? `\nExperience: ${p.yearsExperience} years` : ""}\nSnippet: ${p.resumeSnippet}`)
        .join("\n\n");
    const userPrompt = (0, roleAssignment_1.ROLE_ASSIGNMENT_USER_TEMPLATE)(profilesText, projectRequirements, hackathonDuration);
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
                roleAssignments: result.roleAssignments,
                skillGaps: result.skillGaps,
                overallTeamStrategy: result.overallTeamStrategy,
                retryCount,
            };
        }
        catch (err) {
            lastError =
                err instanceof Error ? err.message : "Unknown error during LLM call";
            if ((0, llmRetry_1.isTransientLLMError)(lastError)) {
                const delay = (0, llmRetry_1.backoffDelay)(attempt);
                console.log(`[ROLE_MATCHER] Transient error encountered. Backing off ${delay}ms...`);
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
//# sourceMappingURL=roleMatcher.js.map