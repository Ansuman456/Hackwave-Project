import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { getConfig } from "../../config/env";

export const tavilyExtractTool = new DynamicStructuredTool({
  name: "tavily_extract",
  description:
    "Extracts deep full-page content from specific URLs. Use for important candidate solutions where search snippets are insufficient. Returns full page text content.",
  schema: z.object({
    urls: z
      .array(z.string().url())
      .min(1)
      .max(5)
      .describe("URLs to extract content from (max 5)"),
  }),
  func: async ({ urls }) => {
    const config = getConfig();

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

      const data = (await response.json()) as any;

      const results = (data.results || []).map(
        (r: { url?: string; raw_content?: string; success?: boolean }) => ({
          url: r.url || "",
          content: r.raw_content || "",
          success: r.success || false,
        })
      );

      const failedResults = (data.failed_results || []).map(
        (r: { url?: string; error?: string }) => ({
          url: r.url || "",
          error: r.error || "Extraction failed",
        })
      );

      return JSON.stringify({
        success: true,
        results,
        failedResults,
        provider: "tavily_extract",
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown Tavily Extract error";
      return JSON.stringify({
        success: false,
        error: message,
        results: [],
      });
    }
  },
});
