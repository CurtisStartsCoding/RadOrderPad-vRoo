/**
 * LLM client with fallback logic
 */

import { LLMResponse } from './types';
import { callClaude, callGrok, callGPT } from './providers';
import logger from '../../utils/logger';

/**
 * Call LLM with fallback logic
 * Try Claude 3.7 first, then Grok, then GPT
 */
export async function callLLMWithFallback(prompt: string): Promise<LLMResponse> {
  // Try Claude first
  try {
    return await callClaude(prompt);
  } catch (error) {
    logger.warn('Claude API call failed, falling back to Grok...', { error });
    
    // Try Grok next
    try {
      return await callGrok(prompt);
    } catch (error) {
      logger.warn('Grok API call failed, falling back to GPT...', { error });
      
      // Try GPT as last resort
      try {
        return await callGPT(prompt);
      } catch (error) {
        logger.error('All LLM API calls failed', { error });
        throw new Error('ValidationServiceUnavailable: All LLM providers failed');
      }
    }
  }
}