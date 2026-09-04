import { DatabaseModel, ApiContract } from "../../graph/state";
export interface SchemaContractResult {
    success: boolean;
    databaseSchema?: DatabaseModel[];
    apiContracts?: ApiContract[];
    error?: string;
    retryCount: number;
}
export declare function generateSchemaAndContracts(architectureOverview: string, components: any[], dataFlow: any[], selectedIdea: any): Promise<SchemaContractResult>;
//# sourceMappingURL=schemaContractGenerator.d.ts.map