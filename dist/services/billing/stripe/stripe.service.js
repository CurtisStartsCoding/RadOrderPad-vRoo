import Stripe from 'stripe';
import config from '../../../config/config';
import { createCheckoutSessionInternal } from './create-checkout-session-internal';
/**
 * Service for interacting with the Stripe API
 */
class StripeService {
    constructor() {
        this.stripe = new Stripe(config.stripe.secretKey || '', {
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
            console.error('Error creating Stripe customer:', error);
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
            console.error('Error retrieving Stripe customer:', error);
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
        return createCheckoutSessionInternal(this.stripe, customerId, priceId, metadata, successUrl, cancelUrl);
    }
}
// Create and export a singleton instance
export default new StripeService();
//# sourceMappingURL=stripe.service.js.map