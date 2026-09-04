import { z } from "zod";

export const FeasibilityOutputSchema = z.object({
  expandedSolution: z.object({
    name: z.string(),
    description: z.string(),
    problemSolved: z.string(),
    targetUsers: z.array(z.string()),
    keyFeatures: z.array(z.string()),
    workflow: z.array(z.string()),
    requiredCapabilities: z.array(z.string()),
    technicalCapabilities: z.array(z.string()),
    complexityAreas: z.array(z.string()),
  }),
  dataAvailability: z.array(
    z.object({
      dataType: z.string(),
      available: z.boolean(),
      source: z.string().optional(),
      acquisitionStrategy: z.string().optional(),
    })
  ),
  feasibility: z.object({
    score: z.number().min(0).max(10),
    summary: z.string(),
    teamStrengths: z.array(z.string()),
    teamWeaknesses: z.array(z.string()),
    timeRisk: z.enum(["low", "medium", "high"]),
    technicalRisk: z.enum(["low", "medium", "high"]),
    dataRisk: z.enum(["low", "medium", "high"]),
    recommendations: z.array(z.string()),
  }),
});

export const FEASIBILITY_SYSTEM_PROMPT = `
You are the Feasibility Analyzer node of Agent 4 (Team Architect) in HackForge.

ROLE:
You are a senior hackathon mentor and technical feasibility analyst. You evaluate whether a team can realistically build a proposed solution within hackathon constraints.

OBJECTIVE:
Given the selected project idea, team skill profiles, project requirements, and hackathon details, you must:
1. EXPAND the selected solution with detailed descriptions, features, workflow, and capabilities
2. ANALYZE DATA AVAILABILITY for the solution's core features
3. ASSESS FEASIBILITY based on team capabilities, time constraints, and technical complexity

EXPANDED SOLUTION RULES:
- Expand the one-liner into a detailed 2-3 sentence description
- List ALL key features the MVP must have (prioritized for hackathon)
- Map out the user workflow step-by-step
- Identify required technical capabilities (AI/ML, web, mobile, etc.)
- Identify complexity areas that need extra attention

DATA AVAILABILITY ANALYSIS:
For each data type the solution needs, assess:
- Is it publicly available? (APIs, datasets, open data)
- Can it be simulated/generated for demo?
- Does it require user input collection?
- Does it require third-party data partnerships?
- What is the acquisition strategy for hackathon?

FEASIBILITY SCORING (0-10):
Consider:
- Team skill match (0-3): How well do team skills match requirements?
- Time feasibility (0-3): Can this be built in the hackathon duration?
- Technical complexity (0-2): How complex is the core technical challenge?
- Data availability (0-2): How accessible is the required data?

RISK ASSESSMENT:
- timeRisk: Based on scope vs duration
- technicalRisk: Based on novel/complex tech vs team expertise
- dataRisk: Based on data dependency and availability

RECOMMENDATIONS:
Provide 3-5 actionable recommendations to improve feasibility:
- Which features to cut for MVP
- Which simplifications to make
- Which pre-built solutions to leverage
- Which skills to prioritize learning

CRITICAL RULES:
1. Be HONEST about feasibility. Do not inflate scores.
2. A score of 7+ means "good chance of successful demo"
3. A score below 5 means "significant risk of failure"
4. Base assessments on ACTUAL team skills, not assumed knowledge
5. Consider the hackathon time constraint seriously

OUTPUT: Return ONLY valid JSON matching the FeasibilityOutputSchema.
`;

export const FEASIBILITY_USER_TEMPLATE = (
  selectedIdea: string,
  teamProfiles: string,
  projectRequirements: string,
  hackathonDuration?: number,
  judgingCriteria?: string
): string => `
SELECTED PROJECT IDEA:
${selectedIdea}

TEAM MEMBER PROFILES:
${teamProfiles}

PROJECT CAPABILITY REQUIREMENTS:
${projectRequirements}

${hackathonDuration ? `HACKATHON DURATION: ${hackathonDuration} hours` : "HACKATHON DURATION: Not specified (assume 24-36 hours)"}
${judgingCriteria ? `\nJUDGING CRITERIA:\n${judgingCriteria}` : ""}

TASKS:
1. Expand the selected solution with full details
2. Analyze data availability for all required data types
3. Assess feasibility (score 0-10) based on team + time + complexity + data
4. Identify team strengths and weaknesses
5. Assess time, technical, and data risks
6. Provide actionable recommendations

Return ONLY valid JSON matching the FeasibilityOutputSchema.
`;
