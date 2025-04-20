import BillingService from '../../services/billing';
/**
 * Create a Stripe subscription for a specific pricing tier
 *
 * @param req Express request object
 * @param res Express response object
 * @returns Response with subscription details or error
 */
export async function createSubscription(req, res) {
    try {
        // Extract organization ID from authenticated user
        const orgId = req.user?.orgId;
        if (!orgId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized: User organization not found'
            });
        }
        // Extract price ID from request body
        const { priceId } = req.body;
        if (!priceId) {
            return res.status(400).json({
                success: false,
                message: 'Bad Request: Price ID is required'
            });
        }
        // Get tier price IDs from environment variables
        // These should be defined in .env as STRIPE_PRICE_ID_TIER_1, STRIPE_PRICE_ID_TIER_2, STRIPE_PRICE_ID_TIER_3
        const priceTier1Id = process.env.STRIPE_PRICE_ID_TIER_1;
        const priceTier2Id = process.env.STRIPE_PRICE_ID_TIER_2;
        const priceTier3Id = process.env.STRIPE_PRICE_ID_TIER_3;
        // Validate that the price ID is one of the allowed tier price IDs
        const allowedPriceIds = [
            priceTier1Id,
            priceTier2Id,
            priceTier3Id
        ].filter(Boolean); // Filter out undefined values
        // Skip validation if no price IDs are configured (for development/testing)
        if (allowedPriceIds.length > 0 && !allowedPriceIds.includes(priceId)) {
            return res.status(400).json({
                success: false,
                message: 'Bad Request: Invalid price ID'
            });
        }
        // Create subscription
        const subscriptionResult = await BillingService.createSubscription(orgId, priceId);
        // Return subscription details
        return res.status(200).json({
            success: true,
            ...subscriptionResult
        });
    }
    catch (error) {
        console.error('Error creating subscription:', error);
        return res.status(500).json({
            success: false,
            message: `Failed to create subscription: ${error instanceof Error ? error.message : String(error)}`
        });
    }
}
//# sourceMappingURL=create-subscription.js.map