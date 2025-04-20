import { Router } from 'express';
import { createCheckoutSession, createSubscription } from '../controllers/billing';
import { authenticateJWT, authorizeRole } from '../middleware/auth';
const router = Router();
/**
 * @route POST /api/billing/create-checkout-session
 * @desc Create a Stripe checkout session for purchasing credit bundles
 * @access Private - admin_referring role only
 */
router.post('/create-checkout-session', authenticateJWT, authorizeRole(['admin_referring']), createCheckoutSession);
/**
 * @route POST /api/billing/subscriptions
 * @desc Create a Stripe subscription for a specific pricing tier
 * @access Private - admin_referring role only
 */
router.post('/subscriptions', authenticateJWT, authorizeRole(['admin_referring']), createSubscription);
export default router;
//# sourceMappingURL=billing.routes.js.map