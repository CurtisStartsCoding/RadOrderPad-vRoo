"use strict";
/**
 * OpenAI GPT API provider
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.callGPT = callGPT;
const config_1 = __importDefault(require("../../../config/config"));
const types_1 = require("../types");
const logger_1 = __importDefault(require("../../../utils/logger"));
/**
 * Call OpenAI GPT API
 */
async function callGPT(prompt) {
    logger_1.default.info('Calling OpenAI GPT API...');
    const apiKey = config_1.default.llm.openaiApiKey;
    if (!apiKey) {
        throw new Error('OPENAI_API_KEY not set');
    }
    const modelName = config_1.default.llm.gptModelName;
    logger_1.default.info(`Using model: ${modelName}`);
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
                max_tokens: config_1.default.llm.maxTokens
            }),
            signal: AbortSignal.timeout(config_1.default.llm.timeout)
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`OpenAI API error: ${response.status} ${response.statusText} - ${errorText}`);
        }
        const data = await response.json();
        const endTime = Date.now();
        return {
            provider: types_1.LLMProvider.OPENAI,
            model: data.model,
            content: data.choices[0].message.content,
            promptTokens: data.usage.prompt_tokens,
            completionTokens: data.usage.completion_tokens,
            totalTokens: data.usage.total_tokens,
            latencyMs: endTime - startTime
        };
    }
    catch (error) {
        logger_1.default.error('Error calling OpenAI GPT API:', error);
        throw error;
    }
}
//# sourceMappingURL=openai.js.map