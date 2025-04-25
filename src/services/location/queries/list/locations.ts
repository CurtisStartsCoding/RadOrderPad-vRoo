import { queryMainDb } from '../../../../config/db';
import { LocationResponse } from '../../types';
import logger from '../../../../utils/logger';

/**
 * List locations for an organization
 * @param orgId Organization ID
 * @returns Promise with locations list
 */
export async function listLocations(orgId: number): Promise<LocationResponse[]> {
  try {
    const result = await queryMainDb(
      `SELECT * FROM locations 
       WHERE organization_id = $1
       ORDER BY name ASC`,
      [orgId]
    );
    
    return result.rows;
  } catch (error) {
    logger.error('Error in listLocations query:', {
      error,
      orgId
    });
    throw error;
  }
}