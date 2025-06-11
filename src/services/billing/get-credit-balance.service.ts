import { queryMainDb } from '../../config/db';
import enhancedLogger from '../../utils/enhanced-logger';

export interface CreditBalanceResponse {
  creditBalance?: number;
  basicCreditBalance?: number;
  advancedCreditBalance?: number;
  organizationType?: string;
}

/**
 * Get the credit balance(s) for an organization
 * Returns different balances based on organization type
 * 
 * @param orgId Organization ID
 * @returns Promise with the credit balance(s) or null if organization not found
 */
export async function getCreditBalance(orgId: number): Promise<CreditBalanceResponse | null> {
  try {
    // Query the organizations table to get all credit balances and type
    const query = `
      SELECT 
        type,
        credit_balance,
        basic_credit_balance,
        advanced_credit_balance
      FROM organizations 
      WHERE id = $1
    `;
    
    const result = await queryMainDb(query, [orgId]);
    
    // If no organization found, return null
    if (result.rows.length === 0) {
      enhancedLogger.warn('Organization not found when getting credit balance', { orgId });
      return null;
    }
    
    const org = result.rows[0];
    
    // Build response based on organization type
    const response: CreditBalanceResponse = {
      organizationType: org.type
    };
    
    if (org.type === 'referring' || org.type === 'referring_practice') {
      // Referring organizations use single credit balance
      response.creditBalance = org.credit_balance;
      
      enhancedLogger.info('Retrieved credit balance for referring organization', { 
        orgId, 
        creditBalance: org.credit_balance,
        type: org.type
      });
    } else if (org.type === 'radiology' || org.type === 'radiology_group') {
      // Radiology organizations use dual credit balances
      response.basicCreditBalance = org.basic_credit_balance;
      response.advancedCreditBalance = org.advanced_credit_balance;
      
      enhancedLogger.info('Retrieved dual credit balances for radiology organization', { 
        orgId, 
        basicCreditBalance: org.basic_credit_balance,
        advancedCreditBalance: org.advanced_credit_balance,
        type: org.type
      });
    } else {
      // Unknown organization type - return all balances
      response.creditBalance = org.credit_balance;
      response.basicCreditBalance = org.basic_credit_balance;
      response.advancedCreditBalance = org.advanced_credit_balance;
      
      enhancedLogger.warn('Unknown organization type, returning all credit balances', { 
        orgId,
        type: org.type
      });
    }
    
    return response;
  } catch (error) {
    // Log the error
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    enhancedLogger.error('Error getting credit balance', { 
      error: errorMessage, 
      orgId 
    });
    
    // Re-throw the error to be handled by the controller
    throw error;
  }
}