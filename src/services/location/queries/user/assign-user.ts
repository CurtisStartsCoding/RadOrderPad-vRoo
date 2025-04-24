import { getMainDbClient } from '../../../../config/db';
import logger from '../../../../utils/logger';

/**
 * Assign a user to a location
 * @param userId User ID
 * @param locationId Location ID
 * @param orgId Organization ID (for authorization)
 * @returns Promise with success status
 */
export async function assignUserToLocation(userId: number, locationId: number, orgId: number): Promise<boolean> {
  const client = await getMainDbClient();
  
  try {
    await client.query('BEGIN');
    
    // Verify the user belongs to the organization
    const userCheck = await client.query(
      `SELECT id FROM users 
       WHERE id = $1 AND organization_id = $2`,
      [userId, orgId]
    );
    
    if (userCheck.rows.length === 0) {
      throw new Error(`User ${userId} not found or not authorized`);
    }
    
    // Verify the location belongs to the organization
    const locationCheck = await client.query(
      `SELECT id FROM locations 
       WHERE id = $1 AND organization_id = $2`,
      [locationId, orgId]
    );
    
    if (locationCheck.rows.length === 0) {
      throw new Error(`Location ${locationId} not found or not authorized`);
    }
    
    // Check if the assignment already exists
    const existingCheck = await client.query(
      `SELECT id FROM user_locations 
       WHERE user_id = $1 AND location_id = $2`,
      [userId, locationId]
    );
    
    if (existingCheck.rows.length > 0) {
      // Assignment already exists, consider this a success
      await client.query('COMMIT');
      return true;
    }
    
    // Create the assignment
    await client.query(
      `INSERT INTO user_locations (user_id, location_id)
       VALUES ($1, $2)`,
      [userId, locationId]
    );
    
    await client.query('COMMIT');
    return true;
  } catch (error) {
    await client.query('ROLLBACK');
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Error in assignUserToLocation', {
      error: errorMessage,
      userId,
      locationId,
      orgId
    });
    throw error;
  } finally {
    client.release();
  }
}