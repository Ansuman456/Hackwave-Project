import { z } from "zod";
export declare const EnrichmentQueryOutputSchema: z.ZodObject<{
    candidateId: z.ZodString;
    candidateName: z.ZodString;
    targetedQueries: z.ZodArray<z.ZodObject<{
        query: z.ZodString;
        targetField: z.ZodEnum<["workflow", "targetUsers", "features", "technologies", "limitations", "githubRepository"]>;
        targetProviders: z.ZodArray<z.ZodEnum<["gemini", "tavily", "github"]>, "many">;
    }, "strip", z.ZodTypeAny, {
        query: string;
        targetProviders: ("github" | "gemini" | "tavily")[];
        targetField: "workflow" | "targetUsers" | "features" | "technologies" | "limitations" | "githubRepository";
    }, {
        query: string;
        targetProviders: ("github" | "gemini" | "tavily")[];
        targetField: "workflow" | "targetUsers" | "features" | "technologies" | "limitations" | "githubRepository";
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    candidateName: string;
    candidateId: string;
    targetedQueries: {
        query: string;
        targetProviders: ("github" | "gemini" | "tavily")[];
        targetField: "workflow" | "targetUsers" | "features" | "technologies" | "limitations" | "githubRepository";
    }[];
}, {
    candidateName: string;
    candidateId: string;
    targetedQueries: {
        query: string;
        targetProviders: ("github" | "gemini" | "tavily")[];
        targetField: "workflow" | "targetUsers" | "features" | "technologies" | "limitations" | "githubRepository";
    }[];
}>;
export type EnrichmentQueryOutput = z.infer<typeof EnrichmentQueryOutputSchema>;
export declare const ENRICHMENT_QUERY_SYSTEM_PROMPT = "You are the Candidate Enrichment Query node of Agent 2 (Researcher) in HackForge.\n\nROLE:\nYou are a research engineer who generates targeted search queries to fill missing information about a discovered candidate solution.\n\nINPUT:\nA candidate solution entity (e.g., \"Winnow Vision\"), its current populated fields, and identified missing priority fields (e.g., missing workflow, technologies, or limitations).\n\nOBJECTIVE:\nGenerate 2 to 4 candidate-specific search queries targeted precisely at filling the missing priority fields.\n\nQUERY GENERATION STRATEGY:\n- If workflow is missing: '\"CandidateName\" how it works step by step workflow process'\n- If targetUsers is missing: '\"CandidateName\" target users customers who uses'\n- If features is missing: '\"CandidateName\" features capabilities what it does'\n- If technologies is missing: '\"CandidateName\" architecture tech stack built with github'\n- If limitations is missing: '\"CandidateName\" limitations drawbacks challenges problems'\n- If githubRepository is missing: '\"CandidateName\" github open source repository'\n\nRULES:\n- Each query must target a specific missing field.\n- Use the candidate name and domain keywords in queries.\n- Assign correct target providers (github for repo searches, gemini+tavily for web).\n- Do NOT generate vague or overly broad queries.\n\nOUTPUT: Return ONLY valid JSON matching the EnrichmentQueryOutputSchema. No markdown, no explanation.";
//# sourceMappingURL=enrichmentQueryGen.d.ts.map