import { z } from "zod";
export declare const ClassifierOutputSchema: z.ZodObject<{
    classifications: z.ZodArray<z.ZodObject<{
        url: z.ZodString;
        candidateName: z.ZodString;
        classification: z.ZodEnum<["direct", "adjacent", "technical", "irrelevant"]>;
        confidence: z.ZodNumber;
        reasoning: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        confidence: number;
        url: string;
        classification: "technical" | "direct" | "adjacent" | "irrelevant";
        reasoning: string;
        candidateName: string;
    }, {
        confidence: number;
        url: string;
        classification: "technical" | "direct" | "adjacent" | "irrelevant";
        reasoning: string;
        candidateName: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    classifications: {
        confidence: number;
        url: string;
        classification: "technical" | "direct" | "adjacent" | "irrelevant";
        reasoning: string;
        candidateName: string;
    }[];
}, {
    classifications: {
        confidence: number;
        url: string;
        classification: "technical" | "direct" | "adjacent" | "irrelevant";
        reasoning: string;
        candidateName: string;
    }[];
}>;
export type ClassifierOutput = z.infer<typeof ClassifierOutputSchema>;
export declare const CLASSIFIER_SYSTEM_PROMPT = "You are the Candidate Classifier node of Agent 2 (Researcher) in HackForge.\n\nROLE:\nYou are a senior research analyst who classifies discovered web sources and GitHub repositories by their relevance to a specific hackathon problem.\n\nINPUT:\nA list of raw search result snippets (title, snippet, domain) and the target Core Problem from the ProblemAnalysis.\n\nOBJECTIVE:\nClassify each discovered reference/URL into one of four precise categories:\n\n1. DIRECT: Solves the exact same or nearly identical user problem for the same target user context.\n   Example: For \"food waste in college hostels\" \u2192 \"College meal demand prediction platform for campus canteens\"\n2. ADJACENT: Solves a similar problem for a different user context (e.g., restaurant food waste instead of college hostel), OR solves a different problem for the same user context.\n   Example: For \"food waste in college hostels\" \u2192 \"Commercial kitchen AI waste tracking system\"\n3. TECHNICAL: Demonstrates a relevant technique/mechanism (e.g., time-series forecasting model) applied to an unrelated domain.\n   Example: For \"food waste in college hostels\" \u2192 \"Weather prediction using LSTM networks\"\n4. IRRELEVANT: Generic news articles, spam, unrelated software, low-quality forum posts, or content that does not describe a specific product/project/implementation.\n\nCLASSIFICATION RULES:\n- Be strict. Do not classify generic blogs as DIRECT unless they describe a specific product or project.\n- Preserve ADJACENT and TECHNICAL items (Agent 3 will use them for feature combination).\n- Discard IRRELEVANT items by marking classification as \"irrelevant\".\n- If a result describes a real product/project but information is limited, classify based on what is available.\n- Use the domain, title, and snippet to determine the nature of the result.\n\nOUTPUT: Return ONLY valid JSON matching the ClassifierOutputSchema. No markdown, no explanation.";
//# sourceMappingURL=candidateClassifier.d.ts.map