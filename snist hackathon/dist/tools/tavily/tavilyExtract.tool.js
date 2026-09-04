"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tavilyExtractTool = void 0;
const tools_1 = require("@langchain/core/tools");
const zod_1 = require("zod");
const env_1 = require("../../config/env");
exports.tavilyExtractTool = new tools_1.DynamicStructuredTool({
    name: "tavily_extract",
    description: "Extracts deep full-page content from specific URLs. Use for important candidate solutions where search snippets are insufficient. Returns full page text content.",
    schema: zod_1.z.object({
        urls: zod_1.z
            .array(zod_1.z.string().url())
            .min(1)
            .max(5)
            .describe("URLs to extract content from (max 5)"),
    }),
    func: async ({ urls }) => {
        const config = (0, env_1.getConfig)();
        if (!config.TAVILY_API_KEY) {
            return JSON.stringify({
                success: false,
                error: "TAVILY_API_KEY not configured",
                results: [],
            });
        }
        try {
            const response = await fetch("https://api.tavily.com/extract", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${config.TAVILY_API_KEY}`,
                },
                body: JSON.stringify({
                    urls,
                }),
            });
            if (!response.ok) {
                const errorText = await response.text();
                return JSON.stringify({
                    success: false,
                    error: `Tavily Extract error ${response.status}: ${errorText}`,
                    results: [],
                });
            }
            const data = (await response.json());
            const results = (data.results || []).map((r) => ({
                url: r.url || "",
                content: r.raw_content || "",
                success: r.success || false,
            }));
            const failedResults = (data.failed_results || []).map((r) => ({
                url: r.url || "",
                error: r.error || "Extraction failed",
            }));
            return JSON.stringify({
                success: true,
                results,
                failedResults,
                provider: "tavily_extract",
            });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Unknown Tavily Extract error";
            return JSON.stringify({
                success: false,
                error: message,
                results: [],
            });
        }
    },
});
//# sourceMappingURL=tavilyExtract.tool.js.map