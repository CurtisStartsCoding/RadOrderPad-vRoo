import { stripe } from './utils';
/**
 * Verify the Stripe webhook signature
 * @param payload Raw request body
 * @param signature Stripe signature from headers
 * @returns Verified Stripe event
 */
export function verifyWebhookSignature(payload, signature) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
        throw new Error('Missing STRIPE_WEBHOOK_SECRET environment variable');
    }
    try {
        // Verify the event with Stripe
        return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    }
    catch (error) {
        throw new Error(`Webhook signature verification failed: ${error.message}`);
    }
}
//# sourceMappingURL=verify-signature.js.map