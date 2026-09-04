export type ModelCapability =
  | "strategic_analysis"
  | "research"
  | "innovation"
  | "coding"
  | "reasoning";

export interface ModelConfig {
  task: string;
  reasoning: "low" | "medium" | "high";
  structuredOutput: boolean;
  webSearch: boolean;
  costSensitivity: "low" | "medium" | "high";
  temperature: number;
  maxOutputTokens: number;
}

const MODEL_ROUTING: Record<ModelCapability, ModelConfig> = {
  strategic_analysis: {
    task: "strategic_analysis",
    reasoning: "medium",
    structuredOutput: true,
    webSearch: false,
    costSensitivity: "high",
    temperature: 0.3,
    maxOutputTokens: 8192,
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
    maxOutputTokens: 6144,
  },
  coding: {
    task: "coding",
    reasoning: "high",
    structuredOutput: true,
    webSearch: false,
    costSensitivity: "medium",
    temperature: 0.1,
    maxOutputTokens: 8192,
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

export function getModelConfig(capability: ModelCapability): ModelConfig {
  return { ...MODEL_ROUTING[capability] };
}
