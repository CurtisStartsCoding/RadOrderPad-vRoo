"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchValidationAttempts = fetchValidationAttempts;
const db_1 = require("../../../../config/db");
/**
 * Fetch validation attempts for an order
 * @param orderId Order ID
 * @returns Array of validation attempts
 */
async function fetchValidationAttempts(orderId) {
    const validationAttemptsResult = await (0, db_1.queryPhiDb)(`SELECT va.id, va.attempt_number, va.validation_outcome, va.generated_compliance_score,
            va.created_at
     FROM validation_attempts va
     WHERE va.order_id = $1
     ORDER BY va.attempt_number ASC`, [orderId]);
    return validationAttemptsResult.rows;
}
//# sourceMappingURL=fetch-validation-attempts.js.map