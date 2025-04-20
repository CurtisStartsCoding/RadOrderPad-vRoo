"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCreditCheckoutSessionFacade = createCreditCheckoutSessionFacade;
const create_credit_checkout_session_1 = require("./create-credit-checkout-session");
/**
 * Facade function for creating a credit checkout session
 * This function is used by the BillingService class
 *
 * @param orgId Organization ID
 * @param priceId Optional Stripe price ID
 * @returns Promise<string> Checkout session ID
 */
async function createCreditCheckoutSessionFacade(orgId, priceId) {
    // Delegate to the standalone function
    return (0, create_credit_checkout_session_1.createCreditCheckoutSession)(orgId, priceId);
}
//# sourceMappingURL=create-credit-checkout-session-facade.js.map