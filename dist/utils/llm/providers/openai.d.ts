/**
 * OpenAI GPT API provider
 */
import { LLMResponse } from '../types';
/**
 * Call OpenAI GPT API
 */
export declare function callGPT(prompt: string): Promise<LLMResponse>;
