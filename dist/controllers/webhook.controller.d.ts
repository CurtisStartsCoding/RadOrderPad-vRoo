import { Request, Response } from 'express';
/**
 * Controller for handling webhook events from external services
 */
export declare class WebhookController {
    /**
     * Handle Stripe webhook events
     */
    static handleStripeWebhook(req: Request, res: Response): Promise<void>;
}
export default WebhookController;
