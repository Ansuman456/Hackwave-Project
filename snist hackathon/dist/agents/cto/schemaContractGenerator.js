"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSchemaAndContracts = generateSchemaAndContracts;
const messages_1 = require("@langchain/core/messages");
const llmFactory_1 = require("../../utils/llmFactory");
const llmRetry_1 = require("../../utils/llmRetry");
const ctoPrompts_1 = require("../../prompts/ctoPrompts");
const zod_1 = require("zod");
const MAX_RETRIES = 4;
const SchemaContractOutputSchema = zod_1.z.object({
    databaseSchema: zod_1.z.array(zod_1.z.object({
        collectionName: zod_1.z.string(),
        purpose: zod_1.z.string(),
        fields: zod_1.z.array(zod_1.z.object({
            name: zod_1.z.string(),
            type: zod_1.z.string(),
            required: zod_1.z.boolean().nullable().optional(),
            indexed: zod_1.z.boolean().nullable().optional(),
            description: zod_1.z.string().nullable().optional(),
        })),
        indexes: zod_1.z
            .array(zod_1.z.object({
            fields: zod_1.z.array(zod_1.z.string()),
            type: zod_1.z.enum(["unique", "compound", "text", "single"]).nullable().optional(),
            reason: zod_1.z.string().nullable().optional(),
        }))
            .nullable().optional(),
        relationships: zod_1.z
            .array(zod_1.z.object({
            type: zod_1.z.enum(["reference", "embedding", "embedded"]),
            targetCollection: zod_1.z.string(),
            description: zod_1.z.string(),
        }))
            .nullable().optional(),
    })),
    apiContracts: zod_1.z.array(zod_1.z.object({
        method: zod_1.z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
        path: zod_1.z.string(),
        description: zod_1.z.string(),
        authRequired: zod_1.z.boolean().nullable().optional(),
        requestBody: zod_1.z
            .object({
            contentType: zod_1.z.string(),
            schema: zod_1.z.string(),
        })
            .nullable().optional(),
        responseSchema: zod_1.z.string(),
        rateLimit: zod_1.z.string().nullable().optional(),
    })),
});
async function generateSchemaAndContracts(architectureOverview, components, dataFlow, selectedIdea) {
    const model = (0, llmFactory_1.getLLM)("coding");
    const structuredModel = model.withStructuredOutput(SchemaContractOutputSchema, {
        name: "SchemaAndContracts",
        method: "functionCalling",
    });
    const systemMessage = new messages_1.SystemMessage(ctoPrompts_1.SCHEMA_CONTRACT_SYSTEM_PROMPT);
    const componentsText = components
        .map((c) => `[${c.name}] Type: ${c.type} | Tech: ${c.technology}\nPurpose: ${c.purpose}\nResponsibilities: ${c.responsibilities.join(", ")}`)
        .join("\n\n");
    const dataFlowText = dataFlow
        .map((d) => `Step ${d.step}: ${d.actor} → ${d.action} via ${d.system}\n${d.description}`)
        .join("\n\n");
    const ideaText = `
Name: ${selectedIdea.name}
Description: ${selectedIdea.oneLineDescription}
Features: ${selectedIdea.keyFeatures.map((f) => f.name).join(", ")}
  `.trim();
    const userPrompt = (0, ctoPrompts_1.SCHEMA_CONTRACT_USER_TEMPLATE)(architectureOverview, componentsText, dataFlowText, ideaText);
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
                databaseSchema: result.databaseSchema,
                apiContracts: result.apiContracts,
                retryCount,
            };
        }
        catch (err) {
            lastError =
                err instanceof Error ? err.message : "Unknown error during LLM call";
            if ((0, llmRetry_1.isTransientLLMError)(lastError)) {
                const delay = (0, llmRetry_1.backoffDelay)(attempt);
                console.log(`[CTO_SCHEMA] Transient error encountered. Backing off ${delay}ms...`);
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
//# sourceMappingURL=schemaContractGenerator.js.map