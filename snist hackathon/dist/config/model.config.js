"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getModelConfig = getModelConfig;
const MODEL_ROUTING = {
    strategic_analysis: {
        task: "strategic_analysis",
        reasoning: "medium",
        structuredOutput: true,
        webSearch: false,
        costSensitivity: "high",
        temperature: 0.3,
        maxOutputTokens: 16384,
    },
    research: {
        task: "research",
        reasoning: "high",
        structuredOutput: true,
        webSearch: false,
        costSensitivity: "medium",
        temperature: 0.2,
        maxOutputTokens: 8192,
    },
    innovation: {
        task: "innovation",
        reasoning: "high",
        structuredOutput: true,
        webSearch: false,
        costSensitivity: "medium",
        temperature: 0.4,
        maxOutputTokens: 16384,
    },
    coding: {
        task: "coding",
        reasoning: "high",
        structuredOutput: true,
        webSearch: false,
        costSensitivity: "medium",
        temperature: 0.1,
        maxOutputTokens: 16384,
    },
    reasoning: {
        task: "reasoning",
        reasoning: "high",
        structuredOutput: true,
        webSearch: false,
        costSensitivity: "medium",
        temperature: 0.2,
        maxOutputTokens: 4096,
    },
};
function getModelConfig(capability) {
    return { ...MODEL_ROUTING[capability] };
}
//# sourceMappingURL=model.config.js.map