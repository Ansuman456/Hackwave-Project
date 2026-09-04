import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
export declare const geminiWebSearchTool: DynamicStructuredTool<z.ZodObject<{
    query: z.ZodString;
    purpose: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    query: string;
    purpose?: string | undefined;
}, {
    query: string;
    purpose?: string | undefined;
}>, {
    query: string;
    purpose?: string | undefined;
}, {
    query: string;
    purpose?: string | undefined;
}, string, unknown, "gemini_web_search">;
//# sourceMappingURL=geminiWebSearch.tool.d.ts.map