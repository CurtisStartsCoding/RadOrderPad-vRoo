"use strict";
/**
 * Anthropic Claude API provider
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.callClaude = callClaude;
const config_1 = __importDefault(require("../../../config/config"));
const types_1 = require("../types");
const logger_1 = __importDefault(require("../../../utils/logger"));
/**
 * Call Anthropic Claude API
 */
async function callClaude(prompt) {
    logger_1.default.info('Calling Anthropic Claude API...');
    const apiKey = config_1.default.llm.anthropicApiKey;
    if (!apiKey) {
        throw new Error('ANTHROPIC_API_KEY not set');
    }
    const modelName = config_1.default.llm.claudeModelName;
    logger_1.default.info(`Using model: ${modelName}`);
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
                max_tokens: config_1.default.llm.maxTokens,
                messages: [
                    { role: 'user', content: prompt }
                ]
            }),
            signal: AbortSignal.timeout(config_1.default.llm.timeout)
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Anthropic API error: ${response.status} ${response.statusText} - ${errorText}`);
        }
        const data = await response.json();
        const endTime = Date.now();
        return {
            provider: types_1.LLMProvider.ANTHROPIC,
            model: data.model,
            content: data.content[0].text,
            promptTokens: data.usage.input_tokens,
            completionTokens: data.usage.output_tokens,
            totalTokens: data.usage.input_tokens + data.usage.output_tokens,
            latencyMs: endTime - startTime
        };
    }
    catch (error) {
        logger_1.default.error('Error calling Anthropic Claude API:', error);
        throw error;
    }
}
//# sourceMappingURL=anthropic.js.map