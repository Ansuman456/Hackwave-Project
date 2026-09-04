import { Component, DataFlowStep, TeamAnalysis, TechStackOption } from "../../graph/state";
export interface ArchitectureGenResult {
    success: boolean;
    architectureOverview?: string;
    components?: Component[];
    dataFlow?: DataFlowStep[];
    error?: string;
    retryCount: number;
}
export declare function generateArchitecture(selectedIdea: any, teamAnalysis: TeamAnalysis, chosenTechStack: TechStackOption, hackathonDuration: number, hackathonConstraints: string): Promise<ArchitectureGenResult>;
//# sourceMappingURL=architectureGenerator.d.ts.map