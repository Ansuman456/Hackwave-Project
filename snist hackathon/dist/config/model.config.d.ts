export type ModelCapability = "strategic_analysis" | "research" | "innovation" | "coding" | "reasoning";
export interface ModelConfig {
    task: string;
    reasoning: "low" | "medium" | "high";
    structuredOutput: boolean;
    webSearch: boolean;
    costSensitivity: "low" | "medium" | "high";
    temperature: number;
    maxOutputTokens: number;
}
export declare function getModelConfig(capability: ModelCapability): ModelConfig;
//# sourceMappingURL=model.config.d.ts.map