import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { getLLM } from "../../utils/llmFactory";
import { isTransientLLMError, backoffDelay, sleep } from "../../utils/llmRetry";
import {
  IMPLEMENTATION_SYSTEM_PROMPT,
  IMPLEMENTATION_USER_TEMPLATE,
} from "../../prompts/ctoPrompts";
import {
  ImplementationPhase,
  TechnicalRisk,
} from "../../graph/state";
import { z } from "zod";

const MAX_RETRIES = 4;

const ImplementationOutputSchema = z.object({
  implementationPlan: z.array(
    z.object({
      phase: z.number(),
      name: z.string(),
      description: z.string(),
      duration: z.string(),
      deliverables: z.array(z.string()),
      tasks: z.array(
        z.object({
          taskId: z.string(),
          name: z.string(),
          description: z.string(),
          assignedRole: z.string(),
          assignedMemberId: z.string().nullable().optional(),
          estimatedHours: z.number(),
          dependencies: z.array(z.string()),
          priority: z.enum(["critical", "high", "medium", "low"]),
          phase: z.number(),
        })
      ),
      exitCriteria: z.array(z.string()),
    })
  ),
  hackathonTimeline: z.object({
    totalHours: z.number(),
    phases: z.array(
      z.object({
        phase: z.number(),
        name: z.string(),
        hours: z.number(),
        startHour: z.number(),
      })
    ),
  }),
  risks: z.array(
    z.object({
      id: z.string(),
      description: z.string(),
      likelihood: z.enum(["low", "medium", "high"]),
      impact: z.enum(["low", "medium", "high"]),
      severity: z.enum(["low", "medium", "high", "critical"]),
      mitigationStrategy: z.string(),
      affectedComponents: z.array(z.string()),
    })
  ),
});

export interface ImplementationPlanResult {
  success: boolean;
  implementationPlan?: ImplementationPhase[];
  hackathonTimeline?: {
    totalHours: number;
    phases: Array<{
      phase: number;
      name: string;
      hours: number;
      startHour: number;
    }>;
  };
  risks?: TechnicalRisk[];
  error?: string;
  retryCount: number;
}

export async function generateImplementationPlan(
  architectureOverview: string,
  components: any[],
  dataFlow: any[],
  teamRoles: string,
  hackathonDuration: number,
  hackathonConstraints: string
): Promise<ImplementationPlanResult> {
  const model = getLLM("strategic_analysis");
  const structuredModel = model.withStructuredOutput(ImplementationOutputSchema, {
    name: "ImplementationPlan",
    method: "functionCalling",
  });

  const systemMessage = new SystemMessage(IMPLEMENTATION_SYSTEM_PROMPT);

  const componentsText = components
    .map(
      (c) =>
        `[${c.name}] Type: ${c.type} | Tech: ${c.technology}\nPurpose: ${c.purpose}`
    )
    .join("\n\n");

  const dataFlowText = dataFlow
    .map(
      (d) =>
        `Step ${d.step}: ${d.actor} → ${d.action} via ${d.system}`
    )
    .join("\n");

  const userPrompt = IMPLEMENTATION_USER_TEMPLATE(
    architectureOverview,
    componentsText,
    dataFlowText,
    teamRoles,
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
        implementationPlan: result.implementationPlan as ImplementationPhase[],
        hackathonTimeline: result.hackathonTimeline,
        risks: result.risks as TechnicalRisk[],
        retryCount,
      };
    } catch (err) {
      lastError =
        err instanceof Error ? err.message : "Unknown error during LLM call";

      if (isTransientLLMError(lastError)) {
        const delay = backoffDelay(attempt);
        console.log(`[CTO_IMPL] Transient error encountered. Backing off ${delay}ms...`);
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
