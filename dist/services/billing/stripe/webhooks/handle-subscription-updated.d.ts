import Stripe from 'stripe';
/**
 * Handle customer.subscription.updated event
 * This is triggered when a subscription is updated (e.g., tier change, status change)
 */
export declare function handleSubscriptionUpdated(event: Stripe.Event): Promise<void>;
