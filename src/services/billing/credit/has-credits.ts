import { getMainDbClient } from '../../../config/db';
import logger from '../../../utils/logger';

/**
 * Check if an organization has sufficient credits
 * 
 * @param organizationId Organization ID
 * @returns Promise<boolean> True if the organization has credits, false otherwise
 * @throws Error if the organization is not found or there's a database error
 */
export async function hasCredits(organizationId: number): Promise<boolean> {
  try {
    const client = await getMainDbClient();
    
    const result = await client.query(
      'SELECT credit_balance FROM organizations WHERE id = $1',
      [organizationId]
    );
    
    client.release();
    
    if (result.rows.length === 0) {
      throw new Error(`Organization ${organizationId} not found`);
    }
    
    return result.rows[0].credit_balance > 0;
  } catch (error) {
    logger.error('Error checking credits:', { error, organizationId });
    throw error;
  }
}