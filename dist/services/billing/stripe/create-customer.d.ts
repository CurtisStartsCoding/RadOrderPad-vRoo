/**
 * Create a Stripe customer for an organization and update the organization's billing_id
 *
 * @param orgId Organization ID
 * @param orgName Organization name
 * @param orgEmail Organization email
 * @returns Promise<string> Stripe customer ID
 * @throws Error if there's an issue creating the Stripe customer or updating the database
 */
export declare function createStripeCustomerForOrg(orgId: number, orgName: string, orgEmail: string): Promise<string>;
