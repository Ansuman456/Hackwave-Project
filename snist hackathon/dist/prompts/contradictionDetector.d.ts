import { z } from "zod";
export declare const ContradictionOutputSchema: z.ZodObject<{
    contradictions: z.ZodArray<z.ZodObject<{
        solutionId: z.ZodString;
        field: z.ZodString;
        conflictingValues: z.ZodArray<z.ZodString, "many">;
        sourceIds: z.ZodArray<z.ZodString, "many">;
        status: z.ZodEnum<["unresolved", "resolved"]>;
    }, "strip", z.ZodTypeAny, {
        status: "unresolved" | "resolved";
        sourceIds: string[];
        solutionId: string;
        field: string;
        conflictingValues: string[];
    }, {
        status: "unresolved" | "resolved";
        sourceIds: string[];
        solutionId: string;
        field: string;
        conflictingValues: string[];
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    contradictions: {
        status: "unresolved" | "resolved";
        sourceIds: string[];
        solutionId: string;
        field: string;
        conflictingValues: string[];
    }[];
}, {
    contradictions: {
        status: "unresolved" | "resolved";
        sourceIds: string[];
        solutionId: string;
        field: string;
        conflictingValues: string[];
    }[];
}>;
export type ContradictionOutput = z.infer<typeof ContradictionOutputSchema>;
export declare const CONTRADICTION_DETECTOR_SYSTEM_PROMPT = "You are the Contradiction Detector node of Agent 2 (Researcher) in HackForge.\n\nROLE:\nYou are a research quality analyst who identifies conflicting information across multiple sources about the same solution.\n\nINPUT:\nExtracted facts from multiple sources for a candidate entity.\n\nOBJECTIVE:\nCompare facts extracted across sources. If conflicting facts exist about the same field, construct a Contradiction object identifying:\n- Which field has the conflict\n- The conflicting values from different sources\n- Which source IDs support each value\n\nEXAMPLES OF CONTRADICTIONS:\n- Source A says \"Works offline\" vs Source B says \"Requires continuous internet connection\"\n- Source A says \"Free for students\" vs Source B says \"Subscription-based pricing $9/month\"\n- Source A says \"Uses machine learning\" vs Source B says \"Uses rule-based algorithms\"\n\nRULES:\n- Only report genuine contradictions, not incomplete information.\n- If one source provides information and another is silent, that is NOT a contradiction.\n- If sources use different terminology for the same thing, that is NOT a contradiction.\n- Mark status as \"unresolved\" unless one source is clearly more authoritative.\n\nOUTPUT: Return ONLY valid JSON matching the ContradictionOutputSchema. If no contradictions are found, return {\"contradictions\": []}. No markdown, no explanation.";
//# sourceMappingURL=contradictionDetector.d.ts.map