import { createCreditCheckoutSession } from './create-credit-checkout-session';
/**
 * Facade function for creating a credit checkout session
 * This function is used by the BillingService class
 *
 * @param orgId Organization ID
 * @param priceId Optional Stripe price ID
 * @returns Promise<string> Checkout session ID
 */
export async function createCreditCheckoutSessionFacade(orgId, priceId) {
    // Delegate to the standalone function
    return createCreditCheckoutSession(orgId, priceId);
}
//# sourceMappingURL=create-credit-checkout-session-facade.js.map