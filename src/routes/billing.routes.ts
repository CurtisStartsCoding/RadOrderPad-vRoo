import { Router } from 'express';
import { createCheckoutSession, createSubscription, getCreditBalance, getCreditUsageHistory } from '../controllers/billing';
import { authenticateJWT, authorizeRole } from '../middleware/auth';

const router = Router();

/**
 * @route POST /api/billing/create-checkout-session
 * @desc Create a Stripe checkout session for purchasing credit bundles
 * @access Private - admin_referring role only
 */
router.post(
  '/create-checkout-session',
  authenticateJWT,
  authorizeRole(['admin_referring']),
  createCheckoutSession
);

/**
 * @route POST /api/billing/subscriptions
 * @desc Create a Stripe subscription for a specific pricing tier
 * @access Private - admin_referring role only
 */
router.post(
  '/subscriptions',
  authenticateJWT,
  authorizeRole(['admin_referring']),
  createSubscription
);

/**
 * @route GET /api/billing/credit-balance
 * @desc Get the current credit balance for the organization
 * @access Private - admin_referring role only
 */
router.get(
  '/credit-balance',
  authenticateJWT,
  authorizeRole(['admin_referring']),
  getCreditBalance
);

/**
 * @route GET /api/billing/credit-usage
 * @desc Get credit usage history for the organization
 * @access Private - admin_referring role only
 */
router.get(
  '/credit-usage',
  authenticateJWT,
  authorizeRole(['admin_referring']),
  getCreditUsageHistory
);

export default router;