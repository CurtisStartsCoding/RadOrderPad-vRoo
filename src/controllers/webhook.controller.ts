import { Request, Response } from 'express';
import BillingService from '../services/billing';
import logger from '../utils/logger';

/**
 * Controller for handling webhook events from external services
 */
export class WebhookController {
  /**
   * Handle Stripe webhook events
   */
  static async handleStripeWebhook(req: Request, res: Response): Promise<void> {
    const signature = req.headers['stripe-signature'] as string;
    
    if (!signature) {
      res.status(400).json({ message: 'Missing stripe-signature header' });
      return;
    }
    
    try {
      // Verify the webhook signature
      // req.body is a Buffer when using express.raw middleware
      const event = BillingService.verifyWebhookSignature(req.body, signature);
      
      // Log the event type
      logger.info(`Received Stripe webhook event: ${event.type}`);
      
      // Handle different event types
      switch (event.type) {
        case 'checkout.session.completed':
          logger.info(`Received checkout.session.completed: ${event.id}`);
          await BillingService.handleCheckoutSessionCompleted(event);
          break;
          case 'invoice.payment_succeeded':
            logger.info(`Received invoice.payment_succeeded: ${event.id}`);
            await BillingService.handleInvoicePaymentSucceeded(event);
            break;
            
          case 'invoice.payment_failed':
            logger.info(`Received invoice.payment_failed: ${event.id}`);
            await BillingService.handleInvoicePaymentFailed(event);
            break;
            
          case 'customer.subscription.updated':
            logger.info(`Received customer.subscription.updated: ${event.id}`);
            await BillingService.handleSubscriptionUpdated(event);
            break;
            
          case 'customer.subscription.deleted':
            logger.info(`Received customer.subscription.deleted: ${event.id}`);
            await BillingService.handleSubscriptionDeleted(event);
            break;
            
          
        default:
          logger.info(`Unhandled Stripe event type: ${event.type}`);
      }
      
      // Return a 200 response to acknowledge receipt of the event
      res.status(200).json({ received: true });
    } catch (error) {
      const err = error as Error;
      logger.error(`Error handling Stripe webhook: ${err.message}`);
      res.status(400).json({ message: err.message });
    }
  }
}

export default WebhookController;