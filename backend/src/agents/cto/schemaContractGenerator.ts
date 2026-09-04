import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { getLLM } from "../../utils/llmFactory";
import { isTransientLLMError, backoffDelay, sleep } from "../../utils/llmRetry";
import {
  SCHEMA_CONTRACT_SYSTEM_PROMPT,
  SCHEMA_CONTRACT_USER_TEMPLATE,
} from "../../prompts/ctoPrompts";
import {
  DatabaseModel,
  ApiContract,
} from "../../graph/state";
import { z } from "zod";

const MAX_RETRIES = 4;

const SchemaContractOutputSchema = z.object({
  databaseSchema: z.array(
    z.object({
      collectionName: z.string(),
      purpose: z.string(),
      fields: z.array(
        z.object({
          name: z.string(),
          type: z.string(),
          required: z.boolean().nullable().optional(),
          indexed: z.boolean().nullable().optional(),
          description: z.string().nullable().optional(),
        })
      ),
      indexes: z
        .array(
          z.object({
            fields: z.array(z.string()),
            type: z.enum(["unique", "compound", "text", "single"]).nullable().optional(),
            reason: z.string().nullable().optional(),
          })
        )
        .nullable().optional(),
      relationships: z
        .array(
          z.object({
            type: z.enum(["reference", "embedding", "embedded"]),
            targetCollection: z.string(),
            description: z.string(),
          })
        )
        .nullable().optional(),
    })
  ),
  apiContracts: z.array(
    z.object({
      method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
      path: z.string(),
      description: z.string(),
      authRequired: z.boolean().nullable().optional(),
      requestBody: z
        .object({
          contentType: z.string(),
          schema: z.string(),
        })
        .nullable().optional(),
      responseSchema: z.string(),
      rateLimit: z.string().nullable().optional(),
    })
  ),
});

export interface SchemaContractResult {
  success: boolean;
  databaseSchema?: DatabaseModel[];
  apiContracts?: ApiContract[];
  error?: string;
  retryCount: number;
}

export async function generateSchemaAndContracts(
  architectureOverview: string,
  components: any[],
  dataFlow: any[],
  selectedIdea: any
): Promise<SchemaContractResult> {
  const model = getLLM("coding");
  const structuredModel = model.withStructuredOutput(SchemaContractOutputSchema, {
    name: "SchemaAndContracts",
    method: "functionCalling",
  });

  const systemMessage = new SystemMessage(SCHEMA_CONTRACT_SYSTEM_PROMPT);

  const componentsText = components
    .map(
      (c) =>
        `[${c.name}] Type: ${c.type} | Tech: ${c.technology}\nPurpose: ${c.purpose}\nResponsibilities: ${c.responsibilities.join(", ")}`
    )
    .join("\n\n");

  const dataFlowText = dataFlow
    .map(
      (d) =>
        `Step ${d.step}: ${d.actor} → ${d.action} via ${d.system}\n${d.description}`
    )
    .join("\n\n");

  const ideaText = `
Name: ${selectedIdea.name}
Description: ${selectedIdea.oneLineDescription}
Features: ${selectedIdea.keyFeatures.map((f: any) => f.name).join(", ")}
  `.trim();

  const userPrompt = SCHEMA_CONTRACT_USER_TEMPLATE(
    architectureOverview,
    componentsText,
    dataFlowText,
    ideaText
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
        databaseSchema: result.databaseSchema as DatabaseModel[],
        apiContracts: result.apiContracts as ApiContract[],
        retryCount,
      };
    } catch (err) {
      lastError =
        err instanceof Error ? err.message : "Unknown error during LLM call";

      if (isTransientLLMError(lastError)) {
        const delay = backoffDelay(attempt);
        console.log(`[CTO_SCHEMA] Transient error encountered. Backing off ${delay}ms...`);
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
