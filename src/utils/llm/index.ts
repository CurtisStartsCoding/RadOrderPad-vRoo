/**
 * LLM client index
 * Re-exports all functionality for backward compatibility
 */

// Re-export types
export { LLMProvider, LLMResponse } from './types';

// Re-export provider functions
export { callClaude, callGrok, callGPT } from './providers';

// Re-export client function
export { callLLMWithFallback } from './client';