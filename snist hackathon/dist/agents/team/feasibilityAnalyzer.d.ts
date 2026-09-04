import { TeamMemberProfile, CandidateIdea, ProjectCapabilityRequirements } from "../../graph/state";
export interface FeasibilityResult {
    success: boolean;
    expandedSolution?: {
        name: string;
        description: string;
        problemSolved: string;
        targetUsers: string[];
        keyFeatures: string[];
        workflow: string[];
        requiredCapabilities: string[];
        technicalCapabilities: string[];
        complexityAreas: string[];
    };
    dataAvailability?: Array<{
        dataType: string;
        available: boolean;
        source?: string;
        acquisitionStrategy?: string;
    }>;
    feasibility?: {
        score: number;
        summary: string;
        teamStrengths: string[];
        teamWeaknesses: string[];
        timeRisk: "low" | "medium" | "high";
        technicalRisk: "low" | "medium" | "high";
        dataRisk: "low" | "medium" | "high";
        recommendations: string[];
    };
    error?: string;
    retryCount: number;
}
export declare function analyzeFeasibility(selectedIdea: CandidateIdea, teamProfiles: TeamMemberProfile[], projectRequirements: ProjectCapabilityRequirements, hackathonDuration?: number, judgingCriteria?: string): Promise<FeasibilityResult>;
//# sourceMappingURL=feasibilityAnalyzer.d.ts.map