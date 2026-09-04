export function buildStrategistUserPrompt(input: {
  problemStatement: string;
  hackathon?: {
    name?: string;
    description?: string;
    durationHours?: number;
    judgingCriteria?: Array<{
      name: string;
      weight?: number;
      description?: string;
    }>;
    rules?: string[];
    restrictions?: string[];
    allowedTechnologies?: string[];
    forbiddenTechnologies?: string[];
  };
  userConstraints?: string[];
  teamSize?: number;
}): string {
  const sections: string[] = [];

  sections.push(`PROBLEM STATEMENT:\n${input.problemStatement}`);

  if (input.hackathon) {
    const hParts: string[] = [];
    if (input.hackathon.name) hParts.push(`Name: ${input.hackathon.name}`);
    if (input.hackathon.description)
      hParts.push(`Description: ${input.hackathon.description}`);
    if (input.hackathon.durationHours)
      hParts.push(`Duration: ${input.hackathon.durationHours} hours`);
    if (input.hackathon.judgingCriteria?.length) {
      hParts.push("Judging Criteria:");
      for (const c of input.hackathon.judgingCriteria) {
        hParts.push(
          `  - ${c.name}${c.weight ? ` (weight: ${c.weight})` : ""}${c.description ? `: ${c.description}` : ""}`
        );
      }
    }
    if (input.hackathon.rules?.length) {
      hParts.push("Rules:");
      for (const r of input.hackathon.rules) hParts.push(`  - ${r}`);
    }
    if (input.hackathon.restrictions?.length) {
      hParts.push("Restrictions:");
      for (const r of input.hackathon.restrictions) hParts.push(`  - ${r}`);
    }
    if (input.hackathon.allowedTechnologies?.length) {
      hParts.push(
        `Allowed Technologies: ${input.hackathon.allowedTechnologies.join(", ")}`
      );
    }
    if (input.hackathon.forbiddenTechnologies?.length) {
      hParts.push(
        `Forbidden Technologies: ${input.hackathon.forbiddenTechnologies.join(", ")}`
      );
    }
    sections.push(`HACKATHON INFORMATION:\n${hParts.join("\n")}`);
  }

  if (input.userConstraints?.length) {
    sections.push(
      `USER-PROVIDED CONSTRAINTS:\n${input.userConstraints.map((c) => `- ${c}`).join("\n")}`
    );
  }

  if (input.teamSize) {
    sections.push(`TEAM SIZE: ${input.teamSize}`);
  }

  sections.push(`TASK: Analyze the above problem statement and output a single JSON object matching the ProblemAnalysis schema. Output ONLY the JSON — no markdown, no code fences, no explanation.`);

  return sections.join("\n\n");
}
