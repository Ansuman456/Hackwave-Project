import { AiArchitecture, RagArchitecture } from "../../graph/state";
export interface AiRagResult {
    success: boolean;
    aiArchitecture?: AiArchitecture;
    ragArchitecture?: RagArchitecture;
    error?: string;
    retryCount: number;
}
export declare function generateAiRagArchitecture(architectureOverview: string, components: any[], selectedIdea: any, teamCapabilities: string): Promise<AiRagResult>;
//# sourceMappingURL=aiRagArchitect.d.ts.map