import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { getLLM } from "../../utils/llmFactory";
import {
  TECH_STACK_SYSTEM_PROMPT,
  TECH_STACK_USER_TEMPLATE,
  TechStackOutputSchema,
} from "../../prompts/techStackGenerator";
import {
  TeamMemberProfile,
  TechStackOption,
  ProjectCapabilityRequirements,
} from "../../graph/state";

const MAX_RETRIES = 2;

export interface TechStackResult {
  success: boolean;
  techStackOptions?: TechStackOption[];
  error?: string;
  retryCount: number;
}

export async function generateTechStacks(
  expandedSolution: string,
  teamProfiles: TeamMemberProfile[],
  feasibilitySummary: string,
  projectRequirements: ProjectCapabilityRequirements,
  hackathonDuration?: number,
  forbiddenTech?: string[]
): Promise<TechStackResult> {
  const model = getLLM("strategic_analysis");
  const structuredModel = model.withStructuredOutput(TechStackOutputSchema, {
    name: "TechStackOptions",
  });

  const systemMessage = new SystemMessage(TECH_STACK_SYSTEM_PROMPT);

  const profilesText = teamProfiles
    .map(
      (p) =>
        `[${p.memberId}] ${p.name} — ${p.primaryRole}\nSkills: ${p.parsedSkills.join(", ")}\nProficiency: ${Object.entries(p.proficiencyLevels).map(([k, v]) => `${k}(${v})`).join(", ")}`
    )
    .join("\n\n");

  const userPrompt = TECH_STACK_USER_TEMPLATE(
    expandedSolution,
    profilesText,
    feasibilitySummary,
    `Required: ${projectRequirements.requiredCapabilities.join(", ")}\nTechnical: ${projectRequirements.technicalCapabilities.join(", ")}`,
    hackathonDuration,
    forbiddenTech
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
      const result = await structuredModel.invoke([
        systemMessage,
        userMessage,
      ]);

      // Ensure proper ranking
      const sorted = result.techStackOptions
        .sort((a: any, b: any) => b.overallScore - a.overallScore)
        .map((opt: any, i: number) => ({ ...opt, rank: i + 1 }));

      return { success: true, techStackOptions: sorted, retryCount };
    } catch (err) {
      lastError =
        err instanceof Error ? err.message : "Unknown error during LLM call";

      if (
        lastError.includes("429") ||
        lastError.includes("Rate limit") ||
        lastError.includes("TPM")
      ) {
        console.log(
          "[TECH_STACK] Rate limit encountered. Backing off for 15s..."
        );
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
