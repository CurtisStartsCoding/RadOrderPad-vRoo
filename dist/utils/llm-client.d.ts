/**
 * Utility functions for LLM API calls
 */
/**
 * LLM Provider enum
 */
export declare enum LLMProvider {
    ANTHROPIC = "anthropic",
    GROK = "grok",
    OPENAI = "openai"
}
/**
 * LLM Response interface
 */
export interface LLMResponse {
    provider: LLMProvider;
    model: string;
    content: string;
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
    latencyMs: number;
}
/**
 * Call LLM with fallback logic
 * Try Claude 3.7 first, then Grok, then GPT
 */
export declare function callLLMWithFallback(prompt: string): Promise<LLMResponse>;
