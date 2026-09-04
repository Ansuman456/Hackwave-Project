import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { ModelCapability, ModelConfig } from "../config/model.config";
export interface LLMInstance {
    model: BaseChatModel;
    config: ModelConfig;
}
export declare function getLLM(capability: ModelCapability): BaseChatModel;
export declare function getLLMWithConfig(capability: ModelCapability): LLMInstance;
export declare function clearLLMCache(): void;
//# sourceMappingURL=llmFactory.d.ts.map