import Stripe from 'stripe';
/**
 * Determine if an organization should be placed in purgatory mode
 * based on payment failure criteria
 *
 * @param invoice The Stripe invoice object
 * @param organization The organization data from the database
 * @returns boolean indicating whether to place in purgatory
 */
export declare function shouldEnterPurgatory(invoice: Stripe.Invoice): boolean;
