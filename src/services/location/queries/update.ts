import { queryMainDb } from '../../../config/db';
import { LocationData, LocationResponse } from '../types';
import logger from '../../../utils/logger';

// Define a type for the filtered data
interface FilteredLocationData {
  [key: string]: string | number | boolean | null;
}

/**
 * Update a location
 * @param locationId Location ID
 * @param orgId Organization ID (for authorization)
 * @param locationData Location data to update
 * @returns Promise with updated location
 * @throws Error if location not found or not authorized
 */
export async function updateLocation(
  locationId: number, 
  orgId: number, 
  locationData: LocationData
): Promise<LocationResponse> {
  try {
    logger.debug('Updating location', { locationId, orgId });
    
    // First check if the location exists and belongs to the organization
    const checkQuery = `
      SELECT id FROM locations 
      WHERE id = $1 AND organization_id = $2 AND is_active = true
    `;
    
    const checkResult = await queryMainDb(checkQuery, [locationId, orgId]);
    
    if (checkResult.rowCount === 0) {
      logger.warn('Location not found or not authorized', { locationId, orgId });
      throw new Error('Location not found or not authorized');
    }
    
    // Define allowed fields to update
    const allowedFields = [
      'name',
      'address_line1',
      'address_line2',
      'city',
      'state',
      'zip_code',
      'phone_number'
    ];
    
    // Filter out any fields that are not allowed to be updated
    const filteredData: FilteredLocationData = {};
    for (const field of allowedFields) {
      if (field in locationData) {
        // Use type assertion with unknown as intermediate step
        const value = (locationData as unknown as Record<string, unknown>)[field];
        if (value !== undefined) {
          filteredData[field] = value as string | number | boolean | null;
        }
      }
    }
    
    // Build the update query manually
    const setClauses: string[] = [];
    const queryParams: (string | number | boolean | null)[] = [];
    let paramIndex = 1;
    
    // Add each field to the SET clause
    Object.keys(filteredData).forEach(key => {
      setClauses.push(`${key} = $${paramIndex}`);
      queryParams.push((filteredData as FilteredLocationData)[key]);
      paramIndex++;
    });
    
    // Add updated_at timestamp
    setClauses.push(`updated_at = NOW()`);
    
    // Add WHERE conditions
    queryParams.push(locationId);
    queryParams.push(orgId);
    
    const updateQuery = `
      UPDATE locations
      SET ${setClauses.join(', ')}
      WHERE id = $${paramIndex++} AND organization_id = $${paramIndex}
    `;
    
    // Execute the update query
    await queryMainDb(updateQuery, queryParams);
    
    // Get the updated location
    const getQuery = `
      SELECT * FROM locations 
      WHERE id = $1 AND organization_id = $2
    `;
    
    const getResult = await queryMainDb(getQuery, [locationId, orgId]);
    
    logger.debug('Location updated successfully', { locationId });
    return getResult.rows[0] as LocationResponse;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Error updating location', { 
      error: errorMessage, 
      locationId, 
      orgId 
    });
    throw error;
  }
}