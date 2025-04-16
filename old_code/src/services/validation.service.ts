import { ValidationResult, ValidationStatus } from '../models';
import { stripPHI, extractMedicalKeywords } from '../utils/text-processing';
import { callLLMWithFallback, LLMResponse } from '../utils/llm';
import {
  getActivePromptTemplate,
  generateDatabaseContext,
  constructPrompt
} from '../utils/database';
import { processLLMResponse } from '../utils/response';
import { queryPhiDb } from '../config/db';

/**
 * Service for handling validation-related operations
 */
export class ValidationService {
  /**
   * Run validation on the provided text and context
   */
  static async runValidation(text: string, context: any = {}, testMode: boolean = false): Promise<ValidationResult> {
    try {
      console.log('Starting validation process...');
      
      // 1. Strip PHI from the text
      const sanitizedText = stripPHI(text);
      console.log('PHI stripped from text');
      
      // 2. Extract medical keywords for context generation
      const keywords = extractMedicalKeywords(sanitizedText);
      console.log('Extracted keywords:', keywords);
      
      // 3. Get the active default prompt template
      const promptTemplate = await getActivePromptTemplate();
      console.log('Using prompt template:', promptTemplate.name);
      
      // 4. Generate database context based on keywords
      const databaseContext = await generateDatabaseContext(keywords);
      console.log('Generated database context');
      
      // 5. Construct the prompt
      const prompt = constructPrompt(
        promptTemplate.content_template,
        sanitizedText,
        databaseContext,
        promptTemplate.word_limit,
        context.isOverrideValidation || false
      );
      console.log('Constructed prompt');
      
      // 6. Call LLM with fallback logic
      const llmResponse = await callLLMWithFallback(prompt);
      console.log(`LLM call successful using ${llmResponse.provider} (${llmResponse.model})`);
      console.log(`Tokens used: ${llmResponse.totalTokens}, Latency: ${llmResponse.latencyMs}ms`);
      
      // 7. Process the LLM response
      const validationResult = processLLMResponse(llmResponse.content);
      console.log('Processed LLM response');
      
      // 8. Log the validation attempt to the PHI database (skip if in test mode)
      if (!testMode) {
        await this.logValidationAttempt(
          text,
          validationResult,
          llmResponse,
          context.orderId,
          context.userId || 1 // Default to user ID 1 if not provided
        );
        console.log('Logged validation attempt to PHI database');
      } else {
        console.log('Test mode: Skipping validation attempt logging');
      }
      
      // 9. Return the validation result
      return validationResult;
    } catch (error) {
      console.error('Error in validation process:', error);
      throw error;
    }
  }
  /**
   * Log validation attempt to the PHI database
   */
  private static async logValidationAttempt(
    originalText: string,
    validationResult: ValidationResult,
    llmResponse: LLMResponse,
    orderId?: number,
    userId: number = 1
  ): Promise<void> {
    try {
      // Get the next attempt number for this order
      let attemptNumber = 1;
      
      if (orderId) {
        const attemptResult = await queryPhiDb(
          `SELECT MAX(attempt_number) as max_attempt FROM validation_attempts WHERE order_id = $1`,
          [orderId]
        );
        
        if (attemptResult.rows[0].max_attempt) {
          attemptNumber = attemptResult.rows[0].max_attempt + 1;
        }
      }
      
      // Format ICD-10 and CPT codes for storage
      const icd10Codes = JSON.stringify(validationResult.suggestedICD10Codes.map(code => code.code));
      const cptCodes = JSON.stringify(validationResult.suggestedCPTCodes.map(code => code.code));
      
      // Insert validation attempt record
      await queryPhiDb(
        `INSERT INTO validation_attempts (
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
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())`,
        [
          orderId || null,
          attemptNumber,
          originalText,
          validationResult.validationStatus,
          icd10Codes,
          cptCodes,
          validationResult.feedback,
          validationResult.complianceScore,
          userId
        ]
      );
      
      // Check if llm_validation_logs table exists
      try {
        // Log LLM usage details
        await queryPhiDb(
          `INSERT INTO llm_validation_logs (
            provider,
            model,
            prompt_tokens,
            completion_tokens,
            total_tokens,
            latency_ms,
            created_at
          ) VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING id`,
          [
            llmResponse.provider,
            llmResponse.model,
            llmResponse.promptTokens || 0,
            llmResponse.completionTokens || 0,
            llmResponse.totalTokens || 0,
            llmResponse.latencyMs
          ]
        );
      } catch (error) {
        // If the table doesn't exist, log the error but don't fail the validation
        const err = error as Error;
        if (err.message && err.message.includes('relation "llm_validation_logs" does not exist')) {
          console.log('llm_validation_logs table does not exist. Skipping LLM usage logging.');
          
          // Create the table if it doesn't exist
          try {
            await queryPhiDb(`
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
          } catch (createError) {
            console.error('Error creating llm_validation_logs table:', createError);
          }
        } else {
          console.error('Error logging LLM usage:', error);
        }
      }
      
    } catch (error) {
      console.error('Error logging validation attempt:', error);
      // Don't throw the error, just log it
      // We don't want to fail the validation process if logging fails
    }
  }
}

export default ValidationService;