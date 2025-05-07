import Stripe from 'stripe';
import config from '../config/config';

/**
 * Stripe service for handling payment processing and customer management
 */
class StripeService {
  private stripe: Stripe;

  constructor() {
    if (!config.stripe.secretKey) {
      console.warn('STRIPE_SECRET_KEY is not set. Stripe functionality will be limited.');
    }

    this.stripe = new Stripe(config.stripe.secretKey || 'dummy_key_for_development');
  }

  /**
   * Create a new Stripe customer
   */
  async createCustomer(name: string, email: string, metadata: { radorderpad_org_id: number }): Promise<any> {
    try {
      const customer = await this.stripe.customers.create({
        name,
        email,
        metadata
      });

      console.log(`Created Stripe customer: ${customer.id} for organization: ${metadata.radorderpad_org_id}`);
      return customer;
    } catch (error: any) {
      console.error('Error creating Stripe customer:', error.message);
      throw new Error(`Failed to create Stripe customer: ${error.message}`);
    }
  }

  /**
   * Verify a Stripe webhook signature
   */
  verifyWebhookSignature(payload: Buffer, signature: string): any {
    try {
      if (!config.stripe.webhookSecret) {
        throw new Error('STRIPE_WEBHOOK_SECRET is not set');
      }

      return this.stripe.webhooks.constructEvent(
        payload,
        signature,
        config.stripe.webhookSecret
      );
    } catch (error: any) {
      console.error('Error verifying webhook signature:', error.message);
      throw new Error(`Webhook signature verification failed: ${error.message}`);
    }
  }

  /**
   * Handle checkout.session.completed event
   */
  async handleCheckoutSessionCompleted(event: any): Promise<void> {
    const session = event.data.object;
    
    // TODO: Implement credit top-up logic
    console.log(`Checkout session completed: ${session.id}`);
    
    // Example implementation:
    // 1. Extract organization ID from metadata
    // 2. Update credit balance in database
    // 3. Log billing event
  }

  /**
   * Handle invoice.payment_succeeded event
   */
  async handleInvoicePaymentSucceeded(event: any): Promise<void> {
    const invoice = event.data.object;
    
    // TODO: Implement subscription payment success logic
    console.log(`Invoice payment succeeded: ${invoice.id}`);
    
    // Example implementation:
    // 1. Update organization billing status
    // 2. Replenish credits for referring groups
    // 3. Log billing event
  }

  /**
   * Handle invoice.payment_failed event
   */
  async handleInvoicePaymentFailed(event: any): Promise<void> {
    const invoice = event.data.object;
    
    // TODO: Implement payment failure logic
    console.log(`Invoice payment failed: ${invoice.id}`);
    
    // Example implementation:
    // 1. Update organization billing status
    // 2. Send notifications to organization admins
    // 3. Set organization to purgatory mode if needed
    // 4. Log billing event
  }
}

export default new StripeService();