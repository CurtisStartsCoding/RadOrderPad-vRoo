"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stripe_1 = __importDefault(require("stripe"));
const config_1 = __importDefault(require("../../../config/config"));
const create_checkout_session_internal_1 = require("./create-checkout-session-internal");
const logger_1 = __importDefault(require("../../../utils/logger"));
/**
 * Service for interacting with the Stripe API
 */
class StripeService {
    constructor() {
        this.stripe = new stripe_1.default(config_1.default.stripe.secretKey || '', {
            apiVersion: '2025-03-31.basil', // Use the latest API version
        });
    }
    /**
     * Create a Stripe customer
     * @param name Customer name
     * @param email Customer email
     * @param metadata Additional metadata to store with the customer
     * @returns Promise<Stripe.Customer> The created customer
     */
    async createCustomer(name, email, metadata) {
        try {
            const customer = await this.stripe.customers.create({
                name,
                email,
                metadata
            });
            return customer;
        }
        catch (error) {
            logger_1.default.error(`Error creating Stripe customer: ${error instanceof Error ? error.message : String(error)}`);
            throw new Error(`Failed to create Stripe customer: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Get a Stripe customer by ID
     * @param customerId Stripe customer ID
     * @returns Promise<Stripe.Customer> The customer
     */
    async getCustomer(customerId) {
        try {
            const customer = await this.stripe.customers.retrieve(customerId);
            if (customer.deleted) {
                throw new Error(`Customer ${customerId} has been deleted`);
            }
            return customer;
        }
        catch (error) {
            logger_1.default.error(`Error retrieving Stripe customer: ${error instanceof Error ? error.message : String(error)}`);
            throw new Error(`Failed to retrieve Stripe customer: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Create a checkout session for purchasing credit bundles
     * @param customerId Stripe customer ID
     * @param priceId Stripe price ID
     * @param metadata Additional metadata to store with the session
     * @param successUrl URL to redirect to on successful payment
     * @param cancelUrl URL to redirect to on canceled payment
     * @returns Promise<Stripe.Checkout.Session> The created checkout session
     */
    async createCheckoutSession(customerId, priceId, metadata, successUrl, cancelUrl) {
        // Delegate to the standalone function
        return (0, create_checkout_session_internal_1.createCheckoutSessionInternal)(this.stripe, customerId, priceId, metadata, successUrl, cancelUrl);
    }
}
// Create and export a singleton instance
exports.default = new StripeService();
//# sourceMappingURL=stripe.service.js.map