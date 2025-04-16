"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapPriceIdToTier = mapPriceIdToTier;
/**
 * Map Stripe price ID to subscription tier
 *
 * @param priceId Stripe price ID
 * @returns Subscription tier string
 */
function mapPriceIdToTier(priceId) {
    // In a real implementation, this mapping would be stored in a database
    // or configuration file
    const priceTierMap = {
        'price_tier1_monthly': 'tier_1',
        'price_tier2_monthly': 'tier_2',
        'price_tier3_monthly': 'tier_3',
        // Add more mappings as needed
    };
    return priceTierMap[priceId] || 'tier_1'; // Default to tier_1 if not found
}
//# sourceMappingURL=map-price-id-to-tier.js.map