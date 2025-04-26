import { InsufficientCreditsError } from './errors';
import { BurnCreditParams, CreateStripeCustomerParams, CreditActionType, BillingOverviewResponse } from './types';
import Stripe from 'stripe';
import { reportRadiologyOrderUsage } from './usage';
/**
 * BillingService provides methods for managing billing-related operations
 */
declare class BillingService {
    /**
     * Record credit usage for a validation action
     * Decrements the organization's credit balance and logs the usage
     *
     * @param params Parameters for burning a credit
     * @returns Promise<boolean> True if successful
     * @throws InsufficientCreditsError if the organization has insufficient credits
     */
    static burnCredit(params: BurnCreditParams): Promise<boolean>;
    /**
     * Check if an organization has sufficient credits
     *
     * @param organizationId Organization ID
     * @returns Promise<boolean> True if the organization has credits, false otherwise
     * @throws Error if the organization is not found or there's a database error
     */
    static hasCredits(organizationId: number): Promise<boolean>;
    /**
     * Get the credit balance for an organization
     *
     * @param orgId Organization ID
     * @returns Promise with the credit balance or null if organization not found
     */
    static getCreditBalance(orgId: number): Promise<{
        creditBalance: number;
    } | null>;
    /**
     * Get billing overview for an organization
     *
     * @param orgId Organization ID
     * @returns Promise with billing overview or null if organization not found
     */
    static getBillingOverview(orgId: number): Promise<BillingOverviewResponse | null>;
    /**
     * Get credit usage history for an organization
     *
     * @param orgId Organization ID
     * @param options Pagination, sorting, and filtering options
     * @returns Promise with credit usage logs and pagination info
     */
    static getCreditUsageHistory(orgId: number, options: {
        page: number;
        limit: number;
        sortBy?: string;
        sortOrder?: string;
        actionType?: string;
        dateStart?: string;
        dateEnd?: string;
    }): Promise<{
        usageLogs: Array<{
            id: number;
            userId: number;
            userName: string;
            orderId: number;
            tokensBurned: number;
            actionType: string;
            createdAt: string;
        }>;
        pagination: {
            total: number;
            page: number;
            limit: number;
            pages: number;
        };
    }>;
    /**
     * Create a subscription for an organization
     *
     * @param orgId Organization ID
     * @param priceId Stripe price ID for the subscription tier
     * @returns Promise with subscription details including client secret for payment confirmation
     * @throws Error if the organization doesn't have a billing_id or if there's an issue creating the subscription
     */
    static createSubscription(orgId: number, priceId: string): Promise<{
        subscriptionId: string;
        clientSecret: string | null;
        status: string;
    }>;
    /**
     * Verify the Stripe webhook signature
     * @param payload The raw request payload
     * @param signature The Stripe signature from the request headers
     * @returns The verified Stripe event
     */
    static verifyWebhookSignature(payload: Record<string, unknown>, signature: string): Stripe.Event;
    /**
     * Handle checkout.session.completed webhook event
     * @param event The Stripe event
     */
    static handleCheckoutSessionCompleted(event: Stripe.Event): Promise<{
        success: boolean;
        message: string;
    }>;
    /**
     * Handle invoice.payment_succeeded webhook event
     * @param event The Stripe event
     */
    static handleInvoicePaymentSucceeded(event: Stripe.Event): Promise<{
        success: boolean;
        message: string;
    }>;
    /**
     * Handle invoice.payment_failed webhook event
     * @param event The Stripe event
     */
    static handleInvoicePaymentFailed(event: Stripe.Event): Promise<{
        success: boolean;
        message: string;
    }>;
    /**
     * Handle customer.subscription.updated webhook event
     * @param event The Stripe event
     */
    static handleSubscriptionUpdated(event: Stripe.Event): Promise<{
        success: boolean;
        message: string;
    }>;
    /**
     * Handle customer.subscription.deleted webhook event
     * @param event The Stripe event
     */
    static handleSubscriptionDeleted(event: Stripe.Event): Promise<{
        success: boolean;
        message: string;
    }>;
    /**
     * Create a Stripe customer for an organization
     * @param params Parameters for creating a Stripe customer
     * @returns The Stripe customer ID
     */
    static createStripeCustomerForOrg(_params: CreateStripeCustomerParams): Promise<string>;
    /**
     * Create a checkout session for purchasing credit bundles
     *
     * @param orgId Organization ID
     * @param priceId Optional Stripe price ID (uses default from config if not provided)
     * @returns Promise<string> Checkout session ID
     * @throws Error if the organization doesn't have a billing_id or if there's an issue creating the checkout session
     */
    static createCreditCheckoutSession(_orgId: number, _priceId?: string): Promise<string>;
    /**
     * Report radiology organization order usage to Stripe for billing
     *
     * This function queries the orders table to count orders received by each radiology
     * organization within the specified date range, categorizes them as standard or advanced
     * imaging based on modality/CPT code, and creates Stripe invoice items for billing.
     *
     * @param startDate Start date for the reporting period
     * @param endDate End date for the reporting period
     * @returns Promise with array of usage reports
     */
    static reportRadiologyOrderUsage(startDate: Date, endDate: Date): Promise<unknown>;
}
export default BillingService;
export { InsufficientCreditsError, BurnCreditParams, CreateStripeCustomerParams, CreditActionType, Stripe, reportRadiologyOrderUsage };
