import { getMainDbClient } from '../../../config/db';
import config from '../../../config/config';
import { InsufficientCreditsError } from '../errors';
import { CreditActionType } from '../types';
import logger from '../../../utils/logger';
import { isAdvancedImaging } from '../usage/orderCategorization';

export type CreditType = 'referring_credit' | 'radiology_basic' | 'radiology_advanced';

export interface BurnCreditEnhancedParams {
  organizationId: number;
  userId: number;
  orderId: number;
  actionType: CreditActionType;
  organizationType?: 'referring' | 'referring_practice' | 'radiology' | 'radiology_group';
  orderDetails?: {
    modality?: string;
    cptCodes?: string[];
  };
}

/**
 * Enhanced credit burning function that supports dual credits for radiology organizations
 * 
 * For referring organizations: Burns from credit_balance
 * For radiology organizations: Burns from basic_credit_balance or advanced_credit_balance based on imaging type
 * 
 * @param params Enhanced parameters including organization type and order details
 * @returns Promise<boolean> True if successful
 * @throws InsufficientCreditsError if the organization has insufficient credits
 */
export async function burnCreditEnhanced(params: BurnCreditEnhancedParams): Promise<boolean> {
  const { organizationId, userId, orderId, actionType, organizationType, orderDetails } = params;
  
  // Check if billing test mode is enabled
  if (config.testMode.billing) {
    logger.info(`[TEST MODE] Credit burn skipped for organization ${organizationId}, action: ${actionType}`, {
      organizationId,
      userId,
      orderId,
      actionType,
      organizationType,
      testMode: true
    });
    return true;
  }
  
  // Get a client for transaction
  const client = await getMainDbClient();
  
  try {
    // Start transaction
    await client.query('BEGIN');
    
    // Determine organization type if not provided
    let orgType = organizationType;
    if (!orgType) {
      const orgResult = await client.query(
        'SELECT type FROM organizations WHERE id = $1',
        [organizationId]
      );
      
      if (orgResult.rows.length === 0) {
        throw new Error(`Organization ${organizationId} not found`);
      }
      
      orgType = orgResult.rows[0].type;
    }
    
    // Determine credit type and field to update
    let creditType: CreditType;
    let updateQuery: string;
    let creditFieldName: string;
    
    if (orgType === 'referring' || orgType === 'referring_practice') {
      // Referring organizations use single credit type
      creditType = 'referring_credit';
      creditFieldName = 'credit_balance';
      updateQuery = `
        UPDATE organizations 
        SET credit_balance = credit_balance - 1 
        WHERE id = $1 AND credit_balance > 0 
        RETURNING credit_balance as new_balance
      `;
    } else if (orgType === 'radiology' || orgType === 'radiology_group') {
      // Radiology organizations use dual credits
      // Determine if this is advanced imaging
      const isAdvanced = orderDetails ? 
        isAdvancedImaging(orderDetails.modality || null, orderDetails.cptCodes?.[0] || null) : 
        false;
      
      if (isAdvanced) {
        creditType = 'radiology_advanced';
        creditFieldName = 'advanced_credit_balance';
        updateQuery = `
          UPDATE organizations 
          SET advanced_credit_balance = advanced_credit_balance - 1 
          WHERE id = $1 AND advanced_credit_balance > 0 
          RETURNING advanced_credit_balance as new_balance
        `;
      } else {
        creditType = 'radiology_basic';
        creditFieldName = 'basic_credit_balance';
        updateQuery = `
          UPDATE organizations 
          SET basic_credit_balance = basic_credit_balance - 1 
          WHERE id = $1 AND basic_credit_balance > 0 
          RETURNING basic_credit_balance as new_balance
        `;
      }
    } else {
      throw new Error(`Unknown organization type: ${orgType}`);
    }
    
    // Execute the update
    const updateResult = await client.query(updateQuery, [organizationId]);
    
    // Check if the update was successful
    if (updateResult.rowCount === 0) {
      // No rows updated means insufficient credits
      await client.query('ROLLBACK');
      throw new InsufficientCreditsError(
        `Organization ${organizationId} has insufficient ${creditFieldName.replace(/_/g, ' ')}`
      );
    }
    
    // Get the new balance
    const newBalance = updateResult.rows[0].new_balance;
    
    // Log the credit usage
    await client.query(
      `INSERT INTO credit_usage_logs 
       (organization_id, user_id, order_id, tokens_burned, action_type, credit_type) 
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [organizationId, userId, orderId, 1, actionType, creditType]
    );
    
    // Commit transaction
    await client.query('COMMIT');
    
    // Log the action
    logger.info(`[BillingService] Credit burned successfully`, {
      organizationId,
      userId,
      orderId,
      actionType,
      creditType,
      creditFieldName,
      newBalance,
      organizationType: orgType
    });
    
    return true;
  } catch (error) {
    // Rollback transaction on error
    await client.query('ROLLBACK');
    
    // Re-throw InsufficientCreditsError, but wrap other errors
    if (error instanceof InsufficientCreditsError) {
      throw error;
    } else {
      logger.error('Error in burnCreditEnhanced:', {
        error,
        params
      });
      throw new Error(`Failed to burn credit: ${error instanceof Error ? error.message : String(error)}`);
    }
  } finally {
    // Release client back to pool
    client.release();
  }
}

/**
 * Get credit balances for an organization
 * Returns different balance types based on organization type
 */
export async function getCreditBalances(organizationId: number): Promise<{
  organizationType: string;
  creditBalance?: number;
  basicCreditBalance?: number;
  advancedCreditBalance?: number;
}> {
  const client = await getMainDbClient();
  
  try {
    const result = await client.query(
      `SELECT type, credit_balance, basic_credit_balance, advanced_credit_balance 
       FROM organizations 
       WHERE id = $1`,
      [organizationId]
    );
    
    if (result.rows.length === 0) {
      throw new Error(`Organization ${organizationId} not found`);
    }
    
    const org = result.rows[0];
    
    if (org.type === 'referring' || org.type === 'referring_practice') {
      return {
        organizationType: org.type,
        creditBalance: org.credit_balance
      };
    } else {
      return {
        organizationType: org.type,
        basicCreditBalance: org.basic_credit_balance,
        advancedCreditBalance: org.advanced_credit_balance
      };
    }
  } finally {
    client.release();
  }
}