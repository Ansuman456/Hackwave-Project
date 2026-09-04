import { TeamMemberProfile, TechStackOption, ProjectCapabilityRequirements } from "../../graph/state";
export interface TechStackResult {
    success: boolean;
    techStackOptions?: TechStackOption[];
    error?: string;
    retryCount: number;
}
export declare function generateTechStacks(expandedSolution: string, teamProfiles: TeamMemberProfile[], feasibilitySummary: string, projectRequirements: ProjectCapabilityRequirements, hackathonDuration?: number, forbiddenTech?: string[]): Promise<TechStackResult>;
//# sourceMappingURL=techStackGenerator.d.ts.map