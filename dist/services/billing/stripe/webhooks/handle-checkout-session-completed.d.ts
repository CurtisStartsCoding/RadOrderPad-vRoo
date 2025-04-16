import Stripe from 'stripe';
/**
 * Handle checkout.session.completed event
 * This is triggered when a customer completes a checkout session,
 * typically for purchasing credit bundles
 */
export declare function handleCheckoutSessionCompleted(event: Stripe.Event): Promise<void>;
