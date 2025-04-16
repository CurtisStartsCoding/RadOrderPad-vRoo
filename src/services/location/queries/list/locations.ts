import { queryMainDb } from '../../../../config/db';
import { LocationResponse } from '../../types';

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
    console.error('Error in listLocations:', error);
    throw error;
  }
}