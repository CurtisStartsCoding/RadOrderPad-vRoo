import Stripe from 'stripe';
/**
 * Handle customer.subscription.deleted event
 * This is triggered when a subscription is canceled
 */
export declare function handleSubscriptionDeleted(event: Stripe.Event): Promise<void>;
