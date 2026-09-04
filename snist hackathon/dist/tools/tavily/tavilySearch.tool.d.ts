import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
export declare const tavilyWebSearchTool: DynamicStructuredTool<z.ZodObject<{
    query: z.ZodString;
    searchDepth: z.ZodDefault<z.ZodEnum<["basic", "advanced"]>>;
    maxResults: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    query: string;
    searchDepth: "basic" | "advanced";
    maxResults: number;
}, {
    query: string;
    searchDepth?: "basic" | "advanced" | undefined;
    maxResults?: number | undefined;
}>, {
    query: string;
    searchDepth: "basic" | "advanced";
    maxResults: number;
}, {
    query: string;
    searchDepth?: "basic" | "advanced" | undefined;
    maxResults?: number | undefined;
}, string, unknown, "tavily_web_search">;
//# sourceMappingURL=tavilySearch.tool.d.ts.map