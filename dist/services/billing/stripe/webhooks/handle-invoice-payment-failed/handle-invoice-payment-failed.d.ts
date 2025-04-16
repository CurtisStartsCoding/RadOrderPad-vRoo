import Stripe from 'stripe';
/**
 * Handle invoice.payment_failed event
 * This is triggered when an invoice payment fails
 */
export declare function handleInvoicePaymentFailed(event: Stripe.Event): Promise<void>;
