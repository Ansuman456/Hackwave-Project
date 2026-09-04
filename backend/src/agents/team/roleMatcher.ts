import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { getLLM } from "../../utils/llmFactory";
import {
  ROLE_ASSIGNMENT_SYSTEM_PROMPT,
  ROLE_ASSIGNMENT_USER_TEMPLATE,
  RoleAssignmentOutputSchema,
} from "../../prompts/roleAssignment";
import {
  TeamMemberProfile,
  RoleAssignment,
  TeamSkillGap,
} from "../../graph/state";

const MAX_RETRIES = 2;

export interface RoleMatcherResult {
  success: boolean;
  roleAssignments?: RoleAssignment[];
  skillGaps?: TeamSkillGap[];
  overallTeamStrategy?: string;
  error?: string;
  retryCount: number;
}

export async function matchRoles(
  teamProfiles: TeamMemberProfile[],
  projectRequirements: string,
  hackathonDuration?: number
): Promise<RoleMatcherResult> {
  if (teamProfiles.length === 0) {
    return {
      success: false,
      error: "No team profiles to analyze",
      retryCount: 0,
    };
  }

  const model = getLLM("strategic_analysis");
  const structuredModel = model.withStructuredOutput(
    RoleAssignmentOutputSchema,
    { name: "RoleAssignment" }
  );

  const systemMessage = new SystemMessage(ROLE_ASSIGNMENT_SYSTEM_PROMPT);

  const profilesText = teamProfiles
    .map(
      (p) =>
        `[${p.memberId}] ${p.name} — ${p.primaryRole}\nSkills: ${p.parsedSkills.join(", ")}\nProficiency: ${Object.entries(p.proficiencyLevels).map(([k, v]) => `${k}(${v})`).join(", ")}${p.yearsExperience ? `\nExperience: ${p.yearsExperience} years` : ""}\nSnippet: ${p.resumeSnippet}`
    )
    .join("\n\n");

  const userPrompt = ROLE_ASSIGNMENT_USER_TEMPLATE(
    profilesText,
    projectRequirements,
    hackathonDuration
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

      return {
        success: true,
        roleAssignments: result.roleAssignments,
        skillGaps: result.skillGaps,
        overallTeamStrategy: result.overallTeamStrategy,
        retryCount,
      };
    } catch (err) {
      lastError =
        err instanceof Error ? err.message : "Unknown error during LLM call";

      if (
        lastError.includes("429") ||
        lastError.includes("Rate limit") ||
        lastError.includes("TPM")
      ) {
        console.log(
          "[ROLE_MATCHER] Rate limit encountered. Backing off for 15s..."
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
