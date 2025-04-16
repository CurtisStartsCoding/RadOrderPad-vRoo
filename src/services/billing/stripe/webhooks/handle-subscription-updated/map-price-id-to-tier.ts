/**
 * Map Stripe price ID to subscription tier
 * 
 * @param priceId Stripe price ID
 * @returns Subscription tier string
 */
export function mapPriceIdToTier(priceId: string): string {
  // In a real implementation, this mapping would be stored in a database
  // or configuration file
  const priceTierMap: Record<string, string> = {
    'price_tier1_monthly': 'tier_1',
    'price_tier2_monthly': 'tier_2',
    'price_tier3_monthly': 'tier_3',
    // Add more mappings as needed
  };
  
  return priceTierMap[priceId] || 'tier_1'; // Default to tier_1 if not found
}