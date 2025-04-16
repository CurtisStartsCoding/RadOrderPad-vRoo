/**
 * Custom error class for insufficient credits
 */
export declare class InsufficientCreditsError extends Error {
    constructor(message?: string);
}
/**
 * Service for handling billing-related operations
 */
export declare class BillingService {
    /**
     * Record credit usage for a validation action
     * Decrements the organization's credit balance and logs the usage
     *
     * @param organizationId Organization ID
     * @param userId User ID
     * @param orderId Order ID
     * @param actionType Action type ('validate', 'clarify', 'override_validate')
     * @returns Promise<boolean> True if successful
     * @throws InsufficientCreditsError if the organization has insufficient credits
     */
    static burnCredit(organizationId: number, userId: number, orderId: number, actionType: 'validate' | 'clarify' | 'override_validate'): Promise<boolean>;
    /**
     * Check if an organization has sufficient credits
     */
    static hasCredits(organizationId: number): Promise<boolean>;
    /**
     * Create a Stripe customer for an organization and update the organization's billing_id
     * @param orgId Organization ID
     * @param orgName Organization name
     * @param orgEmail Organization email
     * @returns Promise<string> Stripe customer ID
     */
    static createStripeCustomerForOrg(orgId: number, orgName: string, orgEmail: string): Promise<string>;
}
export default BillingService;
