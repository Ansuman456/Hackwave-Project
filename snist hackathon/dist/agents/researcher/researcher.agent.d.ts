import { HackathonState, ResearchResult, DiscoveredSolution } from "../../graph/state";
import { ResearchMode } from "../../config/research.config";
export interface ResearcherResult {
    success: boolean;
    research?: ResearchResult;
    error?: string;
}
export declare function runResearcher(state: HackathonState, mode?: ResearchMode): Promise<ResearcherResult>;
export declare function ensureCompleteSolutionFields(sol: DiscoveredSolution, candidate: any): DiscoveredSolution;
export declare function validateSolutionQuality(sol: DiscoveredSolution): boolean;
//# sourceMappingURL=researcher.agent.d.ts.map