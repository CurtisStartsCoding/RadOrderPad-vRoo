import { queryMainDb } from '../../config/db';
import enhancedLogger from '../../utils/enhanced-logger';

/**
 * Get the credit balance for an organization
 * 
 * @param orgId Organization ID
 * @returns Promise with the credit balance or null if organization not found
 */
export async function getCreditBalance(orgId: number): Promise<{ creditBalance: number } | null> {
  try {
    // Query the organizations table to get the credit_balance
    const query = `
      SELECT credit_balance 
      FROM organizations 
      WHERE id = $1
    `;
    
    const result = await queryMainDb(query, [orgId]);
    
    // If no organization found, return null
    if (result.rows.length === 0) {
      enhancedLogger.warn('Organization not found when getting credit balance', { orgId });
      return null;
    }
    
    // Return the credit balance
    const creditBalance = result.rows[0].credit_balance;
    
    enhancedLogger.info('Retrieved credit balance for organization', { 
      orgId, 
      creditBalance 
    });
    
    return { creditBalance };
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