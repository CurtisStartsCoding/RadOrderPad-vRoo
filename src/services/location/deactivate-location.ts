import { queryMainDb } from '../../config/db';

/**
 * Deactivate a location (soft delete)
 * @param locationId Location ID
 * @param orgId Organization ID (for authorization)
 * @returns Promise with success status
 */
export async function deactivateLocation(locationId: number, orgId: number): Promise<boolean> {
  try {
    // First, verify the location belongs to the organization
    const checkResult = await queryMainDb(
      `SELECT id FROM locations 
       WHERE id = $1 AND organization_id = $2`,
      [locationId, orgId]
    );
    
    if (checkResult.rows.length === 0) {
      throw new Error(`Location ${locationId} not found or not authorized`);
    }
    
    // Deactivate the location
    const result = await queryMainDb(
      `UPDATE locations
       SET is_active = false, updated_at = NOW()
       WHERE id = $1 AND organization_id = $2
       RETURNING id`,
      [locationId, orgId]
    );
    
    return result.rows.length > 0;
  } catch (error) {
    console.error('Error in deactivateLocation:', error);
    throw error;
  }
}