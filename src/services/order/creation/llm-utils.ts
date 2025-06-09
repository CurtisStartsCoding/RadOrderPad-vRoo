/**
 * LLM Utilities for Order Creation
 *
 * This module provides utilities for working with LLM responses
 * in the context of order creation.
 */

import { LLMProvider, LLMResponse } from '../../../utils/llm/types';

/**
 * Create a simplified LLM response for order finalization
 * @returns Simplified LLM response
 */

/**
 * Create a simplified LLM response for order finalization
 * @returns Simplified LLM response
 */
export function createFinalizationLLMResponse(): LLMResponse {
  return {
    provider: LLMProvider.ANTHROPIC, // Using a valid provider from the enum
    model: 'order-finalization',
    promptTokens: 0,
    completionTokens: 0,
    totalTokens: 0,
    latencyMs: 0,
    content: 'Order finalization'
  };
}