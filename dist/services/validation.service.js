"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationService = void 0;
const text_processing_1 = require("../utils/text-processing");
const llm_1 = require("../utils/llm");
const database_1 = require("../utils/database");
const response_1 = require("../utils/response");
const db_1 = require("../config/db");
/**
 * Service for handling validation-related operations
 */
class ValidationService {
    /**
     * Run validation on the provided text and context
     */
    static async runValidation(text, context = {}, testMode = false) {
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
            // 4. Generate database context based on keywords
            const databaseContext = await (0, database_1.generateDatabaseContext)(keywords);
            console.log('Generated database context');
            // 5. Construct the prompt
            const prompt = (0, database_1.constructPrompt)(promptTemplate.content_template, sanitizedText, databaseContext, promptTemplate.word_limit, context.isOverrideValidation || false);
            console.log('Constructed prompt');
            // 6. Call LLM with fallback logic
            const llmResponse = await (0, llm_1.callLLMWithFallback)(prompt);
            console.log(`LLM call successful using ${llmResponse.provider} (${llmResponse.model})`);
            console.log(`Tokens used: ${llmResponse.totalTokens}, Latency: ${llmResponse.latencyMs}ms`);
            // 7. Process the LLM response
            const validationResult = (0, response_1.processLLMResponse)(llmResponse.content);
            console.log('Processed LLM response');
            // 8. Log the validation attempt to the PHI database (skip if in test mode)
            if (!testMode) {
                await this.logValidationAttempt(text, validationResult, llmResponse, context.orderId, context.userId || 1 // Default to user ID 1 if not provided
                );
                console.log('Logged validation attempt to PHI database');
            }
            else {
                console.log('Test mode: Skipping validation attempt logging');
            }
            // 9. Return the validation result
            return validationResult;
        }
        catch (error) {
            console.error('Error in validation process:', error);
            throw error;
        }
    }
    /**
     * Log validation attempt to the PHI database
     */
    static async logValidationAttempt(originalText, validationResult, llmResponse, orderId, userId = 1) {
        try {
            // Get the next attempt number for this order
            let attemptNumber = 1;
            if (orderId) {
                const attemptResult = await (0, db_1.queryPhiDb)(`SELECT MAX(attempt_number) as max_attempt FROM validation_attempts WHERE order_id = $1`, [orderId]);
                if (attemptResult.rows[0].max_attempt) {
                    attemptNumber = attemptResult.rows[0].max_attempt + 1;
                }
            }
            // Format ICD-10 and CPT codes for storage
            const icd10Codes = JSON.stringify(validationResult.suggestedICD10Codes.map(code => code.code));
            const cptCodes = JSON.stringify(validationResult.suggestedCPTCodes.map(code => code.code));
            // Insert validation attempt record
            await (0, db_1.queryPhiDb)(`INSERT INTO validation_attempts (
          order_id,
          attempt_number,
          validation_input_text,
          validation_outcome,
          generated_icd10_codes,
          generated_cpt_codes,
          generated_feedback_text,
          generated_compliance_score,
          user_id,
          created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())`, [
                orderId || null,
                attemptNumber,
                originalText,
                validationResult.validationStatus,
                icd10Codes,
                cptCodes,
                validationResult.feedback,
                validationResult.complianceScore,
                userId
            ]);
            // Check if llm_validation_logs table exists
            try {
                // Log LLM usage details
                await (0, db_1.queryPhiDb)(`INSERT INTO llm_validation_logs (
            provider,
            model,
            prompt_tokens,
            completion_tokens,
            total_tokens,
            latency_ms,
            created_at
          ) VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING id`, [
                    llmResponse.provider,
                    llmResponse.model,
                    llmResponse.promptTokens || 0,
                    llmResponse.completionTokens || 0,
                    llmResponse.totalTokens || 0,
                    llmResponse.latencyMs
                ]);
            }
            catch (error) {
                // If the table doesn't exist, log the error but don't fail the validation
                const err = error;
                if (err.message && err.message.includes('relation "llm_validation_logs" does not exist')) {
                    console.log('llm_validation_logs table does not exist. Skipping LLM usage logging.');
                    // Create the table if it doesn't exist
                    try {
                        await (0, db_1.queryPhiDb)(`
              CREATE TABLE IF NOT EXISTS llm_validation_logs (
                id SERIAL PRIMARY KEY,
                provider VARCHAR(50) NOT NULL,
                model VARCHAR(100) NOT NULL,
                prompt_tokens INTEGER,
                completion_tokens INTEGER,
                total_tokens INTEGER,
                latency_ms INTEGER,
                created_at TIMESTAMP NOT NULL DEFAULT NOW()
              )
            `);
                        console.log('Created llm_validation_logs table');
                    }
                    catch (createError) {
                        console.error('Error creating llm_validation_logs table:', createError);
                    }
                }
                else {
                    console.error('Error logging LLM usage:', error);
                }
            }
        }
        catch (error) {
            console.error('Error logging validation attempt:', error);
            // Don't throw the error, just log it
            // We don't want to fail the validation process if logging fails
        }
    }
}
exports.ValidationService = ValidationService;
exports.default = ValidationService;
//# sourceMappingURL=validation.service.js.map