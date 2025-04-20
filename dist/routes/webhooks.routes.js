"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_2 = __importDefault(require("express"));
const webhook_controller_1 = __importDefault(require("../controllers/webhook.controller"));
const router = (0, express_1.Router)();
// Special middleware for Stripe webhooks
// This must be applied before any other middleware that might parse the request body
// The raw body is needed for signature verification
router.post('/stripe', express_2.default.raw({ type: 'application/json' }), webhook_controller_1.default.handleStripeWebhook);
exports.default = router;
//# sourceMappingURL=webhooks.routes.js.map