import { ProblemAnalysis, ResearchResult, InnovationResult, TeamAnalysis } from "../../graph/state";
export interface TeamArchitectResult {
    success: boolean;
    teamAnalysis?: TeamAnalysis;
    error?: string;
}
export declare function runTeamArchitect(projectId: string, problemAnalysis: ProblemAnalysis, research: ResearchResult, innovation: InnovationResult, resumes: string[]): Promise<TeamArchitectResult>;
//# sourceMappingURL=team.agent.d.ts.map