import { queryMainDb } from '../../../../config/db';
import { LocationResponse } from '../../types';
import logger from '../../../../utils/logger';

/**
 * List locations assigned to a user
 * @param userId User ID
 * @param orgId Organization ID (for authorization)
 * @returns Promise with locations list
 */
export async function listUserLocations(userId: number, orgId: number): Promise<LocationResponse[]> {
  try {
    // First, verify the user belongs to the organization
    const userCheck = await queryMainDb(
      `SELECT id FROM users 
       WHERE id = $1 AND organization_id = $2`,
      [userId, orgId]
    );
    
    if (userCheck.rows.length === 0) {
      throw new Error(`User ${userId} not found or not authorized`);
    }
    
    // Get locations assigned to the user
    const result = await queryMainDb(
      `SELECT l.* FROM locations l
       JOIN user_locations ul ON l.id = ul.location_id
       WHERE ul.user_id = $1 AND l.organization_id = $2
       ORDER BY l.name ASC`,
      [userId, orgId]
    );
    
    return result.rows;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Error in listUserLocations', {
      error: errorMessage,
      userId,
      orgId
    });
    throw error;
  }
}