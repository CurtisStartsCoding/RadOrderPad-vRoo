import { queryMainDb } from '../../../config/db';
import { LocationResponse } from '../types';
import logger from '../../../utils/logger';

/**
 * Get a location by ID
 * @param locationId Location ID
 * @param orgId Organization ID (for authorization)
 * @returns Promise with location details
 * @throws Error if location not found or not authorized
 */
export async function getLocation(locationId: number, orgId: number): Promise<LocationResponse> {
  try {
    logger.debug('Getting location details', { locationId, orgId });
    
    const query = `
      SELECT * FROM locations 
      WHERE id = $1 AND organization_id = $2 AND is_active = true
    `;
    
    const result = await queryMainDb(query, [locationId, orgId]);
    
    if (result.rowCount === 0) {
      logger.warn('Location not found or not authorized', { locationId, orgId });
      throw new Error('Location not found or not authorized');
    }
    
    logger.debug('Location found', { locationId });
    return result.rows[0] as LocationResponse;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Error getting location', { 
      error: errorMessage, 
      locationId, 
      orgId 
    });
    throw error;
  }
}