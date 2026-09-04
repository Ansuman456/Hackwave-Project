"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.geminiWebSearchTool = void 0;
const tools_1 = require("@langchain/core/tools");
const zod_1 = require("zod");
const env_1 = require("../../config/env");
exports.geminiWebSearchTool = new tools_1.DynamicStructuredTool({
    name: "gemini_web_search",
    description: "Searches the live web using Gemini API with Google Search Grounding. Returns search results with titles, URLs, snippets, and grounding metadata. Use for discovering products, startups, hackathon projects, research, and technical approaches.",
    schema: zod_1.z.object({
        query: zod_1.z.string().describe("The search query to execute"),
        purpose: zod_1.z
            .string()
            .optional()
            .describe("Brief description of why this search is being performed"),
    }),
    func: async ({ query, purpose }) => {
        const config = (0, env_1.getConfig)();
        if (!config.GEMINI_API_KEY) {
            return JSON.stringify({
                success: false,
                error: "GEMINI_API_KEY not configured",
                results: [],
            });
        }
        try {
            const { GoogleGenerativeAI } = await Promise.resolve().then(() => __importStar(require("@google/generative-ai")));
            const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);
            const searchPrompt = purpose
                ? `Search for: ${query}\nPurpose: ${purpose}`
                : `Search for: ${query}`;
            let results = [];
            try {
                const model = genAI.getGenerativeModel({
                    model: config.GEMINI_MODEL,
                    tools: [{ googleSearch: {} }],
                });
                // 4-second strict timeout for Gemini search grounding
                const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Gemini search grounding timeout (4s exceeded)")), 4000));
                const result = (await Promise.race([
                    model.generateContent(searchPrompt),
                    timeoutPromise,
                ]));
                const response = result.response;
                // Extract grounded metadata
                const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
                if (groundingMetadata?.groundingChunks || groundingMetadata?.groundingChuncks) {
                    const chunks = groundingMetadata.groundingChunks || groundingMetadata.groundingChuncks;
                    for (const chunk of chunks) {
                        const web = chunk.web;
                        if (web) {
                            results.push({
                                title: web.title || "",
                                url: web.uri || "",
                                snippet: "",
                                domain: extractDomain(web.uri || ""),
                            });
                        }
                    }
                }
                const textResponse = response.text();
                if (results.length === 0 && textResponse) {
                    const urlRegex = /https?:\/\/[^\s\)]+/g;
                    const urls = textResponse.match(urlRegex) || [];
                    for (const url of urls.slice(0, 10)) {
                        results.push({
                            title: "",
                            url: url.replace(/[,\.\)]+$/, ""),
                            snippet: textResponse.substring(0, 200),
                            domain: extractDomain(url),
                        });
                    }
                }
            }
            catch (groundingError) {
                // Fallback: Use standard Gemini model generation if search grounding quota is exceeded or fails
                const fallbackModel = genAI.getGenerativeModel({
                    model: config.GEMINI_MODEL,
                });
                const fallbackResult = await fallbackModel.generateContent(`List 5 real-world existing products, startups, open-source GitHub repositories, or tools related to: "${query}". Return title, URL, and a brief description for each.`);
                const fallbackText = fallbackResult.response.text();
                const urlRegex = /https?:\/\/[^\s\)]+/g;
                const urls = fallbackText.match(urlRegex) || [];
                for (const url of urls.slice(0, 5)) {
                    results.push({
                        title: `Solution for ${query}`,
                        url: url.replace(/[,\.\)]+$/, ""),
                        snippet: fallbackText.substring(0, 250),
                        domain: extractDomain(url),
                    });
                }
                if (results.length === 0) {
                    results.push({
                        title: `Known solutions for ${query}`,
                        url: `https://github.com/search?q=${encodeURIComponent(query)}`,
                        snippet: fallbackText.substring(0, 300),
                        domain: "github.com",
                    });
                }
            }
            return JSON.stringify({
                success: true,
                query,
                results,
                provider: "gemini",
            });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Unknown Gemini error";
            return JSON.stringify({
                success: false,
                error: message,
                query,
                results: [],
                provider: "gemini",
            });
        }
    },
});
function extractDomain(url) {
    try {
        return new URL(url).hostname.replace(/^www\./, "");
    }
    catch {
        return "";
    }
}
//# sourceMappingURL=geminiWebSearch.tool.js.map