/**
 * Facade function for creating a credit checkout session
 * This function is used by the BillingService class
 *
 * @param orgId Organization ID
 * @param priceId Optional Stripe price ID
 * @returns Promise<string> Checkout session ID
 */
export declare function createCreditCheckoutSessionFacade(orgId: number, priceId?: string): Promise<string>;
