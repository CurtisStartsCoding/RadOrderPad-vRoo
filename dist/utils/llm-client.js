"use strict";
/**
 * Utility functions for LLM API calls
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LLMProvider = void 0;
exports.callLLMWithFallback = callLLMWithFallback;
const config_1 = __importDefault(require("../config/config"));
/**
 * LLM Provider enum
 */
var LLMProvider;
(function (LLMProvider) {
    LLMProvider["ANTHROPIC"] = "anthropic";
    LLMProvider["GROK"] = "grok";
    LLMProvider["OPENAI"] = "openai";
})(LLMProvider || (exports.LLMProvider = LLMProvider = {}));
/**
 * Call Anthropic Claude API
 */
async function callClaude(prompt) {
    console.log('Calling Anthropic Claude API...');
    const apiKey = config_1.default.llm.anthropicApiKey;
    if (!apiKey) {
        throw new Error('ANTHROPIC_API_KEY not set');
    }
    const modelName = config_1.default.llm.claudeModelName;
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
            provider: LLMProvider.GROK,
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
/**
 * Call OpenAI GPT API
 */
async function callGPT(prompt) {
    console.log('Calling OpenAI GPT API...');
    const apiKey = config_1.default.llm.openaiApiKey;
    if (!apiKey) {
        throw new Error('OPENAI_API_KEY not set');
    }
    const modelName = config_1.default.llm.gptModelName;
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
            provider: LLMProvider.OPENAI,
            model: data.model,
            content: data.choices[0].message.content,
            promptTokens: data.usage.prompt_tokens,
            completionTokens: data.usage.completion_tokens,
            totalTokens: data.usage.total_tokens,
            latencyMs: endTime - startTime
        };
    }
    catch (error) {
        console.error('Error calling OpenAI GPT API:', error);
        throw error;
    }
}
/**
 * Call LLM with fallback logic
 * Try Claude 3.7 first, then Grok, then GPT
 */
async function callLLMWithFallback(prompt) {
    // Try Claude first
    try {
        return await callClaude(prompt);
    }
    catch (error) {
        console.log('Claude API call failed, falling back to Grok...');
        // Try Grok next
        try {
            return await callGrok(prompt);
        }
        catch (error) {
            console.log('Grok API call failed, falling back to GPT...');
            // Try GPT as last resort
            try {
                return await callGPT(prompt);
            }
            catch (error) {
                console.error('All LLM API calls failed');
                throw new Error('ValidationServiceUnavailable: All LLM providers failed');
            }
        }
    }
}
//# sourceMappingURL=llm-client.js.map