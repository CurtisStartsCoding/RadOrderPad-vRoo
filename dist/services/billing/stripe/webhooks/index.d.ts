/**
 * Stripe webhook handlers index
 *
 * This file exports all Stripe webhook handlers for easier importing.
 */
import { Stripe } from 'stripe';
export { handleInvoicePaymentSucceeded } from './handleInvoicePaymentSucceeded';
export { handleSubscriptionUpdated } from './handleSubscriptionUpdated';
export { handleSubscriptionDeleted } from './handleSubscriptionDeleted';
export type WebhookHandler = (event: Stripe.Event) => Promise<{
    success: boolean;
    message: string;
}>;
export declare const webhookHandlers: Record<string, WebhookHandler>;
/**
 * Get the appropriate handler for a Stripe event type
 *
 * @param eventType - The Stripe event type
 * @returns The handler function or undefined if no handler exists
 */
export declare function getWebhookHandler(eventType: string): WebhookHandler | undefined;
/**
 * Verify the Stripe webhook signature
 *
 * @param payload - The raw request payload
 * @param signature - The Stripe signature from the request headers
 * @returns The verified Stripe event
 * @throws Error if the signature is invalid
 */
export declare function verifyWebhookSignature(payload: Record<string, unknown>, signature: string): Stripe.Event;
/**
 * Handle checkout.session.completed webhook event
 *
 * @param event - The Stripe event
 * @returns Object with success status and message
 */
export declare function handleCheckoutSessionCompleted(event: Stripe.Event): Promise<{
    success: boolean;
    message: string;
}>;
/**
 * Handle invoice.payment_failed webhook event
 *
 * @param event - The Stripe event
 * @returns Object with success status and message
 */
export declare function handleInvoicePaymentFailed(event: Stripe.Event): Promise<{
    success: boolean;
    message: string;
}>;
