"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.burnCredit = burnCredit;
const db_1 = require("../../../config/db");
const config_1 = __importDefault(require("../../../config/config"));
const errors_1 = require("../errors");
/**
 * Record credit usage for an order submission action
 * Decrements the organization's credit balance and logs the usage
 *
 * @param organizationId Organization ID
 * @param userId User ID
 * @param orderId Order ID
 * @param actionType Action type ('order_submitted')
 * @returns Promise<boolean> True if successful
 * @throws InsufficientCreditsError if the organization has insufficient credits
 */
async function burnCredit(organizationId, userId, orderId, actionType) {
    // Check if billing test mode is enabled
    if (config_1.default.testMode.billing) {
        console.log(`[TEST MODE] Credit burn skipped for organization ${organizationId}, action: ${actionType}`);
        return true;
    }
    // Get a client for transaction
    const client = await (0, db_1.getMainDbClient)();
    try {
        // Start transaction
        await client.query('BEGIN');
        // 1. Decrement the organization's credit balance
        const updateResult = await client.query(`UPDATE organizations 
       SET credit_balance = credit_balance - 1 
       WHERE id = $1 AND credit_balance > 0 
       RETURNING credit_balance`, [organizationId]);
        // Check if the update was successful
        if (updateResult.rowCount === 0) {
            // No rows updated means the organization had insufficient credits
            await client.query('ROLLBACK');
            throw new errors_1.InsufficientCreditsError(`Organization ${organizationId} has insufficient credits`);
        }
        // Get the new credit balance
        const newBalance = updateResult.rows[0].credit_balance;
        // Double-check that the balance is not negative (should never happen with the WHERE clause above)
        if (newBalance < 0) {
            await client.query('ROLLBACK');
            throw new errors_1.InsufficientCreditsError(`Organization ${organizationId} has a negative credit balance`);
        }
        // 2. Log the credit usage
        await client.query(`INSERT INTO credit_usage_logs 
       (organization_id, user_id, order_id, tokens_burned, action_type) 
       VALUES ($1, $2, $3, $4, $5)`, [organizationId, userId, orderId, 1, actionType]);
        // Commit transaction
        await client.query('COMMIT');
        // Log the action (for development purposes)
        console.log(`[BillingService] Burning credit for organization ${organizationId}, user ${userId}, order ${orderId}, action ${actionType}`);
        console.log(`[BillingService] New credit balance: ${newBalance}`);
        return true;
    }
    catch (error) {
        // Rollback transaction on error
        await client.query('ROLLBACK');
        // Re-throw InsufficientCreditsError, but wrap other errors
        if (error instanceof errors_1.InsufficientCreditsError) {
            throw error;
        }
        else {
            console.error('Error in burnCredit:', error);
            throw new Error(`Failed to burn credit: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    finally {
        // Release client back to pool
        client.release();
    }
}
//# sourceMappingURL=burn-credit.js.map