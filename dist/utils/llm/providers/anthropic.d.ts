/**
 * Anthropic Claude API provider
 */
import { LLMResponse } from '../types';
/**
 * Call Anthropic Claude API
 */
export declare function callClaude(prompt: string): Promise<LLMResponse>;
