"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLLM = getLLM;
exports.getLLMWithConfig = getLLMWithConfig;
exports.clearLLMCache = clearLLMCache;
const google_genai_1 = require("@langchain/google-genai");
const openai_1 = require("@langchain/openai");
const env_1 = require("../config/env");
const model_config_1 = require("../config/model.config");
const instances = new Map();
function getLLM(capability) {
    const config = (0, env_1.getConfig)();
    const modelConfig = (0, model_config_1.getModelConfig)(capability);
    const cacheKey = capability;
    if (instances.has(cacheKey)) {
        return instances.get(cacheKey);
    }
    // Agent 2 (researcher) keeps using Gemini. All other agents use DeepSeek.
    const model = capability === "research"
        ? createGeminiModel(config, modelConfig)
        : createDeepSeekModel(config, modelConfig);
    instances.set(cacheKey, model);
    return model;
}
function createGeminiModel(config, modelConfig) {
    return new google_genai_1.ChatGoogleGenerativeAI({
        apiKey: config.GEMINI_API_KEY,
        model: config.GEMINI_MODEL,
        temperature: modelConfig.temperature,
        maxOutputTokens: modelConfig.maxOutputTokens,
        maxRetries: 2,
    });
}
function createDeepSeekModel(config, modelConfig) {
    return new openai_1.ChatOpenAI({
        apiKey: config.DEEPSEEK_API_KEY,
        model: config.DEEPSEEK_MODEL,
        temperature: modelConfig.temperature,
        maxTokens: modelConfig.maxOutputTokens,
        timeout: 60000,
        maxRetries: 3,
        configuration: {
            baseURL: config.DEEPSEEK_BASE_URL,
        },
    });
}
function getLLMWithConfig(capability) {
    const model = getLLM(capability);
    const config = (0, model_config_1.getModelConfig)(capability);
    return { model, config };
}
function clearLLMCache() {
    instances.clear();
}
//# sourceMappingURL=llmFactory.js.map