import { queryMainDb } from '../../../../config/db';
/**
 * Update a location
 * @param locationId Location ID
 * @param orgId Organization ID (for authorization)
 * @param locationData Location data to update
 * @returns Promise with updated location
 */
export async function updateLocation(locationId, orgId, locationData) {
    try {
        // Validate required fields
        if (!locationData.name) {
            throw new Error('Location name is required');
        }
        // First, verify the location belongs to the organization
        const checkResult = await queryMainDb(`SELECT id FROM locations 
       WHERE id = $1 AND organization_id = $2`, [locationId, orgId]);
        if (checkResult.rows.length === 0) {
            throw new Error(`Location ${locationId} not found or not authorized`);
        }
        // Update the location
        const result = await queryMainDb(`UPDATE locations
       SET name = $1, 
           address_line1 = $2, 
           address_line2 = $3, 
           city = $4, 
           state = $5, 
           zip_code = $6, 
           phone_number = $7,
           updated_at = NOW()
       WHERE id = $8 AND organization_id = $9
       RETURNING *`, [
            locationData.name,
            locationData.address_line1 || null,
            locationData.address_line2 || null,
            locationData.city || null,
            locationData.state || null,
            locationData.zip_code || null,
            locationData.phone_number || null,
            locationId,
            orgId
        ]);
        return result.rows[0];
    }
    catch (error) {
        console.error('Error in updateLocation:', error);
        throw error;
    }
}
//# sourceMappingURL=location.js.map