/**
 * Grok API provider
 */
import { LLMResponse } from '../types';
/**
 * Call Grok API
 */
export declare function callGrok(prompt: string): Promise<LLMResponse>;
