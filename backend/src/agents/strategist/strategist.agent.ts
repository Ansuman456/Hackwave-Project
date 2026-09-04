import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ProblemAnalysis, ProblemAnalysisSchema } from "../../graph/state";
import { getLLM } from "../../utils/llmFactory";
import { STRATEGIST_SYSTEM_PROMPT } from "../../prompts/strategist.system";
import { buildStrategistUserPrompt } from "../../prompts/strategist.user";
import {
  validateProblemAnalysis,
  ValidationResult,
} from "./strategist.validator";
import { StrategistInput } from "../../graph/state";

const MAX_RETRIES = 2;

export interface StrategistResult {
  success: boolean;
  analysis?: ProblemAnalysis;
  validation?: ValidationResult;
  retryCount: number;
  error?: string;
}

export async function runStrategist(
  input: StrategistInput
): Promise<StrategistResult> {
  const model = getLLM("strategic_analysis");

  const structuredModel = model.withStructuredOutput(ProblemAnalysisSchema, {
    name: "ProblemAnalysis",
  });

  const systemMessage = new SystemMessage(STRATEGIST_SYSTEM_PROMPT);
  const userPrompt = buildStrategistUserPrompt(input);

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

      const userMessage = new HumanMessage(currentPrompt);

      const result = await structuredModel.invoke([systemMessage, userMessage]);

      // withStructuredOutput returns the parsed Zod object directly
      // But we run it through our validator for additional semantic checks
      const validation = validateProblemAnalysis(result);

      if (validation.valid) {
        return {
          success: true,
          analysis: result as ProblemAnalysis,
          validation,
          retryCount,
        };
      }

      // Build detailed error message for retry
      lastError = formatValidationErrors(validation);
    } catch (err) {
      console.error("[STRATEGIST LLM EXCEPTION]:", err);
      lastError =
        err instanceof Error ? err.message : "Unknown error during LLM call";

      if (lastError.includes("429") || lastError.includes("Rate limit") || lastError.includes("TPM")) {
        console.log("[STRATEGIST] Rate limit (429/TPM) encountered. Backing off for 15s before retry...");
        await new Promise((resolve) => setTimeout(resolve, 15000));
      }
    }
  }

  return {
    success: false,
    retryCount,
    error: `Failed after ${MAX_RETRIES + 1} attempts. Last error: ${lastError}`,
  };
}

function formatValidationErrors(validation: ValidationResult): string {
  const lines: string[] = [];

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

export { StrategistInput };
