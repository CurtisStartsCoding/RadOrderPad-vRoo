"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCheckoutSession = createCheckoutSession;
const billing_1 = __importDefault(require("../../services/billing"));
const logger_1 = __importDefault(require("../../utils/logger"));
/**
 * Create a checkout session for purchasing credit bundles
 *
 * @param req Express request object
 * @param res Express response object
 * @returns Response with checkout session ID or error
 */
async function createCheckoutSession(req, res) {
    try {
        // Extract organization ID from authenticated user
        const orgId = req.user?.orgId;
        if (!orgId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized: User organization not found'
            });
        }
        // Extract optional price ID from request body
        const { priceId } = req.body;
        // Create checkout session
        const sessionId = await billing_1.default.createCreditCheckoutSession(orgId, priceId);
        return res.status(200).json({
            success: true,
            sessionId
        });
    }
    catch (error) {
        logger_1.default.error('Error creating checkout session:', {
            error,
            orgId: req.user?.orgId,
            priceId: req.body?.priceId
        });
        return res.status(500).json({
            success: false,
            message: `Failed to create checkout session: ${error instanceof Error ? error.message : String(error)}`
        });
    }
}
//# sourceMappingURL=create-checkout-session.js.map