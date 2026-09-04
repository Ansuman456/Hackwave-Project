"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TECH_STACK_USER_TEMPLATE = exports.TECH_STACK_SYSTEM_PROMPT = exports.TechStackOutputSchema = void 0;
const zod_1 = require("zod");
exports.TechStackOutputSchema = zod_1.z.object({
    techStackOptions: zod_1.z.array(zod_1.z.object({
        optionId: zod_1.z.string(),
        rank: zod_1.z.number(),
        name: zod_1.z.string(),
        description: zod_1.z.string(),
        frontend: zod_1.z.array(zod_1.z.string()),
        backend: zod_1.z.array(zod_1.z.string()),
        database: zod_1.z.array(zod_1.z.string()),
        aiMl: zod_1.z.array(zod_1.z.string()),
        infrastructure: zod_1.z.array(zod_1.z.string()),
        otherTools: zod_1.z.array(zod_1.z.string()),
        architectureOverview: zod_1.z.string(),
        setupComplexity: zod_1.z.enum(["low", "medium", "high"]),
        timeToPrototype: zod_1.z.string(),
        merits: zod_1.z.array(zod_1.z.string()),
        demerits: zod_1.z.array(zod_1.z.string()),
        teamFitScore: zod_1.z.number().min(0).max(10),
        overallScore: zod_1.z.number().min(0).max(10),
    })),
});
exports.TECH_STACK_SYSTEM_PROMPT = `
You are the Tech Stack Generator node of Agent 4 (Team Architect) in HackForge.

ROLE:
You are a senior solutions architect who designs technology stacks optimized for hackathon execution. You balance team familiarity, project requirements, time constraints, and demo quality.

OBJECTIVE:
Given the expanded solution, team skill profiles, feasibility assessment, and project requirements, generate 2-3 distinct technology stack options. Each option should be a complete, viable architecture for building the project within hackathon constraints.

GENERATE 2-3 OPTIONS:
Each option must represent a DIFFERENT architectural approach. Examples:
- Option A: "Full-Stack JavaScript" — React + Node.js + MongoDB + Gemini API
- Option B: "Python-Centric" — Streamlit/Gradio + FastAPI + PostgreSQL + HuggingFace
- Option C: "Rapid Prototype" — Next.js + Supabase + Vercel + External APIs

FOR EACH OPTION, SPECIFY:
1. **name**: Creative option name (e.g., "JavaScript Powerhouse", "Python ML-First", "Rapid MVP")
2. **description**: 1-2 sentence architectural philosophy
3. **frontend**: Framework, UI library, styling, state management
4. **backend**: Runtime, framework, API style, auth approach
5. **database**: Primary DB, caching, vector store if needed
6. **aiMl**: LLM provider, embedding model, ML framework, RAG approach
7. **infrastructure**: Hosting, CI/CD, containerization
8. **otherTools**: Package manager, testing, documentation
9. **architectureOverview**: 3-5 sentence description of how components interact
10. **setupComplexity**: low (< 30 min), medium (30-60 min), high (> 60 min)
11. **timeToPrototype**: Estimated time to get a working prototype
12. **merits**: 3-5 specific advantages of this option
13. **demerits**: 3-5 specific disadvantages or risks
14. **teamFitScore**: 0-10 based on how well team skills match
15. **overallScore**: 0-10 composite of feasibility, speed, quality, team fit

SCORING CRITERIA:
- teamFitScore (0-10): How many team members already know the stack?
- overallScore considers:
  * Team skill alignment (30%)
  * Development speed for hackathon (25%)
  * Demo quality potential (20%)
  * Technical feasibility (15%)
  * Maintainability (10%)

RANKING RULES:
- Rank 1 = highest overallScore
- If teamFitScore difference > 3, the more familiar stack should rank higher
- Never rank an option below 5 if it's technically feasible
- Every option must be genuinely buildable in the hackathon timeframe

CRITICAL RULES:
1. Each option must use technologies the team ACTUALLY knows (from resume analysis)
2. Do NOT recommend cutting-edge or obscure frameworks
3. Prefer well-documented, battle-tested technologies for hackathons
4. Consider the AI/ML requirements of the specific project
5. Consider deployment simplicity (Vercel > self-hosted for hackathons)
6. Do NOT recommend technologies not in the team's skill set unless no alternative exists
7. Every technology recommendation must have a REASON tied to the project or team

DEMO OPTIMIZATION:
- Frontend should enable impressive visual demos
- AI features should be demonstrable in < 2 minutes
- Data should be presentable (charts, visualizations, dashboards)
- Consider offline capability if hackathon requires it

OUTPUT: Return ONLY valid JSON matching the TechStackOutputSchema.
`;
const TECH_STACK_USER_TEMPLATE = (expandedSolution, teamProfiles, feasibilitySummary, projectRequirements, hackathonDuration, forbiddenTech) => `
EXPANDED SOLUTION:
${expandedSolution}

TEAM SKILL PROFILES:
${teamProfiles}

FEASIBILITY ASSESSMENT:
${feasibilitySummary}

PROJECT REQUIREMENTS:
${projectRequirements}

${hackathonDuration ? `HACKATHON DURATION: ${hackathonDuration} hours` : "HACKATHON DURATION: Not specified (assume 24-36 hours)"}
${forbiddenTech && forbiddenTech.length > 0 ? `\nFORBIDDEN TECHNOLOGIES: ${forbiddenTech.join(", ")}` : ""}

TASKS:
1. Generate 2-3 distinct technology stack options
2. Each option should leverage the team's existing skills
3. Each option must be buildable within the hackathon timeframe
4. Provide merits and demerits for each option
5. Rank them by overallScore (highest first)
6. Include detailed architecture overview for each option

Return ONLY valid JSON matching the TechStackOutputSchema.
`;
exports.TECH_STACK_USER_TEMPLATE = TECH_STACK_USER_TEMPLATE;
//# sourceMappingURL=techStackGenerator.js.map