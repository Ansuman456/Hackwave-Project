import { TeamAnalysis, ArchitectureResult } from "../../graph/state";
export interface CTOResult {
    success: boolean;
    architecture?: ArchitectureResult;
    error?: string;
}
export declare function runCTO(projectId: string, selectedIdea: any, teamAnalysis: TeamAnalysis, hackathonParams?: {
    durationHours?: number;
    rules?: string[];
    restrictions?: string[];
}, githubLinks?: Array<{
    githubProfileUrl: string;
    username: string;
    role?: string;
}>): Promise<CTOResult>;
//# sourceMappingURL=cto.agent.d.ts.map