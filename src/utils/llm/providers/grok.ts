/**
 * Grok API provider
 */

import config from '../../../config/config';
import { LLMProvider, LLMResponse, GrokResponse } from '../types';

/**
 * Call Grok API
 */
export async function callGrok(prompt: string): Promise<LLMResponse> {
  console.log('Calling Grok API...');
  
  const apiKey = config.llm.grokApiKey;
  if (!apiKey) {
    throw new Error('GROK_API_KEY not set');
  }
  
  const modelName = config.llm.grokModelName;
  console.log(`Using model: ${modelName}`);
  
  const startTime = Date.now();
  
  try {
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
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
      throw new Error(`Grok API error: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const data = await response.json() as GrokResponse;
    const endTime = Date.now();
    
    return {
      provider: LLMProvider.GROK,
      model: data.model,
      content: data.choices[0].message.content,
      promptTokens: data.usage.prompt_tokens,
      completionTokens: data.usage.completion_tokens,
      totalTokens: data.usage.total_tokens,
      latencyMs: endTime - startTime
    };
  } catch (error) {
    console.error('Error calling Grok API:', error);
    throw error;
  }
}