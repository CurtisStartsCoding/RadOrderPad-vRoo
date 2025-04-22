import { InsufficientCreditsError } from './errors';
import { BurnCreditParams, CreateStripeCustomerParams, CreditActionType } from './types';
import Stripe from 'stripe';
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
    static verifyWebhookSignature(payload: any, signature: string): Stripe.Event;
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
    static createStripeCustomerForOrg(params: CreateStripeCustomerParams): Promise<string>;
    /**
     * Create a checkout session for purchasing credit bundles
     *
     * @param orgId Organization ID
     * @param priceId Optional Stripe price ID (uses default from config if not provided)
     * @returns Promise<string> Checkout session ID
     * @throws Error if the organization doesn't have a billing_id or if there's an issue creating the checkout session
     */
    static createCreditCheckoutSession(orgId: number, priceId?: string): Promise<string>;
}
export default BillingService;
export { InsufficientCreditsError, BurnCreditParams, CreateStripeCustomerParams, CreditActionType, Stripe };
