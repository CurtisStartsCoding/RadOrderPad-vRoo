import { queryMainDb } from '../../../config/db';
import stripeService from './stripe.service';
import config from '../../../config/config';
/**
 * Create a Stripe checkout session for purchasing credit bundles
 *
 * @param orgId Organization ID
 * @param priceId Stripe price ID (optional, uses default from config if not provided)
 * @returns Promise<string> Checkout session ID
 * @throws Error if the organization doesn't have a billing_id or if there's an issue creating the checkout session
 */
export async function createCreditCheckoutSession(orgId, priceId) {
    try {
        // Use the provided price ID or fall back to the default from config
        const actualPriceId = priceId || config.stripe.creditBundlePriceId;
        if (!actualPriceId) {
            throw new Error('No price ID provided and no default price ID configured');
        }
        // Get the organization's billing_id (Stripe customer ID)
        const orgResult = await queryMainDb('SELECT billing_id FROM organizations WHERE id = $1', [orgId]);
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
        const session = await stripeService.createCheckoutSession(billingId, actualPriceId, metadata, config.stripe.frontendSuccessUrl, config.stripe.frontendCancelUrl);
        console.log(`[BillingService] Created checkout session ${session.id} for organization ${orgId}`);
        return session.id;
    }
    catch (error) {
        console.error('Error creating credit checkout session:', error);
        throw new Error(`Failed to create credit checkout session: ${error instanceof Error ? error.message : String(error)}`);
    }
}
//# sourceMappingURL=create-credit-checkout-session.js.map