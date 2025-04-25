"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCreditCheckoutSession = createCreditCheckoutSession;
const db_1 = require("../../../config/db");
const stripe_service_1 = __importDefault(require("./stripe.service"));
const config_1 = __importDefault(require("../../../config/config"));
const logger_1 = __importDefault(require("../../../utils/logger"));
/**
 * Create a Stripe checkout session for purchasing credit bundles
 *
 * @param orgId Organization ID
 * @param priceId Stripe price ID (optional, uses default from config if not provided)
 * @returns Promise<string> Checkout session ID
 * @throws Error if the organization doesn't have a billing_id or if there's an issue creating the checkout session
 */
async function createCreditCheckoutSession(orgId, priceId) {
    try {
        // Use the provided price ID or fall back to the default from config
        const actualPriceId = priceId || config_1.default.stripe.creditBundlePriceId;
        if (!actualPriceId) {
            throw new Error('No price ID provided and no default price ID configured');
        }
        // Get the organization's billing_id (Stripe customer ID)
        const orgResult = await (0, db_1.queryMainDb)('SELECT billing_id FROM organizations WHERE id = $1', [orgId]);
        if (!orgResult.rows.length) {
            throw new Error(`Organization with ID ${orgId} not found`);
        }
        const billingId = orgResult.rows[0].billing_id;
        if (!billingId) {
            throw new Error(`Organization with ID ${orgId} does not have a billing ID`);
        }
        // Create metadata for the checkout session
        const metadata = {
            radorderpad_org_id: orgId.toString(),
            credit_bundle_price_id: actualPriceId
        };
        // Create the checkout session
        const session = await stripe_service_1.default.createCheckoutSession(billingId, actualPriceId, metadata, config_1.default.stripe.frontendSuccessUrl, config_1.default.stripe.frontendCancelUrl);
        logger_1.default.info(`[BillingService] Created checkout session`, {
            sessionId: session.id,
            orgId,
            priceId: actualPriceId
        });
        return session.id;
    }
    catch (error) {
        logger_1.default.error('Error creating credit checkout session:', {
            error,
            orgId,
            priceId
        });
        throw new Error(`Failed to create credit checkout session: ${error instanceof Error ? error.message : String(error)}`);
    }
}
//# sourceMappingURL=create-credit-checkout-session.js.map