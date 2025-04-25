"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapPriceIdToTier = mapPriceIdToTier;
/**
 * Map Stripe price ID to subscription tier
 *
 * This function maps Stripe price IDs to our internal subscription tier names.
 * It includes both monthly and yearly subscription plans.
 *
 * @param priceId Stripe price ID
 * @returns Subscription tier string
 */
const logger_1 = __importDefault(require("../../../../../utils/logger"));
function mapPriceIdToTier(priceId) {
    // Comprehensive mapping of Stripe price IDs to internal tier names
    const priceTierMap = {
        // Monthly plans
        'price_tier1_monthly': 'tier_1',
        'price_tier2_monthly': 'tier_2',
        'price_tier3_monthly': 'tier_3',
        // Yearly plans (discounted)
        'price_tier1_yearly': 'tier_1',
        'price_tier2_yearly': 'tier_2',
        'price_tier3_yearly': 'tier_3',
        // Test price IDs
        'price_test_tier1': 'tier_1',
        'price_test_tier2': 'tier_2',
        'price_test_tier3': 'tier_3',
        // Production price IDs (to be updated with actual Stripe price IDs)
        'price_1AbCdEfGhIjKlMnOpQrStUv': 'tier_1',
        'price_2AbCdEfGhIjKlMnOpQrStUv': 'tier_2',
        'price_3AbCdEfGhIjKlMnOpQrStUv': 'tier_3'
    };
    // Log warning if price ID is not found in the mapping
    if (!priceTierMap[priceId]) {
        logger_1.default.warn(`Unknown Stripe price ID. Defaulting to tier_1.`, { priceId });
    }
    return priceTierMap[priceId] || 'tier_1'; // Default to tier_1 if not found
}
//# sourceMappingURL=map-price-id-to-tier.js.map