import BillingService from '../../services/billing';
/**
 * Create a checkout session for purchasing credit bundles
 *
 * @param req Express request object
 * @param res Express response object
 * @returns Response with checkout session ID or error
 */
export async function createCheckoutSession(req, res) {
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
        const sessionId = await BillingService.createCreditCheckoutSession(orgId, priceId);
        return res.status(200).json({
            success: true,
            sessionId
        });
    }
    catch (error) {
        console.error('Error creating checkout session:', error);
        return res.status(500).json({
            success: false,
            message: `Failed to create checkout session: ${error instanceof Error ? error.message : String(error)}`
        });
    }
}
//# sourceMappingURL=create-checkout-session.js.map