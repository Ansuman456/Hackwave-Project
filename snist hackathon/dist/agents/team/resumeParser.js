"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseResumes = parseResumes;
const messages_1 = require("@langchain/core/messages");
const llmFactory_1 = require("../../utils/llmFactory");
const llmRetry_1 = require("../../utils/llmRetry");
const resumeExtractor_1 = require("../../prompts/resumeExtractor");
const MAX_RETRIES = 4;
async function parseResumes(resumes) {
    if (resumes.length === 0) {
        return {
            success: true,
            members: [],
            retryCount: 0,
        };
    }
    const model = (0, llmFactory_1.getLLM)("strategic_analysis");
    const structuredModel = model.withStructuredOutput(resumeExtractor_1.ResumeExtractionOutputSchema, { name: "ResumeExtraction", method: "functionCalling" });
    const systemMessage = new messages_1.SystemMessage(resumeExtractor_1.RESUME_EXTRACTOR_SYSTEM_PROMPT);
    const userPrompt = (0, resumeExtractor_1.RESUME_EXTRACTOR_USER_TEMPLATE)(resumes);
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
            const members = result.members.map((m, i) => ({
                ...m,
                memberId: m.memberId || `member_${i + 1}`,
                parsedSkills: m.parsedSkills || [],
                proficiencyLevels: m.proficiencyLevels || {},
            }));
            return { success: true, members, retryCount };
        }
        catch (err) {
            lastError =
                err instanceof Error ? err.message : "Unknown error during LLM call";
            if ((0, llmRetry_1.isTransientLLMError)(lastError)) {
                const delay = (0, llmRetry_1.backoffDelay)(attempt);
                console.log(`[RESUME_PARSER] Transient error encountered. Backing off ${delay}ms...`);
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
//# sourceMappingURL=resumeParser.js.map