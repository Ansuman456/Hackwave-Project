import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOpenAI } from "@langchain/openai";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { getConfig } from "../config/env";
import { getModelConfig, ModelCapability, ModelConfig } from "../config/model.config";

export interface LLMInstance {
  model: BaseChatModel;
  config: ModelConfig;
}

const instances = new Map<string, BaseChatModel>();

export function getLLM(capability: ModelCapability): BaseChatModel {
  const config = getConfig();
  const modelConfig = getModelConfig(capability);

  const cacheKey = capability;

  if (instances.has(cacheKey)) {
    return instances.get(cacheKey)!;
  }

  // Agent 2 (researcher) keeps using Gemini. All other agents use DeepSeek.
  const model = capability === "research"
    ? createGeminiModel(config, modelConfig)
    : createDeepSeekModel(config, modelConfig);

  instances.set(cacheKey, model);
  return model;
}

function createGeminiModel(
  config: ReturnType<typeof getConfig>,
  modelConfig: ModelConfig
): BaseChatModel {
  return new ChatGoogleGenerativeAI({
    apiKey: config.GEMINI_API_KEY,
    model: config.GEMINI_MODEL,
    temperature: modelConfig.temperature,
    maxOutputTokens: modelConfig.maxOutputTokens,
    maxRetries: 2,
  });
}

function createDeepSeekModel(
  config: ReturnType<typeof getConfig>,
  modelConfig: ModelConfig
): BaseChatModel {
  return new ChatOpenAI({
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

export function getLLMWithConfig(
  capability: ModelCapability
): LLMInstance {
  const model = getLLM(capability);
  const config = getModelConfig(capability);
  return { model, config };
}

export function clearLLMCache(): void {
  instances.clear();
}
