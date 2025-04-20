import { burnCredit, hasCredits } from './credit';
import { createSubscription } from './stripe';
import { InsufficientCreditsError } from './errors';
import Stripe from 'stripe';
import { verifyWebhookSignature, handleCheckoutSessionCompleted, handleInvoicePaymentSucceeded, handleInvoicePaymentFailed, handleSubscriptionUpdated, handleSubscriptionDeleted } from './stripe/webhooks';
/**
 * BillingService provides methods for managing billing-related operations
 */
class BillingService {
    /**
     * Record credit usage for a validation action
     * Decrements the organization's credit balance and logs the usage
     *
     * @param params Parameters for burning a credit
     * @returns Promise<boolean> True if successful
     * @throws InsufficientCreditsError if the organization has insufficient credits
     */
    static async burnCredit(params) {
        const { organizationId, userId, orderId, actionType } = params;
        return burnCredit(organizationId, userId, orderId, actionType);
    }
    /**
     * Check if an organization has sufficient credits
     *
     * @param organizationId Organization ID
     * @returns Promise<boolean> True if the organization has credits, false otherwise
     * @throws Error if the organization is not found or there's a database error
     */
    static async hasCredits(organizationId) {
        return hasCredits(organizationId);
    }
    /**
     * Create a subscription for an organization
     *
     * @param orgId Organization ID
     * @param priceId Stripe price ID for the subscription tier
     * @returns Promise with subscription details including client secret for payment confirmation
     * @throws Error if the organization doesn't have a billing_id or if there's an issue creating the subscription
     */
    static async createSubscription(orgId, priceId) {
        return createSubscription(orgId, priceId);
    }
    /**
     * Verify the Stripe webhook signature
     * @param payload The raw request payload
     * @param signature The Stripe signature from the request headers
     * @returns The verified Stripe event
     */
    static verifyWebhookSignature(payload, signature) {
        return verifyWebhookSignature(payload, signature);
    }
    /**
     * Handle checkout.session.completed webhook event
     * @param event The Stripe event
     */
    static async handleCheckoutSessionCompleted(event) {
        return handleCheckoutSessionCompleted(event);
    }
    /**
     * Handle invoice.payment_succeeded webhook event
     * @param event The Stripe event
     */
    static async handleInvoicePaymentSucceeded(event) {
        return handleInvoicePaymentSucceeded(event);
    }
    /**
     * Handle invoice.payment_failed webhook event
     * @param event The Stripe event
     */
    static async handleInvoicePaymentFailed(event) {
        return handleInvoicePaymentFailed(event);
    }
    /**
     * Handle customer.subscription.updated webhook event
     * @param event The Stripe event
     */
    static async handleSubscriptionUpdated(event) {
        return handleSubscriptionUpdated(event);
    }
    /**
     * Handle customer.subscription.deleted webhook event
     * @param event The Stripe event
     */
    static async handleSubscriptionDeleted(event) {
        return handleSubscriptionDeleted(event);
    }
    /**
     * Create a Stripe customer for an organization
     * @param params Parameters for creating a Stripe customer
     * @returns The Stripe customer ID
     */
    static async createStripeCustomerForOrg(params) {
        // This is a placeholder implementation
        console.warn('Using placeholder implementation of createStripeCustomerForOrg');
        return `cus_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    }
    /**
     * Create a checkout session for purchasing credit bundles
     *
     * @param orgId Organization ID
     * @param priceId Optional Stripe price ID (uses default from config if not provided)
     * @returns Promise<string> Checkout session ID
     * @throws Error if the organization doesn't have a billing_id or if there's an issue creating the checkout session
     */
    static async createCreditCheckoutSession(orgId, priceId) {
        // Temporary implementation until the actual implementation is restored
        console.warn('Using temporary implementation of createCreditCheckoutSession');
        // Create a mock session ID
        const sessionId = `mock_cs_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
        return sessionId;
    }
}
// Export the BillingService class as the default export
export default BillingService;
// Export types and errors for external use
export { InsufficientCreditsError, Stripe };
//# sourceMappingURL=index.js.map