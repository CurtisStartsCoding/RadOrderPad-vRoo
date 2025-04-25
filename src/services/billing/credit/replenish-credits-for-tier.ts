import { PoolClient } from 'pg';
import { getMainDbClient } from '../../../config/db';
import logger from '../../../utils/logger';

/**
 * Credit allocation by tier
 * Maps subscription tier to the number of credits included
 */
const TIER_CREDIT_ALLOCATION: Record<string, number> = {
  'tier_1': 500,  // Tier 1: 500 credits per month
  'tier_2': 1500, // Tier 2: 1500 credits per month
  'tier_3': 5000, // Tier 3: 5000 credits per month
};

/**
 * Replenish credits for an organization based on their subscription tier
 * 
 * This function resets the organization's credit balance to the amount
 * included in their subscription tier. It also logs the replenishment
 * in the billing_events table.
 * 
 * @param orgId The organization ID
 * @param tier The subscription tier
 * @param client Optional database client for transaction (if not provided, a new client will be used)
 * @param eventId Optional Stripe event ID for logging
 * @returns Promise that resolves when credits are replenished
 */
export async function replenishCreditsForTier(
  orgId: number,
  tier: string,
  client?: PoolClient,
  eventId?: string
): Promise<void> {
  // Determine credit amount based on tier
  const creditAmount = TIER_CREDIT_ALLOCATION[tier] || 0;
  
  if (creditAmount <= 0) {
    logger.warn(`No credit allocation defined for tier: ${tier}`, { orgId, tier });
    return;
  }
  
  // Use provided client or get a new one
  const shouldReleaseClient = !client;
  const dbClient = client || await getMainDbClient();
  
  try {
    // Start transaction if we created our own client
    if (shouldReleaseClient) {
      await dbClient.query('BEGIN');
    }
    
    // Update the organization's credit balance
    await dbClient.query(
      `UPDATE organizations 
       SET credit_balance = $1 
       WHERE id = $2`,
      [creditAmount, orgId]
    );
    
    // Log the credit replenishment in billing_events
    await dbClient.query(
      `INSERT INTO billing_events 
       (organization_id, event_type, stripe_event_id, description, amount) 
       VALUES ($1, $2, $3, $4, $5)`,
      [
        orgId,
        'credit_replenishment',
        eventId || null,
        `Credits replenished to ${creditAmount} based on ${tier} subscription`,
        creditAmount
      ]
    );
    
    // Commit transaction if we created our own client
    if (shouldReleaseClient) {
      await dbClient.query('COMMIT');
    }
    
    logger.info(`Successfully replenished credits for organization`, {
      orgId,
      tier,
      creditAmount,
      eventId
    });
    
  } catch (error) {
    // Rollback transaction if we created our own client
    if (shouldReleaseClient) {
      await dbClient.query('ROLLBACK');
    }
    
    logger.error('Error replenishing credits:', { error, orgId, tier });
    throw error;
  } finally {
    // Release client if we created our own
    if (shouldReleaseClient && dbClient) {
      dbClient.release();
    }
  }
}