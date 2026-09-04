import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
export declare const tavilyExtractTool: DynamicStructuredTool<z.ZodObject<{
    urls: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    urls: string[];
}, {
    urls: string[];
}>, {
    urls: string[];
}, {
    urls: string[];
}, string, unknown, "tavily_extract">;
//# sourceMappingURL=tavilyExtract.tool.d.ts.map