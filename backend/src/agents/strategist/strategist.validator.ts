import { z } from "zod";
import { ProblemAnalysis, ProblemAnalysisSchema } from "../../graph/state";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateProblemAnalysis(
  analysis: unknown
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // First: Zod schema validation
  const zodResult = ProblemAnalysisSchema.safeParse(analysis);
  if (!zodResult.success) {
    for (const issue of zodResult.error.issues) {
      errors.push(`Schema: ${issue.path.join(".")} - ${issue.message}`);
    }
    return { valid: false, errors, warnings };
  }

  const data = zodResult.data;

  // Semantic validation beyond Zod
  if (data.coreProblem.length < 15) {
    warnings.push("coreProblem is quite short; consider more specificity");
  }

  if (data.targetUsers.length < 1) {
    errors.push("At least one target user is required");
  }

  if (data.painPoints.length < 1) {
    errors.push("At least one pain point is required");
  }

  if (data.desiredOutcomes.length < 1) {
    errors.push("At least one desired outcome is required");
  }

  if (data.domainKeywords.length < 3) {
    errors.push("At least 3 domain keywords are required for research");
  }

  if (data.researchQuestions.length < 4) {
    errors.push("At least 4 research questions are required");
  }

  if (data.researchDimensions.length < 3) {
    errors.push("At least 3 research dimensions are required");
  }

  if (data.searchConcepts.length < 3) {
    warnings.push("More search concepts would improve research quality");
  }

  // Check for empty/placeholder values
  for (const user of data.targetUsers) {
    if (user.role.length < 2) {
      errors.push(`Target user role is too short: "${user.role}"`);
    }
  }

  for (const pq of data.painPoints) {
    if (pq.description.length < 5) {
      errors.push(`Pain point description is too short: "${pq.description}"`);
    }
  }

  // Check research question diversity
  const questionCategories = new Set(
    data.researchQuestions.map((q) => q.category)
  );
  if (questionCategories.size < 3) {
    warnings.push(
      "Research questions should cover at least 3 different categories"
    );
  }

  // Check research dimension coverage
  const dimNames = new Set(data.researchDimensions.map((d) => d.name));
  if (dimNames.size < 3) {
    warnings.push(
      "Research dimensions should cover at least 3 different categories"
    );
  }

  // Check analysis confidence
  if (data.analysisConfidence < 0.3) {
    warnings.push(
      "Analysis confidence is quite low; consider adding more ambiguity notes"
    );
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
