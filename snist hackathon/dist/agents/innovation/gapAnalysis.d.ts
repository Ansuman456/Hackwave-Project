import { DiscoveredSolution, FeatureLandscape, InnovationGap } from "../../graph/state";
export declare function buildFeatureLandscape(solutions: DiscoveredSolution[]): FeatureLandscape[];
export declare function identifyGaps(featureLandscape: FeatureLandscape[], solutions: DiscoveredSolution[], domainKeywords: string[]): InnovationGap[];
export declare function calculateFeatureFrequency(landscape: FeatureLandscape[]): {
    common: string[];
    moderate: string[];
    rare: string[];
};
//# sourceMappingURL=gapAnalysis.d.ts.map