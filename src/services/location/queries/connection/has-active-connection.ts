import { queryMainDb } from '../../../../config/db';
import logger from '../../../../utils/logger';

/**
 * Check if two organizations have an active connection
 * @param org1Id First organization ID
 * @param org2Id Second organization ID
 * @returns Promise<boolean> indicating if active connection exists
 */
export async function hasActiveConnection(
  org1Id: number,
  org2Id: number
): Promise<boolean> {
  try {
    const result = await queryMainDb(
      `SELECT id, status FROM organization_relationships 
       WHERE (organization_id = $1 AND related_organization_id = $2)
       OR (organization_id = $2 AND related_organization_id = $1)`,
      [org1Id, org2Id]
    );
    
    return result.rows.length > 0 && result.rows[0].status === 'active';
  } catch (error) {
    logger.error('Error checking active connection:', {
      error,
      org1Id,
      org2Id
    });
    throw error;
  }
}