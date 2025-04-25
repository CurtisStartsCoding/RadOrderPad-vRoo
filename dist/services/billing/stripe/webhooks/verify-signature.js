"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyWebhookSignature = verifyWebhookSignature;
const utils_1 = require("./utils");
/**
 * Verify the Stripe webhook signature
 * @param payload Raw request body
 * @param signature Stripe signature from headers
 * @returns Verified Stripe event
 */
function verifyWebhookSignature(payload, signature) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
        throw new Error('Missing STRIPE_WEBHOOK_SECRET environment variable');
    }
    try {
        // Verify the event with Stripe
        return utils_1.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(`Webhook signature verification failed: ${errorMessage}`);
    }
}
//# sourceMappingURL=verify-signature.js.map