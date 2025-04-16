import Stripe from 'stripe';
/**
 * Verify the Stripe webhook signature
 * @param payload Raw request body
 * @param signature Stripe signature from headers
 * @returns Verified Stripe event
 */
export declare const verifyWebhookSignature: (payload: any, signature: string) => Stripe.Event;
/**
 * Handle checkout.session.completed event
 * This is triggered when a customer completes a checkout session,
 * typically for purchasing credit bundles
 */
export declare const handleCheckoutSessionCompleted: (event: Stripe.Event) => Promise<void>;
/**
 * Handle invoice.payment_succeeded event
 * This is triggered when an invoice payment succeeds,
 * either for a subscription renewal or a one-time charge
 */
export declare const handleInvoicePaymentSucceeded: (event: Stripe.Event) => Promise<void>;
/**
 * Handle invoice.payment_failed event
 * This is triggered when an invoice payment fails
 */
export declare const handleInvoicePaymentFailed: (event: Stripe.Event) => Promise<void>;
/**
 * Handle customer.subscription.updated event
 * This is triggered when a subscription is updated (e.g., plan change, status change)
 */
export declare const handleSubscriptionUpdated: (event: Stripe.Event) => Promise<void>;
/**
 * Handle customer.subscription.deleted event
 * This is triggered when a subscription is canceled
 */
export declare const handleSubscriptionDeleted: (event: Stripe.Event) => Promise<void>;
