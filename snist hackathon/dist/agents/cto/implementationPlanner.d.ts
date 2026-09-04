import { ImplementationPhase, TechnicalRisk } from "../../graph/state";
export interface ImplementationPlanResult {
    success: boolean;
    implementationPlan?: ImplementationPhase[];
    hackathonTimeline?: {
        totalHours: number;
        phases: Array<{
            phase: number;
            name: string;
            hours: number;
            startHour: number;
        }>;
    };
    risks?: TechnicalRisk[];
    error?: string;
    retryCount: number;
}
export declare function generateImplementationPlan(architectureOverview: string, components: any[], dataFlow: any[], teamRoles: string, hackathonDuration: number, hackathonConstraints: string): Promise<ImplementationPlanResult>;
//# sourceMappingURL=implementationPlanner.d.ts.map