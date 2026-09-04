export interface GithubProfileData {
    githubProfileUrl: string;
    username: string;
    role?: string;
    displayName: string;
    bio: string;
    publicRepos: number;
    followers: number;
    topLanguages: string[];
    topRepositories: Array<{
        name: string;
        description: string;
        stars: number;
        language: string;
        topics: string[];
        url: string;
    }>;
    contributionSummary: string;
    skillsFromRepos: string[];
}
export declare function analyzeGithubProfiles(projectId: string, githubLinks: Array<{
    githubProfileUrl: string;
    username: string;
    role?: string;
}>): Promise<GithubProfileData[]>;
//# sourceMappingURL=githubProfileAnalyzer.d.ts.map