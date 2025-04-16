/**
 * OpenAI GPT API provider
 */

import config from '../../../config/config';
import { LLMProvider, LLMResponse, OpenAIResponse } from '../types';

/**
 * Call OpenAI GPT API
 */
export async function callGPT(prompt: string): Promise<LLMResponse> {
  console.log('Calling OpenAI GPT API...');
  
  const apiKey = config.llm.openaiApiKey;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY not set');
  }
  
  const modelName = config.llm.gptModelName;
  console.log(`Using model: ${modelName}`);
  
  const startTime = Date.now();
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: modelName,
        messages: [
          { role: 'user', content: prompt }
        ],
        max_tokens: config.llm.maxTokens
      }),
      signal: AbortSignal.timeout(config.llm.timeout)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const data = await response.json() as OpenAIResponse;
    const endTime = Date.now();
    
    return {
      provider: LLMProvider.OPENAI,
      model: data.model,
      content: data.choices[0].message.content,
      promptTokens: data.usage.prompt_tokens,
      completionTokens: data.usage.completion_tokens,
      totalTokens: data.usage.total_tokens,
      latencyMs: endTime - startTime
    };
  } catch (error) {
    console.error('Error calling OpenAI GPT API:', error);
    throw error;
  }
}