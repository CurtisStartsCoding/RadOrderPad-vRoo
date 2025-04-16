/**
 * Stripe service for handling payment processing and customer management
 */
declare class StripeService {
    private stripe;
    constructor();
    /**
     * Create a new Stripe customer
     */
    createCustomer(name: string, email: string, metadata: {
        radorderpad_org_id: number;
    }): Promise<any>;
    /**
     * Verify a Stripe webhook signature
     */
    verifyWebhookSignature(payload: Buffer, signature: string): any;
    /**
     * Handle checkout.session.completed event
     */
    handleCheckoutSessionCompleted(event: any): Promise<void>;
    /**
     * Handle invoice.payment_succeeded event
     */
    handleInvoicePaymentSucceeded(event: any): Promise<void>;
    /**
     * Handle invoice.payment_failed event
     */
    handleInvoicePaymentFailed(event: any): Promise<void>;
}
declare const _default: StripeService;
export default _default;
