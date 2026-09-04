import { Source } from "../graph/state";
export interface DualSearchResult {
    queryId: string;
    query: string;
    geminiResults: Array<{
        title: string;
        url: string;
        snippet: string;
        domain: string;
    }>;
    tavilyResults: Array<{
        title: string;
        url: string;
        snippet: string;
        content?: string;
        domain: string;
        score?: number;
    }>;
    mergedSources: Source[];
    geminiFailed: boolean;
    tavilyFailed: boolean;
}
export declare function executeDualSearch(query: string, sourceType?: Source["sourceType"], projectId?: string): Promise<DualSearchResult>;
export interface DeepExtractionResult {
    sources: Source[];
}
export declare function executeDeepExtraction(queryOrUrl: string, providers: {
    gemini: boolean;
    tavily: boolean;
    github: boolean;
}): Promise<DeepExtractionResult>;
//# sourceMappingURL=webResearchService.d.ts.map