export function isTransientLLMError(message: string): boolean {
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

export function backoffDelay(attempt: number): number {
  const base = 5000 * Math.pow(2, Math.min(attempt, 4));
  return Math.min(base, 60000);
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timer: NodeJS.Timeout;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(
      () => reject(new Error(`LLM call timed out after ${ms}ms`)),
      ms
    );
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer!)) as Promise<T>;
}
