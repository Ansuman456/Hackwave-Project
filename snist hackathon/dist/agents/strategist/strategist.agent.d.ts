import { ProblemAnalysis } from "../../graph/state";
import { ValidationResult } from "./strategist.validator";
import { StrategistInput } from "../../graph/state";
export interface StrategistResult {
    success: boolean;
    analysis?: ProblemAnalysis;
    validation?: ValidationResult;
    retryCount: number;
    error?: string;
}
export declare function runStrategist(input: StrategistInput): Promise<StrategistResult>;
export { StrategistInput };
//# sourceMappingURL=strategist.agent.d.ts.map