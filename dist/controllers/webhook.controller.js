import BillingService from '../services/billing';
/**
 * Controller for handling webhook events from external services
 */
export class WebhookController {
    /**
     * Handle Stripe webhook events
     */
    static async handleStripeWebhook(req, res) {
        const signature = req.headers['stripe-signature'];
        if (!signature) {
            res.status(400).json({ message: 'Missing stripe-signature header' });
            return;
        }
        try {
            // Verify the webhook signature
            // req.body is a Buffer when using express.raw middleware
            const event = BillingService.verifyWebhookSignature(req.body, signature);
            // Log the event type
            console.log(`Received Stripe webhook event: ${event.type}`);
            // Handle different event types
            switch (event.type) {
                case 'checkout.session.completed':
                    console.log('Received checkout.session.completed:', event.id);
                    await BillingService.handleCheckoutSessionCompleted(event);
                    break;
                case 'invoice.payment_succeeded':
                    console.log('Received invoice.payment_succeeded:', event.id);
                    await BillingService.handleInvoicePaymentSucceeded(event);
                    break;
                case 'invoice.payment_failed':
                    console.log('Received invoice.payment_failed:', event.id);
                    await BillingService.handleInvoicePaymentFailed(event);
                    break;
                case 'customer.subscription.updated':
                    console.log('Received customer.subscription.updated:', event.id);
                    await BillingService.handleSubscriptionUpdated(event);
                    break;
                case 'customer.subscription.deleted':
                    console.log('Received customer.subscription.deleted:', event.id);
                    await BillingService.handleSubscriptionDeleted(event);
                    break;
                default:
                    console.log(`Unhandled Stripe event type: ${event.type}`);
            }
            // Return a 200 response to acknowledge receipt of the event
            res.status(200).json({ received: true });
        }
        catch (error) {
            console.error('Error handling Stripe webhook:', error.message);
            res.status(400).json({ message: error.message });
        }
    }
}
export default WebhookController;
//# sourceMappingURL=webhook.controller.js.map