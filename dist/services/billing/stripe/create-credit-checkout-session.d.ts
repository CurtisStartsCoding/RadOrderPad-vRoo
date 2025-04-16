/**
 * Create a Stripe checkout session for purchasing credit bundles
 *
 * @param orgId Organization ID
 * @param priceId Stripe price ID (optional, uses default from config if not provided)
 * @returns Promise<string> Checkout session ID
 * @throws Error if the organization doesn't have a billing_id or if there's an issue creating the checkout session
 */
export declare function createCreditCheckoutSession(orgId: number, priceId?: string): Promise<string>;
