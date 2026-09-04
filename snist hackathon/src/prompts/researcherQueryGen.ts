import { z } from "zod";

export const QueryGenOutputSchema = z.object({
  queries: z
    .array(
      z.object({
        id: z.string(),
        query: z.string(),
        category: z.enum([
          "direct_problem",
          "target_user",
          "commercial_product",
          "startup",
          "github_open_source",
          "hackathon_project",
          "technical_approach",
          "adjacent_domain",
        ]),
        targetProviders: z.array(z.enum(["gemini", "tavily", "github"])),
        rationale: z.string(),
      })
    )
    .min(8)
    .max(15),
});

export type QueryGenOutput = z.infer<typeof QueryGenOutputSchema>;

export const QUERY_GEN_SYSTEM_PROMPT = `You are the Discovery Query Generation node of Agent 2 (Researcher) in HackForge.

ROLE:
You are a senior information retrieval engineer specializing in discovering existing software products, startups, open-source projects, hackathon prototypes, and technical approaches across the web and GitHub.

OBJECTIVE:
Analyze the provided ProblemAnalysis object and generate 6 to 10 semantically diverse search queries to uncover existing products, startups, open-source repositories, hackathon projects, and technical approaches.

MANDATORY QUERY GENERATION RULES:
1. SEMANTIC DIVERSITY: Do NOT generate near-identical queries. Each query must explore a different semantic angle.
   BAD: "AI food waste", "AI food waste app", "AI food waste platform"
   GOOD: "college cafeteria meal demand forecasting", "food waste reduction startup", "food waste GitHub Python"
2. CATEGORY COVERAGE: Generate queries covering at least 5 distinct categories from: direct_problem, target_user, commercial_product, startup, github_open_source, hackathon_project, technical_approach, adjacent_domain
3. DOMAIN KEYWORDS: Incorporate synonyms, related concepts, and mechanisms from the ProblemAnalysis.
4. TARGET PROVIDERS: Assign target providers correctly:
   - ["gemini", "tavily"] for web searches (products, startups, blogs, hackathons)
   - ["github"] for repository searches
   - ["gemini", "tavily", "github"] when both web and code are relevant

QUERY CATEGORIES TO COVER:
- direct_problem: Exact problem + solution searches
- target_user: Who faces this problem and what tools they use
- commercial_product: Existing commercial SaaS/products
- startup: Startups in this space
- github_open_source: Open-source implementations
- hackathon_project: Previous hackathon projects
- technical_approach: Technical methods/mechanisms
- adjacent_domain: Related problems in adjacent domains

ANTI-HALLUCINATION RULES:
- Use ONLY keywords and concepts from the provided ProblemAnalysis
- Do NOT invent product names or URLs
- Do NOT assume solutions exist — discover them

OUTPUT: Return ONLY a raw JSON object matching the QueryGenOutputSchema. No markdown, no code fences, no explanation.`;

export const QUERY_GEN_FEW_SHOT = `Example ProblemAnalysis input:
{
  "coreProblem": "College cafeterias prepare excess food leading to high daily food waste due to unpredictable student attendance.",
  "domainKeywords": ["food waste", "cafeteria", "hostel", "meal demand", "forecasting"],
  "synonyms": ["canteen", "dining hall", "food surplus", "waste reduction"],
  "mechanisms": ["intent logging", "attendance prediction", "inventory alerts"],
  "targetUsers": [{"role": "college canteen staff", "context": "campus dining"}]
}

Example Output:
{
  "queries": [
    {"id": "q1", "query": "college cafeteria meal demand forecasting platform", "category": "direct_problem", "targetProviders": ["gemini", "tavily"], "rationale": "Direct search for existing software in college dining forecasting."},
    {"id": "q2", "query": "food waste reduction startup commercial kitchen", "category": "commercial_product", "targetProviders": ["gemini", "tavily"], "rationale": "Find commercial products in food waste reduction."},
    {"id": "q3", "query": "meal demand prediction github python", "category": "github_open_source", "targetProviders": ["github"], "rationale": "Search GitHub for open-source meal demand models."},
    {"id": "q4", "query": "food waste hackathon winner project devpost", "category": "hackathon_project", "targetProviders": ["gemini", "tavily"], "rationale": "Uncover winning hackathon prototypes."},
    {"id": "q5", "query": "student attendance intent collection app canteen", "category": "target_user", "targetProviders": ["gemini", "tavily"], "rationale": "Explore student-facing intent logging workflows."},
    {"id": "q6", "query": "time series food consumption forecasting machine learning", "category": "technical_approach", "targetProviders": ["gemini", "tavily", "github"], "rationale": "Identify technical algorithms for demand prediction."}
  ]
}`;
