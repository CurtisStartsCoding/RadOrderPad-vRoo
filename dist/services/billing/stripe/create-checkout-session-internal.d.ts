import Stripe from 'stripe';
/**
 * Create a checkout session for purchasing credit bundles
 * This is an internal function used by the StripeService facade
 *
 * @param stripe Stripe instance
 * @param customerId Stripe customer ID
 * @param priceId Stripe price ID
 * @param metadata Additional metadata to store with the session
 * @param successUrl URL to redirect to on successful payment
 * @param cancelUrl URL to redirect to on canceled payment
 * @returns Promise<Stripe.Checkout.Session> The created checkout session
 */
export declare function createCheckoutSessionInternal(stripe: Stripe, customerId: string, priceId: string, metadata: Record<string, string>, successUrl: string, cancelUrl: string): Promise<Stripe.Checkout.Session>;
