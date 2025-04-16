/**
 * Functions for tracking validation attempts
 */
import { queryPhiDb } from '../../../config/db';
import { ValidationResult } from '../../../models';

/**
 * Get the next attempt number for an order
 * 
 * @param orderId - The ID of the order
 * @returns The next attempt number
 */
export async function getNextAttemptNumber(orderId: number): Promise<number> {
  const attemptResult = await queryPhiDb(
    'SELECT MAX(attempt_number) as max_attempt FROM validation_attempts WHERE order_id = $1',
    [orderId]
  );
  
  if (attemptResult.rows.length > 0 && attemptResult.rows[0].max_attempt) {
    return attemptResult.rows[0].max_attempt + 1;
  }
  
  return 1;
}

/**
 * Log a validation attempt
 * 
 * @param orderId - The ID of the order
 * @param attemptNumber - The attempt number
 * @param dictationText - The dictation text used for validation
 * @param validationResult - The result of the validation
 * @param userId - The ID of the user who initiated the validation
 */
export async function logValidationAttempt(
  orderId: number,
  attemptNumber: number,
  dictationText: string,
  validationResult: ValidationResult,
  userId: number
): Promise<void> {
  await queryPhiDb(
    `INSERT INTO validation_attempts 
    (order_id, attempt_number, validation_input_text, validation_outcome, 
    generated_icd10_codes, generated_cpt_codes, generated_feedback_text, 
    generated_compliance_score, user_id, created_at) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())`,
    [
      orderId,
      attemptNumber,
      dictationText,
      validationResult.validationStatus,
      JSON.stringify(validationResult.suggestedICD10Codes),
      JSON.stringify(validationResult.suggestedCPTCodes),
      validationResult.feedback,
      validationResult.complianceScore,
      userId
    ]
  );
}