import { queryPhiDb } from '../../../../config/db';
/**
 * Log a validation attempt
 *
 * @param orderId - The ID of the order
 * @param attemptNumber - The attempt number
 * @param dictationText - The dictation text used for validation
 * @param validationResult - The result of the validation
 * @param userId - The ID of the user who initiated the validation
 */
export async function logValidationAttempt(orderId, attemptNumber, dictationText, validationResult, userId) {
    await queryPhiDb(`INSERT INTO validation_attempts 
    (order_id, attempt_number, validation_input_text, validation_outcome, 
    generated_icd10_codes, generated_cpt_codes, generated_feedback_text, 
    generated_compliance_score, user_id, created_at) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())`, [
        orderId,
        attemptNumber,
        dictationText,
        validationResult.validationStatus,
        JSON.stringify(validationResult.suggestedICD10Codes),
        JSON.stringify(validationResult.suggestedCPTCodes),
        validationResult.feedback,
        validationResult.complianceScore,
        userId
    ]);
}
//# sourceMappingURL=log-validation-attempt.js.map