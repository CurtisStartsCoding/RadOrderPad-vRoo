/**
 * LLM client with fallback logic
 */
import { callClaude, callGrok, callGPT } from './providers';
/**
 * Call LLM with fallback logic
 * Try Claude 3.7 first, then Grok, then GPT
 */
export async function callLLMWithFallback(prompt) {
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
//# sourceMappingURL=client.js.map