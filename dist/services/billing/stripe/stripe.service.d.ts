import Stripe from 'stripe';
/**
 * Service for interacting with the Stripe API
 */
declare class StripeService {
    private stripe;
    constructor();
    /**
     * Create a Stripe customer
     * @param name Customer name
     * @param email Customer email
     * @param metadata Additional metadata to store with the customer
     * @returns Promise<Stripe.Customer> The created customer
     */
    createCustomer(name: string, email: string, metadata?: Record<string, any>): Promise<Stripe.Customer>;
    /**
     * Get a Stripe customer by ID
     * @param customerId Stripe customer ID
     * @returns Promise<Stripe.Customer> The customer
     */
    getCustomer(customerId: string): Promise<Stripe.Customer>;
    /**
     * Create a checkout session for purchasing credit bundles
     * @param customerId Stripe customer ID
     * @param priceId Stripe price ID
     * @param metadata Additional metadata to store with the session
     * @param successUrl URL to redirect to on successful payment
     * @param cancelUrl URL to redirect to on canceled payment
     * @returns Promise<Stripe.Checkout.Session> The created checkout session
     */
    createCheckoutSession(customerId: string, priceId: string, metadata: Record<string, string>, successUrl: string, cancelUrl: string): Promise<Stripe.Checkout.Session>;
}
declare const _default: StripeService;
export default _default;
