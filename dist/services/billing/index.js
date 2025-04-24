"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportRadiologyOrderUsage = exports.Stripe = exports.InsufficientCreditsError = void 0;
const credit_1 = require("./credit");
const get_credit_balance_service_1 = require("./get-credit-balance.service");
const get_credit_usage_history_service_1 = require("./get-credit-usage-history.service");
const stripe_1 = require("./stripe");
const errors_1 = require("./errors");
Object.defineProperty(exports, "InsufficientCreditsError", { enumerable: true, get: function () { return errors_1.InsufficientCreditsError; } });
const stripe_2 = __importDefault(require("stripe"));
exports.Stripe = stripe_2.default;
const enhanced_logger_1 = __importDefault(require("../../utils/enhanced-logger"));
const webhooks_1 = require("./stripe/webhooks");
const usage_1 = require("./usage");
Object.defineProperty(exports, "reportRadiologyOrderUsage", { enumerable: true, get: function () { return usage_1.reportRadiologyOrderUsage; } });
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
     * Get the credit balance for an organization
     *
     * @param orgId Organization ID
     * @returns Promise with the credit balance or null if organization not found
     */
    static async getCreditBalance(orgId) {
        return (0, get_credit_balance_service_1.getCreditBalance)(orgId);
    }
    /**
     * Get credit usage history for an organization
     *
     * @param orgId Organization ID
     * @param options Pagination, sorting, and filtering options
     * @returns Promise with credit usage logs and pagination info
     */
    static async getCreditUsageHistory(orgId, options) {
        return (0, get_credit_usage_history_service_1.getCreditUsageHistory)(orgId, options);
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    static async createStripeCustomerForOrg(_params) {
        // This is a placeholder implementation
        enhanced_logger_1.default.warn('Using placeholder implementation of createStripeCustomerForOrg');
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
    static async createCreditCheckoutSession(_orgId, _priceId) {
        // Temporary implementation until the actual implementation is restored
        enhanced_logger_1.default.warn('Using temporary implementation of createCreditCheckoutSession', {
            orgId: _orgId,
            priceId: _priceId
        });
        // Create a mock session ID
        const sessionId = `mock_cs_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
        return sessionId;
    }
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
    static async reportRadiologyOrderUsage(startDate, endDate) {
        return (0, usage_1.reportRadiologyOrderUsage)(startDate, endDate);
    }
}
// Export the BillingService class as the default export
exports.default = BillingService;
//# sourceMappingURL=index.js.map