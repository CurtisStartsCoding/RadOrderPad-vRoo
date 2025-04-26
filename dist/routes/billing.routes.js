"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const billing_1 = require("../controllers/billing");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
/**
 * @route GET /api/billing
 * @desc Get billing overview including subscription status and credit balance
 * @access Private - admin_referring or admin_radiology role only
 */
router.get('/', auth_1.authenticateJWT, (0, auth_1.authorizeRole)(['admin_referring', 'admin_radiology']), billing_1.getBillingOverview);
/**
 * @route POST /api/billing/create-checkout-session
 * @desc Create a Stripe checkout session for purchasing credit bundles
 * @access Private - admin_referring role only
 */
router.post('/create-checkout-session', auth_1.authenticateJWT, (0, auth_1.authorizeRole)(['admin_referring']), billing_1.createCheckoutSession);
/**
 * @route POST /api/billing/subscriptions
 * @desc Create a Stripe subscription for a specific pricing tier
 * @access Private - admin_referring role only
 */
router.post('/subscriptions', auth_1.authenticateJWT, (0, auth_1.authorizeRole)(['admin_referring']), billing_1.createSubscription);
/**
 * @route GET /api/billing/credit-balance
 * @desc Get the current credit balance for the organization
 * @access Private - admin_referring role only
 */
router.get('/credit-balance', auth_1.authenticateJWT, (0, auth_1.authorizeRole)(['admin_referring']), billing_1.getCreditBalance);
/**
 * @route GET /api/billing/credit-usage
 * @desc Get credit usage history for the organization
 * @access Private - admin_referring role only
 */
router.get('/credit-usage', auth_1.authenticateJWT, (0, auth_1.authorizeRole)(['admin_referring']), billing_1.getCreditUsageHistory);
exports.default = router;
//# sourceMappingURL=billing.routes.js.map