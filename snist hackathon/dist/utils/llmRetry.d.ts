export declare function isTransientLLMError(message: string): boolean;
export declare function backoffDelay(attempt: number): number;
export declare function sleep(ms: number): Promise<void>;
export declare function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T>;
//# sourceMappingURL=llmRetry.d.ts.map