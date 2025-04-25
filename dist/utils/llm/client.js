"use strict";
/**
 * LLM client with fallback logic
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.callLLMWithFallback = callLLMWithFallback;
const providers_1 = require("./providers");
const logger_1 = __importDefault(require("../../utils/logger"));
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
        logger_1.default.warn('Claude API call failed, falling back to Grok...', { error });
        // Try Grok next
        try {
            return await (0, providers_1.callGrok)(prompt);
        }
        catch (error) {
            logger_1.default.warn('Grok API call failed, falling back to GPT...', { error });
            // Try GPT as last resort
            try {
                return await (0, providers_1.callGPT)(prompt);
            }
            catch (error) {
                logger_1.default.error('All LLM API calls failed', { error });
                throw new Error('ValidationServiceUnavailable: All LLM providers failed');
            }
        }
    }
}
//# sourceMappingURL=client.js.map