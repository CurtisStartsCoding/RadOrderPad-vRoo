"use strict";
/**
 * Grok API provider
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.callGrok = callGrok;
const config_1 = __importDefault(require("../../../config/config"));
const types_1 = require("../types");
/**
 * Call Grok API
 */
async function callGrok(prompt) {
    console.log('Calling Grok API...');
    const apiKey = config_1.default.llm.grokApiKey;
    if (!apiKey) {
        throw new Error('GROK_API_KEY not set');
    }
    const modelName = config_1.default.llm.grokModelName;
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
                max_tokens: config_1.default.llm.maxTokens
            }),
            signal: AbortSignal.timeout(config_1.default.llm.timeout)
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Grok API error: ${response.status} ${response.statusText} - ${errorText}`);
        }
        const data = await response.json();
        const endTime = Date.now();
        return {
            provider: types_1.LLMProvider.GROK,
            model: data.model,
            content: data.choices[0].message.content,
            promptTokens: data.usage.prompt_tokens,
            completionTokens: data.usage.completion_tokens,
            totalTokens: data.usage.total_tokens,
            latencyMs: endTime - startTime
        };
    }
    catch (error) {
        console.error('Error calling Grok API:', error);
        throw error;
    }
}
//# sourceMappingURL=grok.js.map