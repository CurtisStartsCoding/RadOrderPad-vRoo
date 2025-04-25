import { getMainDbClient } from '../../../config/db';
import config from '../../../config/config';
import { InsufficientCreditsError } from '../errors';
import { CreditActionType } from '../types';
import logger from '../../../utils/logger';

/**
 * Record credit usage for an order submission action
 * Decrements the organization's credit balance and logs the usage
 * 
 * @param organizationId Organization ID
 * @param userId User ID
 * @param orderId Order ID
 * @param actionType Action type ('order_submitted')
 * @returns Promise<boolean> True if successful
 * @throws InsufficientCreditsError if the organization has insufficient credits
 */
export async function burnCredit(
  organizationId: number, 
  userId: number, 
  orderId: number, 
  actionType: CreditActionType
): Promise<boolean> {
  // Check if billing test mode is enabled
  if (config.testMode.billing) {
    logger.info(`[TEST MODE] Credit burn skipped for organization ${organizationId}, action: ${actionType}`, {
      organizationId,
      userId,
      orderId,
      actionType,
      testMode: true
    });
    return true;
  }
  
  // Get a client for transaction
  const client = await getMainDbClient();
  
  try {
    // Start transaction
    await client.query('BEGIN');
    
    // 1. Decrement the organization's credit balance
    const updateResult = await client.query(
      `UPDATE organizations 
       SET credit_balance = credit_balance - 1 
       WHERE id = $1 AND credit_balance > 0 
       RETURNING credit_balance`,
      [organizationId]
    );
    
    // Check if the update was successful
    if (updateResult.rowCount === 0) {
      // No rows updated means the organization had insufficient credits
      await client.query('ROLLBACK');
      throw new InsufficientCreditsError(`Organization ${organizationId} has insufficient credits`);
    }
    
    // Get the new credit balance
    const newBalance = updateResult.rows[0].credit_balance;
    
    // Double-check that the balance is not negative (should never happen with the WHERE clause above)
    if (newBalance < 0) {
      await client.query('ROLLBACK');
      throw new InsufficientCreditsError(`Organization ${organizationId} has a negative credit balance`);
    }
    
    // 2. Log the credit usage
    await client.query(
      `INSERT INTO credit_usage_logs 
       (organization_id, user_id, order_id, tokens_burned, action_type) 
       VALUES ($1, $2, $3, $4, $5)`,
      [organizationId, userId, orderId, 1, actionType]
    );
    
    // Commit transaction
    await client.query('COMMIT');
    
    // Log the action (for development purposes)
    logger.info(`[BillingService] Credit burned successfully`, {
      organizationId,
      userId,
      orderId,
      actionType,
      newBalance
    });
    
    return true;
  } catch (error) {
    // Rollback transaction on error
    await client.query('ROLLBACK');
    
    // Re-throw InsufficientCreditsError, but wrap other errors
    if (error instanceof InsufficientCreditsError) {
      throw error;
    } else {
      logger.error('Error in burnCredit:', {
        error,
        organizationId,
        userId,
        orderId,
        actionType
      });
      throw new Error(`Failed to burn credit: ${error instanceof Error ? error.message : String(error)}`);
    }
  } finally {
    // Release client back to pool
    client.release();
  }
}