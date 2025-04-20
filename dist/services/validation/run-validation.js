"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runValidation = runValidation;
const text_processing_1 = require("../../utils/text-processing");
const llm_1 = require("../../utils/llm");
const database_1 = require("../../utils/database");
const response_1 = require("../../utils/response");
const logging_1 = require("./logging");
/**
 * Run validation on the provided text and context
 */
async function runValidation(text, context = {}, options = {}) {
    try {
        console.log('Starting validation process...');
        // 1. Strip PHI from the text
        const sanitizedText = (0, text_processing_1.stripPHI)(text);
        console.log('PHI stripped from text');
        // 2. Extract medical keywords for context generation
        const keywords = (0, text_processing_1.extractMedicalKeywords)(sanitizedText);
        console.log('Extracted keywords:', keywords);
        // 3. Get the active default prompt template
        const promptTemplate = await (0, database_1.getActivePromptTemplate)();
        console.log('Using prompt template:', promptTemplate.name);
        // 4. Generate database context based on keywords using RedisSearch
        const databaseContext = await (0, database_1.generateDatabaseContextWithRedis)(keywords);
        console.log('Generated database context using RedisSearch');
        // 5. Construct the prompt with hard-coded word limit of 33
        console.log('Using hard-coded word count: 33');
        const prompt = (0, database_1.constructPrompt)(promptTemplate.content_template, sanitizedText, databaseContext, 33, // Hard-coded to 33 words
        context.isOverrideValidation || false);
        console.log('Constructed prompt');
        // 7. Call LLM with fallback logic
        const llmResponse = await (0, llm_1.callLLMWithFallback)(prompt);
        console.log(`LLM call successful using ${llmResponse.provider} (${llmResponse.model})`);
        console.log(`Tokens used: ${llmResponse.totalTokens}, Latency: ${llmResponse.latencyMs}ms`);
        // 8. Process the LLM response
        const validationResult = (0, response_1.processLLMResponse)(llmResponse.content);
        console.log('Processed LLM response');
        // 9. Log the validation attempt to the PHI database (skip if in test mode)
        if (!options.testMode) {
            await (0, logging_1.logValidationAttempt)(text, validationResult, llmResponse, context.orderId, context.userId || 1 // Default to user ID 1 if not provided
            );
            console.log('Logged validation attempt to PHI database');
        }
        else {
            console.log('Test mode: Skipping validation attempt logging');
        }
        // 10. Return the validation result
        return validationResult;
    }
    catch (error) {
        console.error('Error in validation process:', error);
        throw error;
    }
}
//# sourceMappingURL=run-validation.js.map