/**
 * Map Stripe price ID to subscription tier
 *
 * This function maps Stripe price IDs to our internal subscription tier names.
 * It includes both monthly and yearly subscription plans.
 *
 * @param priceId Stripe price ID
 * @returns Subscription tier string
 */
export declare function mapPriceIdToTier(priceId: string): string;
