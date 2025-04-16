"use strict";
/**
 * LLM client with fallback logic
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.callLLMWithFallback = callLLMWithFallback;
const providers_1 = require("./providers");
/**
 * Call LLM with fallback logic
 * Try Claude 3.7 first, then Grok, then GPT
 */
async function callLLMWithFallback(prompt) {
    // Try Claude first
    try {
        return await (0, providers_1.callClaude)(prompt);
    }
    catch (error) {
        console.log('Claude API call failed, falling back to Grok...');
        // Try Grok next
        try {
            return await (0, providers_1.callGrok)(prompt);
        }
        catch (error) {
            console.log('Grok API call failed, falling back to GPT...');
            // Try GPT as last resort
            try {
                return await (0, providers_1.callGPT)(prompt);
            }
            catch (error) {
                console.error('All LLM API calls failed');
                throw new Error('ValidationServiceUnavailable: All LLM providers failed');
            }
        }
    }
}
//# sourceMappingURL=client.js.map