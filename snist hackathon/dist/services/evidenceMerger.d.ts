import { DiscoveredSolution, Source } from "../graph/state";
export declare function mergeSolutionEvidence(existing: DiscoveredSolution | null, newEvidence: Partial<DiscoveredSolution>, sourceIds: string[]): DiscoveredSolution;
export declare function mergeSearchResults(geminiResults: Array<{
    title: string;
    url: string;
    snippet: string;
    domain: string;
}>, tavilyResults: Array<{
    title: string;
    url: string;
    snippet: string;
    content?: string;
    domain: string;
    score?: number;
}>, queryId: string, sourceType: Source["sourceType"]): Source[];
//# sourceMappingURL=evidenceMerger.d.ts.map