import { TeamMemberProfile, RoleAssignment, TeamSkillGap } from "../../graph/state";
export interface RoleMatcherResult {
    success: boolean;
    roleAssignments?: RoleAssignment[];
    skillGaps?: TeamSkillGap[];
    overallTeamStrategy?: string;
    error?: string;
    retryCount: number;
}
export declare function matchRoles(teamProfiles: TeamMemberProfile[], projectRequirements: string, hackathonDuration?: number): Promise<RoleMatcherResult>;
//# sourceMappingURL=roleMatcher.d.ts.map