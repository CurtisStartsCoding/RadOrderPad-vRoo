"use strict";
/**
 * Stripe webhook handlers index
 *
 * This file exports all Stripe webhook handlers for easier importing.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.webhookHandlers = exports.handleSubscriptionDeleted = exports.handleSubscriptionUpdated = exports.handleInvoicePaymentSucceeded = void 0;
exports.getWebhookHandler = getWebhookHandler;
exports.verifyWebhookSignature = verifyWebhookSignature;
exports.handleCheckoutSessionCompleted = handleCheckoutSessionCompleted;
exports.handleInvoicePaymentFailed = handleInvoicePaymentFailed;
const logger_1 = __importDefault(require("../../../../utils/logger"));
// Import implemented handlers
var handleInvoicePaymentSucceeded_1 = require("./handleInvoicePaymentSucceeded");
Object.defineProperty(exports, "handleInvoicePaymentSucceeded", { enumerable: true, get: function () { return handleInvoicePaymentSucceeded_1.handleInvoicePaymentSucceeded; } });
var handleSubscriptionUpdated_1 = require("./handleSubscriptionUpdated");
Object.defineProperty(exports, "handleSubscriptionUpdated", { enumerable: true, get: function () { return handleSubscriptionUpdated_1.handleSubscriptionUpdated; } });
var handleSubscriptionDeleted_1 = require("./handleSubscriptionDeleted");
Object.defineProperty(exports, "handleSubscriptionDeleted", { enumerable: true, get: function () { return handleSubscriptionDeleted_1.handleSubscriptionDeleted; } });
// Import for internal use
const handleInvoicePaymentSucceeded_2 = require("./handleInvoicePaymentSucceeded");
const handleSubscriptionUpdated_2 = require("./handleSubscriptionUpdated");
const handleSubscriptionDeleted_2 = require("./handleSubscriptionDeleted");
// Define the map of event types to handlers with proper typing
exports.webhookHandlers = {
    'invoice.payment_succeeded': handleInvoicePaymentSucceeded_2.handleInvoicePaymentSucceeded,
    'customer.subscription.updated': handleSubscriptionUpdated_2.handleSubscriptionUpdated,
    'customer.subscription.deleted': handleSubscriptionDeleted_2.handleSubscriptionDeleted,
};
/**
 * Get the appropriate handler for a Stripe event type
 *
 * @param eventType - The Stripe event type
 * @returns The handler function or undefined if no handler exists
 */
function getWebhookHandler(eventType) {
    return exports.webhookHandlers[eventType];
}
/**
 * Verify the Stripe webhook signature
 *
 * @param payload - The raw request payload
 * @param signature - The Stripe signature from the request headers
 * @returns The verified Stripe event
 * @throws Error if the signature is invalid
 */
function verifyWebhookSignature(payload, signature) {
    // This is a placeholder implementation
    logger_1.default.warn(`Using placeholder implementation of verifyWebhookSignature with signature: ${signature.substring(0, 10)}...`);
    // In a real implementation, this would use Stripe.Webhook.constructEvent
    // to verify the signature and construct the event
    const event = JSON.parse(JSON.stringify(payload));
    return event;
}
/**
 * Handle checkout.session.completed webhook event
 *
 * @param event - The Stripe event
 * @returns Object with success status and message
 */
async function handleCheckoutSessionCompleted(event) {
    // This is a placeholder implementation
    logger_1.default.warn(`Using placeholder implementation of handleCheckoutSessionCompleted for event: ${event.id}`);
    return {
        success: true,
        message: 'Checkout session completed event handled (placeholder)'
    };
}
/**
 * Handle invoice.payment_failed webhook event
 *
 * @param event - The Stripe event
 * @returns Object with success status and message
 */
async function handleInvoicePaymentFailed(event) {
    // This is a placeholder implementation
    logger_1.default.warn(`Using placeholder implementation of handleInvoicePaymentFailed for event: ${event.id}`);
    return {
        success: true,
        message: 'Invoice payment failed event handled (placeholder)'
    };
}
//# sourceMappingURL=index.js.map