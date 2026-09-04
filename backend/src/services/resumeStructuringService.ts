import { z } from "zod";
import { getConfig } from "../config/env";
import {
  RESUME_EXTRACTOR_SYSTEM_PROMPT,
  RESUME_EXTRACTOR_USER_TEMPLATE,
  ResumeExtractionOutputSchema,
} from "../prompts/resumeExtractor";
import { isTransientLLMError, backoffDelay, sleep } from "../utils/llmRetry";

export type StructuredResumeMember = z.infer<
  typeof ResumeExtractionOutputSchema
>["members"][number];

export interface ResumeStructuringResult {
  success: boolean;
  members?: StructuredResumeMember[];
  error?: string;
  retryCount: number;
}

const MAX_RETRIES = 3;
const REQUEST_TIMEOUT_MS = 120000;

interface FeatherlessChatResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
  error?: {
    message?: string;
  };
}

function extractJsonObject(text: string): Record<string, unknown> {
  const trimmed = (text || "").trim();

  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1].trim() : trimmed;

  try {
    return JSON.parse(candidate) as Record<string, unknown>;
  } catch {
    const firstBrace = candidate.indexOf("{");
    const lastBrace = candidate.lastIndexOf("}");
    if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
      throw new Error("No JSON object found in model output");
    }
    return JSON.parse(
      candidate.slice(firstBrace, lastBrace + 1)
    ) as Record<string, unknown>;
  }
}

async function callFeatherless(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const config = getConfig();

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(
      `${config.FEATHERLESS_BASE_URL.replace(/\/$/, "")}/chat/completions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.FEATHERLESS_API_KEY}`,
        },
        body: JSON.stringify({
          model: config.FEATHERLESS_MODEL,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.3,
          max_tokens: 16384,
        }),
        signal: controller.signal,
      }
    );

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      throw new Error(
        `Featherless API error ${response.status}: ${body.slice(0, 500)}`
      );
    }

    const data = (await response.json()) as FeatherlessChatResponse;

    if (data.error?.message) {
      throw new Error(`Featherless API error: ${data.error.message}`);
    }

    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("Featherless API returned no content");
    }

    return content;
  } finally {
    clearTimeout(timeout);
  }
}

export async function structureResumes(
  resumes: string[]
): Promise<ResumeStructuringResult> {
  if (resumes.length === 0) {
    return { success: true, members: [], retryCount: 0 };
  }

  const systemPrompt = RESUME_EXTRACTOR_SYSTEM_PROMPT;
  const userPrompt = RESUME_EXTRACTOR_USER_TEMPLATE(resumes);

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

      const raw = await callFeatherless(systemPrompt, currentPrompt);
      const parsed = extractJsonObject(raw);

      const validated = ResumeExtractionOutputSchema.parse(parsed);

      const members: StructuredResumeMember[] = validated.members.map(
        (m, i) => ({
          ...m,
          memberId: m.memberId || `member_${i + 1}`,
          parsedSkills: m.parsedSkills || [],
          proficiencyLevels: m.proficiencyLevels || {},
        })
      );

      return { success: true, members, retryCount };
    } catch (err) {
      lastError = err instanceof Error ? err.message : "Unknown error";

      if (isTransientLLMError(lastError)) {
        const delay = backoffDelay(attempt);
        console.log(
          `[RESUME_STRUCTURING] Transient error. Backing off ${delay}ms...`
        );
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
