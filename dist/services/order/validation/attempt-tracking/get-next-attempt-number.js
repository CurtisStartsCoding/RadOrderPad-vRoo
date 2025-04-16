"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNextAttemptNumber = getNextAttemptNumber;
const db_1 = require("../../../../config/db");
/**
 * Get the next attempt number for an order
 *
 * @param orderId - The ID of the order
 * @returns The next attempt number
 */
async function getNextAttemptNumber(orderId) {
    const attemptResult = await (0, db_1.queryPhiDb)('SELECT MAX(attempt_number) as max_attempt FROM validation_attempts WHERE order_id = $1', [orderId]);
    if (attemptResult.rows.length > 0 && attemptResult.rows[0].max_attempt) {
        return attemptResult.rows[0].max_attempt + 1;
    }
    return 1;
}
//# sourceMappingURL=get-next-attempt-number.js.map