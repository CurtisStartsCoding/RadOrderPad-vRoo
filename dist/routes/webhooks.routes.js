import { Router } from 'express';
import express from 'express';
import WebhookController from '../controllers/webhook.controller';
const router = Router();
// Special middleware for Stripe webhooks
// This must be applied before any other middleware that might parse the request body
// The raw body is needed for signature verification
router.post('/stripe', express.raw({ type: 'application/json' }), WebhookController.handleStripeWebhook);
export default router;
//# sourceMappingURL=webhooks.routes.js.map