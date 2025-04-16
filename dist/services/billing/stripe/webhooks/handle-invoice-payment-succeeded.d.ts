import Stripe from 'stripe';
/**
 * Handle invoice.payment_succeeded event
 * This is triggered when an invoice payment succeeds,
 * either for a subscription renewal or a one-time charge
 */
export declare function handleInvoicePaymentSucceeded(event: Stripe.Event): Promise<void>;
