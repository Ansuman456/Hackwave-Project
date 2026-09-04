import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { getConfig } from "../../config/env";

export const tavilyWebSearchTool = new DynamicStructuredTool({
  name: "tavily_web_search",
  description:
    "Searches the web using Tavily Search API. Returns search results with titles, URLs, content snippets, and relevance scores. Use as an independent search source alongside Gemini for broader discovery.",
  schema: z.object({
    query: z.string().describe("The search query to execute"),
    searchDepth: z
      .enum(["basic", "advanced"])
      .default("basic")
      .describe(
        "Search depth: basic (faster, cheaper) or advanced (deeper, more expensive)"
      ),
    maxResults: z
      .number()
      .min(1)
      .max(20)
      .default(10)
      .describe("Maximum number of results to return"),
  }),
  func: async ({ query, searchDepth, maxResults }) => {
    const config = getConfig();

    if (!config.TAVILY_API_KEY) {
      return JSON.stringify({
        success: false,
        error: "TAVILY_API_KEY not configured",
        results: [],
      });
    }

    try {
      const response = await fetch("https://api.tavily.com/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.TAVILY_API_KEY}`,
        },
        body: JSON.stringify({
          query,
          search_depth: searchDepth,
          max_results: maxResults,
          include_answer: true,
          include_raw_content: false,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return JSON.stringify({
          success: false,
          error: `Tavily API error ${response.status}: ${errorText}`,
          query,
          results: [],
          provider: "tavily",
        });
      }

      const data = (await response.json()) as any;

      const results = (data.results || []).map(
        (r: {
          title?: string;
          url?: string;
          content?: string;
          score?: number;
        }) => ({
          title: r.title || "",
          url: r.url || "",
          snippet: r.content?.substring(0, 300) || "",
          content: r.content || "",
          domain: extractDomain(r.url || ""),
          score: r.score || 0,
        })
      );

      return JSON.stringify({
        success: true,
        query,
        results,
        answer: data.answer || null,
        provider: "tavily",
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown Tavily error";
      return JSON.stringify({
        success: false,
        error: message,
        query,
        results: [],
        provider: "tavily",
      });
    }
  },
});

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}
