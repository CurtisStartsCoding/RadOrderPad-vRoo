/**
 * LLM client with fallback logic
 */
import { LLMResponse } from './types';
/**
 * Call LLM with fallback logic
 * Try Claude 3.7 first, then Grok, then GPT
 */
export declare function callLLMWithFallback(prompt: string): Promise<LLMResponse>;
