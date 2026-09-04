"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateImplementationPlan = generateImplementationPlan;
const messages_1 = require("@langchain/core/messages");
const llmFactory_1 = require("../../utils/llmFactory");
const llmRetry_1 = require("../../utils/llmRetry");
const ctoPrompts_1 = require("../../prompts/ctoPrompts");
const zod_1 = require("zod");
const MAX_RETRIES = 4;
const ImplementationOutputSchema = zod_1.z.object({
    implementationPlan: zod_1.z.array(zod_1.z.object({
        phase: zod_1.z.number(),
        name: zod_1.z.string(),
        description: zod_1.z.string(),
        duration: zod_1.z.string(),
        deliverables: zod_1.z.array(zod_1.z.string()),
        tasks: zod_1.z.array(zod_1.z.object({
            taskId: zod_1.z.string(),
            name: zod_1.z.string(),
            description: zod_1.z.string(),
            assignedRole: zod_1.z.string(),
            assignedMemberId: zod_1.z.string().nullable().optional(),
            estimatedHours: zod_1.z.number(),
            dependencies: zod_1.z.array(zod_1.z.string()),
            priority: zod_1.z.enum(["critical", "high", "medium", "low"]),
            phase: zod_1.z.number(),
        })),
        exitCriteria: zod_1.z.array(zod_1.z.string()),
    })),
    hackathonTimeline: zod_1.z.object({
        totalHours: zod_1.z.number(),
        phases: zod_1.z.array(zod_1.z.object({
            phase: zod_1.z.number(),
            name: zod_1.z.string(),
            hours: zod_1.z.number(),
            startHour: zod_1.z.number(),
        })),
    }),
    risks: zod_1.z.array(zod_1.z.object({
        id: zod_1.z.string(),
        description: zod_1.z.string(),
        likelihood: zod_1.z.enum(["low", "medium", "high"]),
        impact: zod_1.z.enum(["low", "medium", "high"]),
        severity: zod_1.z.enum(["low", "medium", "high", "critical"]),
        mitigationStrategy: zod_1.z.string(),
        affectedComponents: zod_1.z.array(zod_1.z.string()),
    })),
});
async function generateImplementationPlan(architectureOverview, components, dataFlow, teamRoles, hackathonDuration, hackathonConstraints) {
    const model = (0, llmFactory_1.getLLM)("strategic_analysis");
    const structuredModel = model.withStructuredOutput(ImplementationOutputSchema, {
        name: "ImplementationPlan",
        method: "functionCalling",
    });
    const systemMessage = new messages_1.SystemMessage(ctoPrompts_1.IMPLEMENTATION_SYSTEM_PROMPT);
    const componentsText = components
        .map((c) => `[${c.name}] Type: ${c.type} | Tech: ${c.technology}\nPurpose: ${c.purpose}`)
        .join("\n\n");
    const dataFlowText = dataFlow
        .map((d) => `Step ${d.step}: ${d.actor} → ${d.action} via ${d.system}`)
        .join("\n");
    const userPrompt = (0, ctoPrompts_1.IMPLEMENTATION_USER_TEMPLATE)(architectureOverview, componentsText, dataFlowText, teamRoles, hackathonDuration, hackathonConstraints);
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
                implementationPlan: result.implementationPlan,
                hackathonTimeline: result.hackathonTimeline,
                risks: result.risks,
                retryCount,
            };
        }
        catch (err) {
            lastError =
                err instanceof Error ? err.message : "Unknown error during LLM call";
            if ((0, llmRetry_1.isTransientLLMError)(lastError)) {
                const delay = (0, llmRetry_1.backoffDelay)(attempt);
                console.log(`[CTO_IMPL] Transient error encountered. Backing off ${delay}ms...`);
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
//# sourceMappingURL=implementationPlanner.js.map