"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runStrategist = runStrategist;
const messages_1 = require("@langchain/core/messages");
const state_1 = require("../../graph/state");
const llmFactory_1 = require("../../utils/llmFactory");
const llmRetry_1 = require("../../utils/llmRetry");
const strategist_system_1 = require("../../prompts/strategist.system");
const strategist_user_1 = require("../../prompts/strategist.user");
const strategist_validator_1 = require("./strategist.validator");
const MAX_RETRIES = 4;
async function runStrategist(input) {
    const model = (0, llmFactory_1.getLLM)("strategic_analysis");
    const structuredModel = model.withStructuredOutput(state_1.ProblemAnalysisSchema, {
        name: "ProblemAnalysis",
        method: "functionCalling",
    });
    const systemMessage = new messages_1.SystemMessage(strategist_system_1.STRATEGIST_SYSTEM_PROMPT);
    const userPrompt = (0, strategist_user_1.buildStrategistUserPrompt)(input);
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
                    `Your previous attempt failed validation with these errors:`,
                    lastError,
                    "",
                    "Fix ALL the above issues. Ensure:",
                    "1. Every enum field uses EXACTLY the allowed values (e.g., evidence must be 'explicit' or 'inferred', never anything else).",
                    "2. Every required array has at least the minimum number of entries.",
                    "3. Every string field has meaningful content (not empty or placeholder).",
                    "4. The JSON is complete — do not truncate any field.",
                    "",
                    "Output ONLY the corrected JSON.",
                ].join("\n");
            }
            const userMessage = new messages_1.HumanMessage(currentPrompt);
            const result = await structuredModel.invoke([systemMessage, userMessage]);
            // withStructuredOutput returns the parsed Zod object directly
            // But we run it through our validator for additional semantic checks
            const validation = (0, strategist_validator_1.validateProblemAnalysis)(result);
            if (validation.valid) {
                return {
                    success: true,
                    analysis: result,
                    validation,
                    retryCount,
                };
            }
            // Build detailed error message for retry
            lastError = formatValidationErrors(validation);
        }
        catch (err) {
            console.error("[STRATEGIST LLM EXCEPTION]:", err);
            lastError =
                err instanceof Error ? err.message : "Unknown error during LLM call";
            if ((0, llmRetry_1.isTransientLLMError)(lastError)) {
                const delay = (0, llmRetry_1.backoffDelay)(attempt);
                console.log(`[STRATEGIST] Transient error encountered. Backing off ${delay}ms before retry...`);
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
function formatValidationErrors(validation) {
    const lines = [];
    if (validation.errors.length > 0) {
        lines.push("ERRORS (must fix):");
        for (const e of validation.errors) {
            lines.push(`  - ${e}`);
        }
    }
    if (validation.warnings.length > 0) {
        lines.push("WARNINGS (should fix):");
        for (const w of validation.warnings) {
            lines.push(`  - ${w}`);
        }
    }
    return lines.join("\n");
}
//# sourceMappingURL=strategist.agent.js.map