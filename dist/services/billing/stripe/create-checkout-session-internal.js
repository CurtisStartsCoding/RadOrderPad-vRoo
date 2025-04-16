"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCheckoutSessionInternal = createCheckoutSessionInternal;
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
async function createCheckoutSessionInternal(stripe, customerId, priceId, metadata, successUrl, cancelUrl) {
    try {
        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            customer: customerId,
            line_items: [
                {
                    price: priceId,
                    quantity: 1
                }
            ],
            success_url: successUrl,
            cancel_url: cancelUrl,
            metadata
        });
        return session;
    }
    catch (error) {
        console.error('Error creating checkout session:', error);
        throw new Error(`Failed to create checkout session: ${error instanceof Error ? error.message : String(error)}`);
    }
}
//# sourceMappingURL=create-checkout-session-internal.js.map