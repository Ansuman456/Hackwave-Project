import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
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

  // All agents use Gemini. Only Agent 2 (researcher) additionally uses Tavily.
  const model = new ChatGoogleGenerativeAI({
    apiKey: config.GEMINI_API_KEY,
    model: config.GEMINI_MODEL,
    temperature: modelConfig.temperature,
    maxOutputTokens: modelConfig.maxOutputTokens,
  });

  instances.set(cacheKey, model);
  return model;
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
