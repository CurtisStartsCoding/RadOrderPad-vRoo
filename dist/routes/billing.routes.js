"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const billing_1 = require("../controllers/billing");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
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
exports.default = router;
//# sourceMappingURL=billing.routes.js.map