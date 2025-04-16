/**
 * LLM client index
 * Re-exports all functionality for backward compatibility
 */
export { LLMProvider, LLMResponse } from './types';
export { callClaude, callGrok, callGPT } from './providers';
export { callLLMWithFallback } from './client';
