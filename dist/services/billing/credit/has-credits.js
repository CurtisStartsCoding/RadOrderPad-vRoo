"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasCredits = hasCredits;
const db_1 = require("../../../config/db");
/**
 * Check if an organization has sufficient credits
 *
 * @param organizationId Organization ID
 * @returns Promise<boolean> True if the organization has credits, false otherwise
 * @throws Error if the organization is not found or there's a database error
 */
async function hasCredits(organizationId) {
    try {
        const client = await (0, db_1.getMainDbClient)();
        const result = await client.query('SELECT credit_balance FROM organizations WHERE id = $1', [organizationId]);
        client.release();
        if (result.rows.length === 0) {
            throw new Error(`Organization ${organizationId} not found`);
        }
        return result.rows[0].credit_balance > 0;
    }
    catch (error) {
        console.error('Error checking credits:', error);
        throw error;
    }
}
//# sourceMappingURL=has-credits.js.map