"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAiRagArchitecture = generateAiRagArchitecture;
const messages_1 = require("@langchain/core/messages");
const llmFactory_1 = require("../../utils/llmFactory");
const llmRetry_1 = require("../../utils/llmRetry");
const ctoPrompts_1 = require("../../prompts/ctoPrompts");
const zod_1 = require("zod");
const MAX_RETRIES = 4;
const AiRagOutputSchema = zod_1.z.object({
    aiArchitecture: zod_1.z.object({
        llmModels: zod_1.z.array(zod_1.z.object({
            provider: zod_1.z.string(),
            model: zod_1.z.string(),
            purpose: zod_1.z.string(),
            temperature: zod_1.z.number().nullable().optional(),
            maxTokens: zod_1.z.number().nullable().optional(),
        })),
        prompts: zod_1.z.array(zod_1.z.object({
            name: zod_1.z.string(),
            type: zod_1.z.enum(["system", "user", "few_shot", "chain_of_thought"]),
            purpose: zod_1.z.string(),
            template: zod_1.z.string().nullable().optional(),
        })),
        agentTools: zod_1.z.array(zod_1.z.object({
            name: zod_1.z.string(),
            type: zod_1.z.enum(["search", "code_execution", "web_scraping", "api_call", "file_operation", "other"]),
            purpose: zod_1.z.string(),
            integration: zod_1.z.string(),
        })),
        executionPipeline: zod_1.z.array(zod_1.z.object({
            stage: zod_1.z.number(),
            name: zod_1.z.string(),
            description: zod_1.z.string(),
            inputs: zod_1.z.array(zod_1.z.string()),
            outputs: zod_1.z.array(zod_1.z.string()),
        })),
        fallbackPolicies: zod_1.z.array(zod_1.z.object({
            scenario: zod_1.z.string(),
            strategy: zod_1.z.string(),
        })),
    }),
    ragArchitecture: zod_1.z
        .object({
        vectorDbProvider: zod_1.z.string(),
        embeddingModel: zod_1.z.string(),
        chunkSize: zod_1.z.number(),
        chunkOverlap: zod_1.z.number(),
        retrievalTopK: zod_1.z.number(),
        searchFilter: zod_1.z.string().nullable().optional(),
        indexingStrategy: zod_1.z.string().nullable().optional(),
        reranker: zod_1.z.string().nullable().optional(),
    })
        .nullable(),
});
async function generateAiRagArchitecture(architectureOverview, components, selectedIdea, teamCapabilities) {
    const model = (0, llmFactory_1.getLLM)("innovation");
    const structuredModel = model.withStructuredOutput(AiRagOutputSchema, {
        name: "AiRagArchitecture",
        method: "functionCalling",
    });
    const systemMessage = new messages_1.SystemMessage(ctoPrompts_1.AI_RAG_SYSTEM_PROMPT);
    const componentsText = components
        .map((c) => `[${c.name}] Type: ${c.type} | Tech: ${c.technology}\nPurpose: ${c.purpose}`)
        .join("\n\n");
    const ideaText = `
Name: ${selectedIdea.name}
Description: ${selectedIdea.oneLineDescription || selectedIdea.detailedDescription}
Problem: ${selectedIdea.problemSolved}
Features: ${selectedIdea.keyFeatures.map((f) => f.name).join(", ")}
  `.trim();
    const userPrompt = (0, ctoPrompts_1.AI_RAG_USER_TEMPLATE)(architectureOverview, componentsText, ideaText, teamCapabilities);
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
            const result = await structuredModel.invoke([systemMessage, userMessage]);
            return {
                success: true,
                aiArchitecture: result.aiArchitecture,
                ragArchitecture: result.ragArchitecture || undefined,
                retryCount,
            };
        }
        catch (err) {
            lastError =
                err instanceof Error ? err.message : "Unknown error during LLM call";
            if ((0, llmRetry_1.isTransientLLMError)(lastError)) {
                const delay = (0, llmRetry_1.backoffDelay)(attempt);
                console.log(`[CTO_AI] Transient error encountered. Backing off ${delay}ms...`);
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
//# sourceMappingURL=aiRagArchitect.js.map