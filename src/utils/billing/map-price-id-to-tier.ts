/**
 * Maps Stripe price IDs to subscription tiers
 * 
 * This utility provides a mapping between Stripe price IDs and
 * the corresponding subscription tiers in our system.
 */

// Map of Stripe price IDs to subscription tiers
const PRICE_ID_TO_TIER_MAP: Record<string, string> = {
  // Tier 1 (1-5 Physicians)
  'price_1OXYZabc123def456': 'tier_1',  // Monthly
  'price_1OXYZabc123def457': 'tier_1',  // Annual
  
  // Tier 2 (6-15 Physicians)
  'price_1OXYZabc123def458': 'tier_2',  // Monthly
  'price_1OXYZabc123def459': 'tier_2',  // Annual
  
  // Tier 3 (16+ Physicians)
  'price_1OXYZabc123def460': 'tier_3',  // Monthly
  'price_1OXYZabc123def461': 'tier_3',  // Annual
};

/**
 * Maps a Stripe price ID to the corresponding subscription tier
 * 
 * @param priceId - The Stripe price ID to map
 * @returns The subscription tier or null if not found
 */
export function mapPriceIdToTier(priceId: string): string | null {
  return PRICE_ID_TO_TIER_MAP[priceId] || null;
}

/**
 * Gets the credit allocation for a given subscription tier
 * 
 * @param tier - The subscription tier
 * @returns The number of credits allocated for the tier
 */
export function getTierCreditAllocation(tier: string): number {
  const TIER_CREDIT_ALLOCATION: Record<string, number> = {
    'tier_1': 500,   // Tier 1: 500 credits per month
    'tier_2': 1500,  // Tier 2: 1500 credits per month
    'tier_3': 5000,  // Tier 3: 5000 credits per month
  };
  
  return TIER_CREDIT_ALLOCATION[tier] || 0;
}

/**
 * Gets the subscription tier name for display purposes
 * 
 * @param tier - The subscription tier code
 * @returns The human-readable tier name
 */
export function getTierDisplayName(tier: string): string {
  const TIER_DISPLAY_NAMES: Record<string, string> = {
    'tier_1': 'Basic (1-5 Physicians)',
    'tier_2': 'Standard (6-15 Physicians)',
    'tier_3': 'Premium (16+ Physicians)',
  };
  
  return TIER_DISPLAY_NAMES[tier] || 'Unknown Tier';
}