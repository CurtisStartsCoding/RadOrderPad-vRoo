/**
 * Validation attempt logging functionality
 */
import { ValidationResult } from '../../models';
import { LLMResponse } from '../../utils/llm';
import { queryPhiDb } from '../../config/db';
import { logLLMUsage } from './llm-logging';

/**
 * Log validation attempt to the PHI database
 */
export async function logValidationAttempt(
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
    
    // Log LLM usage details
    await logLLMUsage(llmResponse);
    
  } catch (error) {
    console.error('Error logging validation attempt:', error);
    // Don't throw the error, just log it
    // We don't want to fail the validation process if logging fails
  }
}