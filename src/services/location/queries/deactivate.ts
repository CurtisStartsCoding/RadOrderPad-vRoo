import { queryMainDb } from '../../../config/db';
import logger from '../../../utils/logger';

/**
 * Deactivate a location (soft delete)
 * @param locationId Location ID
 * @param orgId Organization ID (for authorization)
 * @returns Promise with success status
 */
export async function deactivateLocation(locationId: number, orgId: number): Promise<boolean> {
  try {
    logger.debug('Deactivating location', { locationId, orgId });
    
    // First check if the location exists and belongs to the organization
    const checkQuery = `
      SELECT id FROM locations 
      WHERE id = $1 AND organization_id = $2 AND is_active = true
    `;
    
    const checkResult = await queryMainDb(checkQuery, [locationId, orgId]);
    
    if (checkResult.rowCount === 0) {
      logger.warn('Location not found, not authorized, or already deactivated', { locationId, orgId });
      return false;
    }
    
    // Deactivate the location
    const updateQuery = `
      UPDATE locations
      SET is_active = false, updated_at = NOW()
      WHERE id = $1 AND organization_id = $2
    `;
    
    const updateResult = await queryMainDb(updateQuery, [locationId, orgId]);
    
    const success = updateResult.rowCount !== null && updateResult.rowCount > 0;
    
    if (success) {
      logger.info('Location deactivated successfully', { locationId });
    } else {
      logger.warn('Failed to deactivate location', { locationId, orgId });
    }
    
    return success;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Error deactivating location', { 
      error: errorMessage, 
      locationId, 
      orgId 
    });
    throw error;
  }
}