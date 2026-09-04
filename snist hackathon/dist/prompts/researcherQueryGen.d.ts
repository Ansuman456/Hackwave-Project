import { z } from "zod";
export declare const QueryGenOutputSchema: z.ZodObject<{
    queries: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        query: z.ZodString;
        category: z.ZodEnum<["direct_problem", "target_user", "commercial_product", "startup", "github_open_source", "hackathon_project", "technical_approach", "adjacent_domain"]>;
        targetProviders: z.ZodArray<z.ZodEnum<["gemini", "tavily", "github"]>, "many">;
        rationale: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        category: "startup" | "direct_problem" | "target_user" | "commercial_product" | "github_open_source" | "hackathon_project" | "technical_approach" | "adjacent_domain";
        id: string;
        rationale: string;
        query: string;
        targetProviders: ("github" | "gemini" | "tavily")[];
    }, {
        category: "startup" | "direct_problem" | "target_user" | "commercial_product" | "github_open_source" | "hackathon_project" | "technical_approach" | "adjacent_domain";
        id: string;
        rationale: string;
        query: string;
        targetProviders: ("github" | "gemini" | "tavily")[];
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    queries: {
        category: "startup" | "direct_problem" | "target_user" | "commercial_product" | "github_open_source" | "hackathon_project" | "technical_approach" | "adjacent_domain";
        id: string;
        rationale: string;
        query: string;
        targetProviders: ("github" | "gemini" | "tavily")[];
    }[];
}, {
    queries: {
        category: "startup" | "direct_problem" | "target_user" | "commercial_product" | "github_open_source" | "hackathon_project" | "technical_approach" | "adjacent_domain";
        id: string;
        rationale: string;
        query: string;
        targetProviders: ("github" | "gemini" | "tavily")[];
    }[];
}>;
export type QueryGenOutput = z.infer<typeof QueryGenOutputSchema>;
export declare const QUERY_GEN_SYSTEM_PROMPT = "You are the Discovery Query Generation node of Agent 2 (Researcher) in HackForge.\n\nROLE:\nYou are a senior information retrieval engineer specializing in discovering existing software products, startups, open-source projects, hackathon prototypes, and technical approaches across the web and GitHub.\n\nOBJECTIVE:\nAnalyze the provided ProblemAnalysis object and generate 6 to 10 semantically diverse search queries to uncover existing products, startups, open-source repositories, hackathon projects, and technical approaches.\n\nMANDATORY QUERY GENERATION RULES:\n1. SEMANTIC DIVERSITY: Do NOT generate near-identical queries. Each query must explore a different semantic angle.\n   BAD: \"AI food waste\", \"AI food waste app\", \"AI food waste platform\"\n   GOOD: \"college cafeteria meal demand forecasting\", \"food waste reduction startup\", \"food waste GitHub Python\"\n2. CATEGORY COVERAGE: Generate queries covering at least 5 distinct categories from: direct_problem, target_user, commercial_product, startup, github_open_source, hackathon_project, technical_approach, adjacent_domain\n3. DOMAIN KEYWORDS: Incorporate synonyms, related concepts, and mechanisms from the ProblemAnalysis.\n4. TARGET PROVIDERS: Assign target providers correctly:\n   - [\"gemini\", \"tavily\"] for web searches (products, startups, blogs, hackathons)\n   - [\"github\"] for repository searches\n   - [\"gemini\", \"tavily\", \"github\"] when both web and code are relevant\n\nQUERY CATEGORIES TO COVER:\n- direct_problem: Exact problem + solution searches\n- target_user: Who faces this problem and what tools they use\n- commercial_product: Existing commercial SaaS/products\n- startup: Startups in this space\n- github_open_source: Open-source implementations\n- hackathon_project: Previous hackathon projects\n- technical_approach: Technical methods/mechanisms\n- adjacent_domain: Related problems in adjacent domains\n\nANTI-HALLUCINATION RULES:\n- Use ONLY keywords and concepts from the provided ProblemAnalysis\n- Do NOT invent product names or URLs\n- Do NOT assume solutions exist \u2014 discover them\n\nOUTPUT: Return ONLY a raw JSON object matching the QueryGenOutputSchema. No markdown, no code fences, no explanation.";
export declare const QUERY_GEN_FEW_SHOT = "Example ProblemAnalysis input:\n{\n  \"coreProblem\": \"College cafeterias prepare excess food leading to high daily food waste due to unpredictable student attendance.\",\n  \"domainKeywords\": [\"food waste\", \"cafeteria\", \"hostel\", \"meal demand\", \"forecasting\"],\n  \"synonyms\": [\"canteen\", \"dining hall\", \"food surplus\", \"waste reduction\"],\n  \"mechanisms\": [\"intent logging\", \"attendance prediction\", \"inventory alerts\"],\n  \"targetUsers\": [{\"role\": \"college canteen staff\", \"context\": \"campus dining\"}]\n}\n\nExample Output:\n{\n  \"queries\": [\n    {\"id\": \"q1\", \"query\": \"college cafeteria meal demand forecasting platform\", \"category\": \"direct_problem\", \"targetProviders\": [\"gemini\", \"tavily\"], \"rationale\": \"Direct search for existing software in college dining forecasting.\"},\n    {\"id\": \"q2\", \"query\": \"food waste reduction startup commercial kitchen\", \"category\": \"commercial_product\", \"targetProviders\": [\"gemini\", \"tavily\"], \"rationale\": \"Find commercial products in food waste reduction.\"},\n    {\"id\": \"q3\", \"query\": \"meal demand prediction github python\", \"category\": \"github_open_source\", \"targetProviders\": [\"github\"], \"rationale\": \"Search GitHub for open-source meal demand models.\"},\n    {\"id\": \"q4\", \"query\": \"food waste hackathon winner project devpost\", \"category\": \"hackathon_project\", \"targetProviders\": [\"gemini\", \"tavily\"], \"rationale\": \"Uncover winning hackathon prototypes.\"},\n    {\"id\": \"q5\", \"query\": \"student attendance intent collection app canteen\", \"category\": \"target_user\", \"targetProviders\": [\"gemini\", \"tavily\"], \"rationale\": \"Explore student-facing intent logging workflows.\"},\n    {\"id\": \"q6\", \"query\": \"time series food consumption forecasting machine learning\", \"category\": \"technical_approach\", \"targetProviders\": [\"gemini\", \"tavily\", \"github\"], \"rationale\": \"Identify technical algorithms for demand prediction.\"}\n  ]\n}";
//# sourceMappingURL=researcherQueryGen.d.ts.map