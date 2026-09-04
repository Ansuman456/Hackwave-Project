import { Source } from "../graph/state";
interface CandidateEntity {
    id: string;
    name: string;
    canonicalDomain: string;
    urls: string[];
    sourceIds: string[];
    sources: Source[];
    relationToProblem: "direct" | "adjacent" | "technical";
    relevanceScore: number;
}
export declare function deduplicateSources(sources: Source[]): Source[];
export declare function buildCandidateEntities(sources: Source[]): CandidateEntity[];
export {};
//# sourceMappingURL=solutionDeduplicator.d.ts.map