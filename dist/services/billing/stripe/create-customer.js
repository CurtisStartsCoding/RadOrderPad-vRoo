"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStripeCustomerForOrg = createStripeCustomerForOrg;
const db_1 = require("../../../config/db");
const stripe_service_1 = __importDefault(require("./stripe.service"));
const logger_1 = __importDefault(require("../../../utils/logger"));
/**
 * Create a Stripe customer for an organization and update the organization's billing_id
 *
 * @param orgId Organization ID
 * @param orgName Organization name
 * @param orgEmail Organization email
 * @returns Promise<string> Stripe customer ID
 * @throws Error if there's an issue creating the Stripe customer or updating the database
 */
async function createStripeCustomerForOrg(orgId, orgName, orgEmail) {
    try {
        // Create Stripe customer
        const customer = await stripe_service_1.default.createCustomer(orgName, orgEmail, { radorderpad_org_id: orgId.toString() });
        const stripeCustomerId = customer.id;
        // Update organization with Stripe customer ID
        await (0, db_1.queryMainDb)(`UPDATE organizations SET billing_id = $1 WHERE id = $2`, [stripeCustomerId, orgId]);
        logger_1.default.info(`[BillingService] Created Stripe customer`, {
            stripeCustomerId,
            orgId,
            orgName
        });
        return stripeCustomerId;
    }
    catch (error) {
        logger_1.default.error('[BillingService] Error creating Stripe customer:', {
            error,
            orgId,
            orgName,
            orgEmail
        });
        throw new Error(`Failed to create Stripe customer: ${error instanceof Error ? error.message : String(error)}`);
    }
}
//# sourceMappingURL=create-customer.js.map