/**
 * Create a Stripe subscription for an organization
 *
 * @param orgId Organization ID
 * @param priceId Stripe price ID for the subscription tier
 * @returns Promise with subscription details including client secret for payment confirmation
 * @throws Error if the organization doesn't have a billing_id or if there's an issue creating the subscription
 */
export declare function createSubscription(orgId: number, priceId: string): Promise<{
    subscriptionId: string;
    clientSecret: string | null;
    status: string;
}>;
