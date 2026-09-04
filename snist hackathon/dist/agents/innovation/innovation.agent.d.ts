import { ProblemAnalysis, ResearchResult, InnovationResult } from "../../graph/state";
export interface InnovationResult_Old {
    success: boolean;
    innovation?: InnovationResult;
    error?: string;
}
export declare function runInnovation(projectId: string, problemAnalysis: ProblemAnalysis, research: ResearchResult): Promise<InnovationResult_Old>;
//# sourceMappingURL=innovation.agent.d.ts.map