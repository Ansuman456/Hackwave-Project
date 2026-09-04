import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { getLLM } from "../../utils/llmFactory";
import { isTransientLLMError, backoffDelay, sleep } from "../../utils/llmRetry";
import {
  FEASIBILITY_SYSTEM_PROMPT,
  FEASIBILITY_USER_TEMPLATE,
  FeasibilityOutputSchema,
} from "../../prompts/feasibilityAnalyzer";
import {
  TeamMemberProfile,
  CandidateIdea,
  ProjectCapabilityRequirements,
} from "../../graph/state";

const MAX_RETRIES = 4;

export interface FeasibilityResult {
  success: boolean;
  expandedSolution?: {
    name: string;
    description: string;
    problemSolved: string;
    targetUsers: string[];
    keyFeatures: string[];
    workflow: string[];
    requiredCapabilities: string[];
    technicalCapabilities: string[];
    complexityAreas: string[];
  };
  dataAvailability?: Array<{
    dataType: string;
    available: boolean;
    source?: string;
    acquisitionStrategy?: string;
  }>;
  feasibility?: {
    score: number;
    summary: string;
    teamStrengths: string[];
    teamWeaknesses: string[];
    timeRisk: "low" | "medium" | "high";
    technicalRisk: "low" | "medium" | "high";
    dataRisk: "low" | "medium" | "high";
    recommendations: string[];
  };
  error?: string;
  retryCount: number;
}

export async function analyzeFeasibility(
  selectedIdea: CandidateIdea,
  teamProfiles: TeamMemberProfile[],
  projectRequirements: ProjectCapabilityRequirements,
  hackathonDuration?: number,
  judgingCriteria?: string
): Promise<FeasibilityResult> {
  const model = getLLM("strategic_analysis");
  const structuredModel = model.withStructuredOutput(FeasibilityOutputSchema, {
    name: "FeasibilityAnalysis",
    method: "functionCalling",
  });

  const systemMessage = new SystemMessage(FEASIBILITY_SYSTEM_PROMPT);

  const ideaText = `
Name: ${selectedIdea.name}
Description: ${selectedIdea.detailedDescription || selectedIdea.oneLineDescription}
Problem: ${selectedIdea.problemSolved}
Users: ${selectedIdea.targetUsers.join(", ")}
Features: ${selectedIdea.keyFeatures.map((f) => f.name).join(", ")}
Complexity: ${selectedIdea.estimatedComplexity}
Innovation Score: ${selectedIdea.innovationScore}/10
Impact Score: ${selectedIdea.impactScore}/10
  `.trim();

  const profilesText = teamProfiles
    .map(
      (p) =>
        `[${p.memberId}] ${p.name} — ${p.primaryRole}\nSkills: ${p.parsedSkills.join(", ")}\nSnippet: ${p.resumeSnippet}`
    )
    .join("\n\n");

  const reqText = `
Required Capabilities: ${projectRequirements.requiredCapabilities.join(", ")}
Technical Capabilities: ${projectRequirements.technicalCapabilities.join(", ")}
Complexity Areas: ${projectRequirements.complexityAreas.join(", ")}
Potential Skill Gaps: ${projectRequirements.potentialSkillGaps.join(", ")}
  `.trim();

  const userPrompt = FEASIBILITY_USER_TEMPLATE(
    ideaText,
    profilesText,
    reqText,
    hackathonDuration,
    judgingCriteria
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
        expandedSolution: result.expandedSolution,
        dataAvailability: result.dataAvailability,
        feasibility: result.feasibility,
        retryCount,
      };
    } catch (err) {
      lastError =
        err instanceof Error ? err.message : "Unknown error during LLM call";

      if (isTransientLLMError(lastError)) {
        const delay = backoffDelay(attempt);
        console.log(
          `[FEASIBILITY] Transient error encountered. Backing off ${delay}ms...`
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
