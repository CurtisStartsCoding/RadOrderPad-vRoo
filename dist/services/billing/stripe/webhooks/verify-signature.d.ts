import Stripe from 'stripe';
/**
 * Verify the Stripe webhook signature
 * @param payload Raw request body
 * @param signature Stripe signature from headers
 * @returns Verified Stripe event
 */
export declare function verifyWebhookSignature(payload: any, signature: string): Stripe.Event;
