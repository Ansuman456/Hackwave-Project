import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { getLLM } from "../../utils/llmFactory";
import { isTransientLLMError, backoffDelay, sleep } from "../../utils/llmRetry";
import {
  ARCHITECTURE_SYSTEM_PROMPT,
  ARCHITECTURE_USER_TEMPLATE,
} from "../../prompts/ctoPrompts";
import {
  Component,
  DataFlowStep,
  TeamAnalysis,
  TechStackOption,
} from "../../graph/state";
import { z } from "zod";

const MAX_RETRIES = 4;

const ArchitectureOutputSchema = z.object({
  architectureOverview: z.string(),
  components: z.array(
    z.object({
      name: z.string(),
      type: z.enum(["frontend", "backend", "ai_engine", "vector_db", "database", "cache", "background_service", "external_api", "other"]),
      technology: z.string(),
      purpose: z.string(),
      responsibilities: z.array(z.string()),
      ports: z.array(z.string()).nullable().optional(),
      dependencies: z.array(z.string()).nullable().optional(),
    })
  ),
  dataFlow: z.array(
    z.object({
      step: z.number(),
      actor: z.string(),
      action: z.string(),
      system: z.string(),
      description: z.string(),
      dataPayload: z.string().nullable().optional(),
    })
  ),
});

export interface ArchitectureGenResult {
  success: boolean;
  architectureOverview?: string;
  components?: Component[];
  dataFlow?: DataFlowStep[];
  error?: string;
  retryCount: number;
}

export async function generateArchitecture(
  selectedIdea: any,
  teamAnalysis: TeamAnalysis,
  chosenTechStack: TechStackOption,
  hackathonDuration: number,
  hackathonConstraints: string
): Promise<ArchitectureGenResult> {
  const model = getLLM("strategic_analysis");
  const structuredModel = model.withStructuredOutput(ArchitectureOutputSchema, {
    name: "ArchitectureDesign",
    method: "functionCalling",
  });

  const systemMessage = new SystemMessage(ARCHITECTURE_SYSTEM_PROMPT);

  const ideaText = `
Name: ${selectedIdea.name}
Description: ${selectedIdea.detailedDescription || selectedIdea.oneLineDescription}
Problem: ${selectedIdea.problemSolved}
Users: ${selectedIdea.targetUsers.join(", ")}
Features: ${selectedIdea.keyFeatures.map((f: any) => f.name).join(", ")}
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

  const userPrompt = ARCHITECTURE_USER_TEMPLATE(
    ideaText,
    teamText,
    techStackText,
    hackathonDuration,
    hackathonConstraints
  );

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

      const userMessage = new HumanMessage(currentPrompt);
      const result = await structuredModel.invoke([systemMessage, userMessage]);

      return {
        success: true,
        architectureOverview: result.architectureOverview,
        components: result.components as Component[],
        dataFlow: result.dataFlow as DataFlowStep[],
        retryCount,
      };
    } catch (err) {
      lastError =
        err instanceof Error ? err.message : "Unknown error during LLM call";

      if (isTransientLLMError(lastError)) {
        const delay = backoffDelay(attempt);
        console.log(`[CTO_ARCH] Transient error encountered. Backing off ${delay}ms...`);
        await sleep(delay);
      }
    }
  }

  return {
    success: false,
    retryCount,
    error: `Failed after ${MAX_RETRIES + 1} attempts. Last error: ${lastError}`,
  };
}
