"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTransientLLMError = isTransientLLMError;
exports.backoffDelay = backoffDelay;
exports.sleep = sleep;
exports.withTimeout = withTimeout;
function isTransientLLMError(message) {
    const lower = (message || "").toLowerCase();
    // JSON/schema parse errors are NOT transient — they need a repair retry, not backoff.
    // For OutputParserException the message is "Failed to parse. Text: ... Error: ...",
    // so the model output text is embedded; check these first to avoid false positives.
    const parseErrorPatterns = [
        "failed to parse",
        "output_parsing_failure",
        "unterminated string",
        "invalid json",
        "invalid enum",
        "json parse",
        "unexpected token",
        "expected property name",
        "not valid json",
        "response_format type is unavailable",
    ];
    if (parseErrorPatterns.some((p) => lower.includes(p))) {
        return false;
    }
    // Specific transient API/network error signatures.
    const patterns = [
        "429",
        "503",
        "rate limit",
        "too many requests",
        "concurrency limit",
        "model is busy",
        "try again later",
        "service unavailable",
        "completion_error",
        "server_error",
        "overloaded",
        "high demand",
        "temporarily unavailable",
    ];
    return patterns.some((p) => lower.includes(p));
}
function backoffDelay(attempt) {
    const base = 5000 * Math.pow(2, Math.min(attempt, 4));
    return Math.min(base, 60000);
}
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
function withTimeout(promise, ms) {
    let timer;
    const timeout = new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error(`LLM call timed out after ${ms}ms`)), ms);
    });
    return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}
//# sourceMappingURL=llmRetry.js.map