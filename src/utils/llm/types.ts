/**
 * LLM types and interfaces
 */

/**
 * LLM Provider enum
 */
export enum LLMProvider {
  ANTHROPIC = 'anthropic',
  GROK = 'grok',
  OPENAI = 'openai'
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
 * Anthropic API response interfaces
 */
export interface AnthropicResponse {
  id: string;
  type: string;
  model: string;
  role: string;
  content: Array<{
    type: string;
    text: string;
  }>;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

/**
 * Grok API response interfaces
 */
export interface GrokResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * OpenAI API response interfaces
 */
export interface OpenAIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}