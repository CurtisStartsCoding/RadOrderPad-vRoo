"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logValidationAttempt = logValidationAttempt;
const db_1 = require("../../config/db");
const llm_logging_1 = require("./llm-logging");
/**
 * Log validation attempt to the PHI database
 */
async function logValidationAttempt(originalText, validationResult, llmResponse, orderId, userId = 1) {
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
        // Log LLM usage details
        await (0, llm_logging_1.logLLMUsage)(llmResponse);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    }
    catch (_) {
        // Log error without including potentially sensitive details
        // eslint-disable-next-line no-console
        console.error('Error logging validation attempt - check server logs for details');
        // Don't throw the error, just log it
        // We don't want to fail the validation process if logging fails
    }
}
//# sourceMappingURL=logging.js.map