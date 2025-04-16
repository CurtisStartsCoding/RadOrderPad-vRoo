"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stripe = exports.InsufficientCreditsError = void 0;
const credit_1 = require("./credit");
const stripe_1 = require("./stripe");
const errors_1 = require("./errors");
Object.defineProperty(exports, "InsufficientCreditsError", { enumerable: true, get: function () { return errors_1.InsufficientCreditsError; } });
const stripe_2 = __importDefault(require("stripe"));
exports.Stripe = stripe_2.default;
const webhooks_1 = require("./stripe/webhooks");
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
        return (0, credit_1.burnCredit)(organizationId, userId, orderId, actionType);
    }
    /**
     * Check if an organization has sufficient credits
     *
     * @param organizationId Organization ID
     * @returns Promise<boolean> True if the organization has credits, false otherwise
     * @throws Error if the organization is not found or there's a database error
     */
    static async hasCredits(organizationId) {
        return (0, credit_1.hasCredits)(organizationId);
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
        return (0, stripe_1.createSubscription)(orgId, priceId);
    }
    /**
     * Verify the Stripe webhook signature
     * @param payload The raw request payload
     * @param signature The Stripe signature from the request headers
     * @returns The verified Stripe event
     */
    static verifyWebhookSignature(payload, signature) {
        return (0, webhooks_1.verifyWebhookSignature)(payload, signature);
    }
    /**
     * Handle checkout.session.completed webhook event
     * @param event The Stripe event
     */
    static async handleCheckoutSessionCompleted(event) {
        return (0, webhooks_1.handleCheckoutSessionCompleted)(event);
    }
    /**
     * Handle invoice.payment_succeeded webhook event
     * @param event The Stripe event
     */
    static async handleInvoicePaymentSucceeded(event) {
        return (0, webhooks_1.handleInvoicePaymentSucceeded)(event);
    }
    /**
     * Handle invoice.payment_failed webhook event
     * @param event The Stripe event
     */
    static async handleInvoicePaymentFailed(event) {
        return (0, webhooks_1.handleInvoicePaymentFailed)(event);
    }
    /**
     * Handle customer.subscription.updated webhook event
     * @param event The Stripe event
     */
    static async handleSubscriptionUpdated(event) {
        return (0, webhooks_1.handleSubscriptionUpdated)(event);
    }
    /**
     * Handle customer.subscription.deleted webhook event
     * @param event The Stripe event
     */
    static async handleSubscriptionDeleted(event) {
        return (0, webhooks_1.handleSubscriptionDeleted)(event);
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
exports.default = BillingService;
//# sourceMappingURL=index.js.map