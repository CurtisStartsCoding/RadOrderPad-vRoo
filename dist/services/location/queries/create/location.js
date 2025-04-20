import { queryMainDb } from '../../../../config/db';
/**
 * Create a new location for an organization
 * @param orgId Organization ID
 * @param locationData Location data
 * @returns Promise with created location
 */
export async function createLocation(orgId, locationData) {
    try {
        // Validate required fields
        if (!locationData.name) {
            throw new Error('Location name is required');
        }
        const result = await queryMainDb(`INSERT INTO locations
       (organization_id, name, address_line1, address_line2, city, state, zip_code, phone_number, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true)
       RETURNING *`, [
            orgId,
            locationData.name,
            locationData.address_line1 || null,
            locationData.address_line2 || null,
            locationData.city || null,
            locationData.state || null,
            locationData.zip_code || null,
            locationData.phone_number || null
        ]);
        return result.rows[0];
    }
    catch (error) {
        console.error('Error in createLocation:', error);
        throw error;
    }
}
//# sourceMappingURL=location.js.map