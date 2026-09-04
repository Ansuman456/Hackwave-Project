import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { getLLM } from "../../utils/llmFactory";
import { isTransientLLMError, backoffDelay, sleep } from "../../utils/llmRetry";
import {
  AI_RAG_SYSTEM_PROMPT,
  AI_RAG_USER_TEMPLATE,
} from "../../prompts/ctoPrompts";
import {
  AiArchitecture,
  RagArchitecture,
} from "../../graph/state";
import { z } from "zod";

const MAX_RETRIES = 4;

const AiRagOutputSchema = z.object({
  aiArchitecture: z.object({
    llmModels: z.array(
      z.object({
        provider: z.string(),
        model: z.string(),
        purpose: z.string(),
        temperature: z.number().nullable().optional(),
        maxTokens: z.number().nullable().optional(),
      })
    ),
    prompts: z.array(
      z.object({
        name: z.string(),
        type: z.enum(["system", "user", "few_shot", "chain_of_thought"]),
        purpose: z.string(),
        template: z.string().nullable().optional(),
      })
    ),
    agentTools: z.array(
      z.object({
        name: z.string(),
        type: z.enum(["search", "code_execution", "web_scraping", "api_call", "file_operation", "other"]),
        purpose: z.string(),
        integration: z.string(),
      })
    ),
    executionPipeline: z.array(
      z.object({
        stage: z.number(),
        name: z.string(),
        description: z.string(),
        inputs: z.array(z.string()),
        outputs: z.array(z.string()),
      })
    ),
    fallbackPolicies: z.array(
      z.object({
        scenario: z.string(),
        strategy: z.string(),
      })
    ),
  }),
  ragArchitecture: z
    .object({
      vectorDbProvider: z.string(),
      embeddingModel: z.string(),
      chunkSize: z.number(),
      chunkOverlap: z.number(),
      retrievalTopK: z.number(),
      searchFilter: z.string().nullable().optional(),
      indexingStrategy: z.string().nullable().optional(),
      reranker: z.string().nullable().optional(),
    })
    .nullable(),
});

export interface AiRagResult {
  success: boolean;
  aiArchitecture?: AiArchitecture;
  ragArchitecture?: RagArchitecture;
  error?: string;
  retryCount: number;
}

export async function generateAiRagArchitecture(
  architectureOverview: string,
  components: any[],
  selectedIdea: any,
  teamCapabilities: string
): Promise<AiRagResult> {
  const model = getLLM("innovation");
  const structuredModel = model.withStructuredOutput(AiRagOutputSchema, {
    name: "AiRagArchitecture",
    method: "functionCalling",
  });

  const systemMessage = new SystemMessage(AI_RAG_SYSTEM_PROMPT);

  const componentsText = components
    .map(
      (c) =>
        `[${c.name}] Type: ${c.type} | Tech: ${c.technology}\nPurpose: ${c.purpose}`
    )
    .join("\n\n");

  const ideaText = `
Name: ${selectedIdea.name}
Description: ${selectedIdea.oneLineDescription || selectedIdea.detailedDescription}
Problem: ${selectedIdea.problemSolved}
Features: ${selectedIdea.keyFeatures.map((f: any) => f.name).join(", ")}
  `.trim();

  const userPrompt = AI_RAG_USER_TEMPLATE(
    architectureOverview,
    componentsText,
    ideaText,
    teamCapabilities
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
        aiArchitecture: result.aiArchitecture as AiArchitecture,
        ragArchitecture: (result.ragArchitecture as RagArchitecture) || undefined,
        retryCount,
      };
    } catch (err) {
      lastError =
        err instanceof Error ? err.message : "Unknown error during LLM call";

      if (isTransientLLMError(lastError)) {
        const delay = backoffDelay(attempt);
        console.log(`[CTO_AI] Transient error encountered. Backing off ${delay}ms...`);
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
