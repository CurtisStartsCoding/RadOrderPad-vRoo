/**
 * Anthropic Claude API provider
 */
import config from '../../../config/config';
import { LLMProvider } from '../types';
/**
 * Call Anthropic Claude API
 */
export async function callClaude(prompt) {
    console.log('Calling Anthropic Claude API...');
    const apiKey = config.llm.anthropicApiKey;
    if (!apiKey) {
        throw new Error('ANTHROPIC_API_KEY not set');
    }
    const modelName = config.llm.claudeModelName;
    console.log(`Using model: ${modelName}`);
    const startTime = Date.now();
    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: modelName,
                max_tokens: config.llm.maxTokens,
                messages: [
                    { role: 'user', content: prompt }
                ]
            }),
            signal: AbortSignal.timeout(config.llm.timeout)
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Anthropic API error: ${response.status} ${response.statusText} - ${errorText}`);
        }
        const data = await response.json();
        const endTime = Date.now();
        return {
            provider: LLMProvider.ANTHROPIC,
            model: data.model,
            content: data.content[0].text,
            promptTokens: data.usage.input_tokens,
            completionTokens: data.usage.output_tokens,
            totalTokens: data.usage.input_tokens + data.usage.output_tokens,
            latencyMs: endTime - startTime
        };
    }
    catch (error) {
        console.error('Error calling Anthropic Claude API:', error);
        throw error;
    }
}
//# sourceMappingURL=anthropic.js.map