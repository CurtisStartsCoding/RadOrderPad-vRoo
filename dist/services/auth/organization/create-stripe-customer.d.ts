/**
 * Create a Stripe customer for an organization
 */
export declare function createStripeCustomer(organizationId: number, organizationName: string, contactEmail: string): Promise<string | null>;
