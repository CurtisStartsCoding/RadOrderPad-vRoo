/**
 * Utility function to replenish credits for an organization based on their subscription tier
 * 
 * This function updates an organization's credit balance based on their subscription tier.
 * It's typically called when a subscription payment is successful.
 */

import { queryMainDb } from '../../config/db';
import { getTierCreditAllocation } from './map-price-id-to-tier';

/**
 * Replenishes credits for an organization based on their subscription tier
 * 
 * @param organizationId - The ID of the organization to replenish credits for
 * @param tier - The subscription tier of the organization
 * @param client - Optional database client for transaction support
 * @returns The number of credits allocated
 */
export async function replenishCreditsForTier(
  organizationId: number,
  tier: string,
  client?: any
): Promise<number> {
  // Get the credit allocation for the tier
  const creditAllocation = getTierCreditAllocation(tier);
  
  // If no credits are allocated for this tier, return 0
  if (creditAllocation <= 0) {
    return 0;
  }
  
  // Update the organization's credit balance
  const query = `
    UPDATE organizations
    SET credit_balance = $1,
        updated_at = NOW()
    WHERE id = $2
    RETURNING credit_balance
  `;
  
  try {
    // Use the provided client if available (for transactions), otherwise use queryMainDb
    const result = client 
      ? await client.query(query, [creditAllocation, organizationId])
      : await queryMainDb(query, [creditAllocation, organizationId]);
    
    // Return the new credit balance
    return result.rows[0]?.credit_balance || 0;
  } catch (error) {
    console.error(`Error replenishing credits for organization ${organizationId}:`, error);
    throw error;
  }
}