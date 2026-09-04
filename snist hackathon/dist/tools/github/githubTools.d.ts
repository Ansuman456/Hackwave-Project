import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
export declare const githubSearchRepositoriesTool: DynamicStructuredTool<z.ZodObject<{
    query: z.ZodString;
    perPage: z.ZodDefault<z.ZodNumber>;
    page: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    query: string;
    perPage: number;
    page: number;
}, {
    query: string;
    perPage?: number | undefined;
    page?: number | undefined;
}>, {
    query: string;
    perPage: number;
    page: number;
}, {
    query: string;
    perPage?: number | undefined;
    page?: number | undefined;
}, string, unknown, "github_search_repositories">;
export declare const githubGetRepositoryTool: DynamicStructuredTool<z.ZodObject<{
    owner: z.ZodString;
    repo: z.ZodString;
}, "strip", z.ZodTypeAny, {
    owner: string;
    repo: string;
}, {
    owner: string;
    repo: string;
}>, {
    owner: string;
    repo: string;
}, {
    owner: string;
    repo: string;
}, string, unknown, "github_get_repository">;
export declare const githubGetReadmeTool: DynamicStructuredTool<z.ZodObject<{
    owner: z.ZodString;
    repo: z.ZodString;
}, "strip", z.ZodTypeAny, {
    owner: string;
    repo: string;
}, {
    owner: string;
    repo: string;
}>, {
    owner: string;
    repo: string;
}, {
    owner: string;
    repo: string;
}, string, unknown, "github_get_readme">;
export declare const githubGetContentsTool: DynamicStructuredTool<z.ZodObject<{
    owner: z.ZodString;
    repo: z.ZodString;
    path: z.ZodString;
}, "strip", z.ZodTypeAny, {
    path: string;
    owner: string;
    repo: string;
}, {
    path: string;
    owner: string;
    repo: string;
}>, {
    path: string;
    owner: string;
    repo: string;
}, {
    path: string;
    owner: string;
    repo: string;
}, string, unknown, "github_get_contents">;
//# sourceMappingURL=githubTools.d.ts.map