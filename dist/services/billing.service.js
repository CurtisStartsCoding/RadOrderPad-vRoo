"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingService = exports.InsufficientCreditsError = void 0;
const db_1 = require("../config/db");
const stripe_service_1 = __importDefault(require("./stripe.service"));
const config_1 = __importDefault(require("../config/config"));
/**
 * Custom error class for insufficient credits
 */
class InsufficientCreditsError extends Error {
    constructor(message = 'Insufficient credits available') {
        super(message);
        this.name = 'InsufficientCreditsError';
        Object.setPrototypeOf(this, InsufficientCreditsError.prototype);
    }
}
exports.InsufficientCreditsError = InsufficientCreditsError;
/**
 * Service for handling billing-related operations
 */
class BillingService {
    /**
     * Record credit usage for a validation action
     * Decrements the organization's credit balance and logs the usage
     *
     * @param organizationId Organization ID
     * @param userId User ID
     * @param orderId Order ID
     * @param actionType Action type ('validate', 'clarify', 'override_validate')
     * @returns Promise<boolean> True if successful
     * @throws InsufficientCreditsError if the organization has insufficient credits
     */
    static async burnCredit(organizationId, userId, orderId, actionType) {
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
                throw new InsufficientCreditsError(`Organization ${organizationId} has insufficient credits`);
            }
            // Get the new credit balance
            const newBalance = updateResult.rows[0].credit_balance;
            // Double-check that the balance is not negative (should never happen with the WHERE clause above)
            if (newBalance < 0) {
                await client.query('ROLLBACK');
                throw new InsufficientCreditsError(`Organization ${organizationId} has a negative credit balance`);
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
            if (error instanceof InsufficientCreditsError) {
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
    /**
     * Check if an organization has sufficient credits
     */
    static async hasCredits(organizationId) {
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
    /**
     * Create a Stripe customer for an organization and update the organization's billing_id
     * @param orgId Organization ID
     * @param orgName Organization name
     * @param orgEmail Organization email
     * @returns Promise<string> Stripe customer ID
     */
    static async createStripeCustomerForOrg(orgId, orgName, orgEmail) {
        try {
            // Create Stripe customer
            const customer = await stripe_service_1.default.createCustomer(orgName, orgEmail, { radorderpad_org_id: orgId });
            const stripeCustomerId = customer.id;
            // Update organization with Stripe customer ID
            await (0, db_1.queryMainDb)(`UPDATE organizations SET billing_id = $1 WHERE id = $2`, [stripeCustomerId, orgId]);
            console.log(`[BillingService] Created Stripe customer ${stripeCustomerId} for organization ${orgId}`);
            return stripeCustomerId;
        }
        catch (error) {
            console.error('[BillingService] Error creating Stripe customer:', error);
            throw new Error(`Failed to create Stripe customer: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}
exports.BillingService = BillingService;
exports.default = BillingService;
//# sourceMappingURL=billing.service.js.map