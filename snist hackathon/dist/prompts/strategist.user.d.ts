export declare function buildStrategistUserPrompt(input: {
    problemStatement: string;
    hackathon?: {
        name?: string;
        description?: string;
        durationHours?: number;
        judgingCriteria?: Array<{
            name: string;
            weight?: number;
            description?: string;
        }>;
        rules?: string[];
        restrictions?: string[];
        allowedTechnologies?: string[];
        forbiddenTechnologies?: string[];
    };
    userConstraints?: string[];
    teamSize?: number;
}): string;
//# sourceMappingURL=strategist.user.d.ts.map