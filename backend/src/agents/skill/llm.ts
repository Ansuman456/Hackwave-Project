import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { getLLM } from "../../utils/llmFactory";
import { ModelCapability } from "../../config/model.config";

const MAX_RETRIES = 2;

export async function callStructured<T>(
  capability: ModelCapability,
  systemPrompt: string,
  userPrompt: string,
  schema: any,
  schemaName: string
): Promise<T | null> {
  const model = getLLM(capability);
  const structuredModel = model.withStructuredOutput(schema, {
    name: schemaName,
  });

  let lastError = "";
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      let prompt = userPrompt;
      if (attempt > 0) {
        prompt = [
          userPrompt,
          "",
          "=== RETRY INSTRUCTIONS ===",
          `Your previous attempt failed validation: ${lastError}`,
          "Fix the issues and return ONLY valid JSON matching the schema.",
        ].join("\n");
      }

      const result = (await structuredModel.invoke([
        new SystemMessage(systemPrompt),
        new HumanMessage(prompt),
      ])) as T;

      return result;
    } catch (err) {
      lastError = err instanceof Error ? err.message : "LLM call failed";
      if (lastError.includes("429") || lastError.includes("Rate limit")) {
        await new Promise((r) => setTimeout(r, 15000));
      }
    }
  }

  return null;
}
