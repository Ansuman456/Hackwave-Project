"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateArchitecture = generateArchitecture;
const messages_1 = require("@langchain/core/messages");
const llmFactory_1 = require("../../utils/llmFactory");
const llmRetry_1 = require("../../utils/llmRetry");
const ctoPrompts_1 = require("../../prompts/ctoPrompts");
const zod_1 = require("zod");
const MAX_RETRIES = 4;
const ArchitectureOutputSchema = zod_1.z.object({
    architectureOverview: zod_1.z.string(),
    components: zod_1.z.array(zod_1.z.object({
        name: zod_1.z.string(),
        type: zod_1.z.enum(["frontend", "backend", "ai_engine", "vector_db", "database", "cache", "background_service", "external_api", "other"]),
        technology: zod_1.z.string(),
        purpose: zod_1.z.string(),
        responsibilities: zod_1.z.array(zod_1.z.string()),
        ports: zod_1.z.array(zod_1.z.string()).nullable().optional(),
        dependencies: zod_1.z.array(zod_1.z.string()).nullable().optional(),
    })),
    dataFlow: zod_1.z.array(zod_1.z.object({
        step: zod_1.z.number(),
        actor: zod_1.z.string(),
        action: zod_1.z.string(),
        system: zod_1.z.string(),
        description: zod_1.z.string(),
        dataPayload: zod_1.z.string().nullable().optional(),
    })),
});
async function generateArchitecture(selectedIdea, teamAnalysis, chosenTechStack, hackathonDuration, hackathonConstraints) {
    const model = (0, llmFactory_1.getLLM)("strategic_analysis");
    const structuredModel = model.withStructuredOutput(ArchitectureOutputSchema, {
        name: "ArchitectureDesign",
        method: "functionCalling",
    });
    const systemMessage = new messages_1.SystemMessage(ctoPrompts_1.ARCHITECTURE_SYSTEM_PROMPT);
    const ideaText = `
Name: ${selectedIdea.name}
Description: ${selectedIdea.detailedDescription || selectedIdea.oneLineDescription}
Problem: ${selectedIdea.problemSolved}
Users: ${selectedIdea.targetUsers.join(", ")}
Features: ${selectedIdea.keyFeatures.map((f) => f.name).join(", ")}
Complexity: ${selectedIdea.estimatedComplexity}
  `.trim();
    const teamText = `
Team Members: ${teamAnalysis.teamMembers.map((m) => `${m.name} (${m.primaryRole})`).join(", ")}
Feasibility Score: ${teamAnalysis.feasibility.score}/10
Team Strengths: ${teamAnalysis.feasibility.teamStrengths.join(", ")}
Team Weaknesses: ${teamAnalysis.feasibility.teamWeaknesses.join(", ")}
Role Assignments: ${teamAnalysis.roleAssignments.map((r) => `${r.roleTitle} → ${r.assignedMemberName}`).join(", ")}
  `.trim();
    const techStackText = `
Stack: ${chosenTechStack.name}
Frontend: ${chosenTechStack.frontend.join(", ")}
Backend: ${chosenTechStack.backend.join(", ")}
Database: ${chosenTechStack.database.join(", ")}
AI/ML: ${chosenTechStack.aiMl.join(", ")}
Infrastructure: ${chosenTechStack.infrastructure.join(", ")}
Architecture: ${chosenTechStack.architectureOverview}
  `.trim();
    const userPrompt = (0, ctoPrompts_1.ARCHITECTURE_USER_TEMPLATE)(ideaText, teamText, techStackText, hackathonDuration, hackathonConstraints);
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
                architectureOverview: result.architectureOverview,
                components: result.components,
                dataFlow: result.dataFlow,
                retryCount,
            };
        }
        catch (err) {
            lastError =
                err instanceof Error ? err.message : "Unknown error during LLM call";
            if ((0, llmRetry_1.isTransientLLMError)(lastError)) {
                const delay = (0, llmRetry_1.backoffDelay)(attempt);
                console.log(`[CTO_ARCH] Transient error encountered. Backing off ${delay}ms...`);
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
//# sourceMappingURL=architectureGenerator.js.map