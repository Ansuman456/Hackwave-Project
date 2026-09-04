import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { getLLM } from "../../utils/llmFactory";
import { isTransientLLMError, backoffDelay, sleep } from "../../utils/llmRetry";
import {
  RESUME_EXTRACTOR_SYSTEM_PROMPT,
  RESUME_EXTRACTOR_USER_TEMPLATE,
  ResumeExtractionOutputSchema,
} from "../../prompts/resumeExtractor";
import { TeamMemberProfile } from "../../graph/state";

const MAX_RETRIES = 4;

export interface ResumeParserResult {
  success: boolean;
  members?: TeamMemberProfile[];
  error?: string;
  retryCount: number;
}

export async function parseResumes(
  resumes: string[]
): Promise<ResumeParserResult> {
  if (resumes.length === 0) {
    return {
      success: true,
      members: [],
      retryCount: 0,
    };
  }

  const model = getLLM("strategic_analysis");
  const structuredModel = model.withStructuredOutput(
    ResumeExtractionOutputSchema,
    { name: "ResumeExtraction", method: "functionCalling" }
  );

  const systemMessage = new SystemMessage(RESUME_EXTRACTOR_SYSTEM_PROMPT);
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

      const userMessage = new HumanMessage(currentPrompt);
      const result = await structuredModel.invoke([
        systemMessage,
        userMessage,
      ]);

      const members = result.members.map((m: any, i: number) => ({
        ...m,
        memberId: m.memberId || `member_${i + 1}`,
        parsedSkills: m.parsedSkills || [],
        proficiencyLevels: m.proficiencyLevels || {},
      }));

      return { success: true, members, retryCount };
    } catch (err) {
      lastError =
        err instanceof Error ? err.message : "Unknown error during LLM call";

      if (isTransientLLMError(lastError)) {
        const delay = backoffDelay(attempt);
        console.log(
          `[RESUME_PARSER] Transient error encountered. Backing off ${delay}ms...`
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
