import { TeamMemberProfile } from "../../graph/state";
export interface ResumeParserResult {
    success: boolean;
    members?: TeamMemberProfile[];
    error?: string;
    retryCount: number;
}
export declare function parseResumes(resumes: string[]): Promise<ResumeParserResult>;
//# sourceMappingURL=resumeParser.d.ts.map