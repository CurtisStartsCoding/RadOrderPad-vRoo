import { queryMainDb } from '../../config/db';
/**
 * List locations for an organization
 * @param orgId Organization ID
 * @returns Promise with locations list
 */
export async function listLocations(orgId) {
    try {
        const result = await queryMainDb(`SELECT * FROM locations 
       WHERE organization_id = $1
       ORDER BY name ASC`, [orgId]);
        return result.rows;
    }
    catch (error) {
        console.error('Error in listLocations:', error);
        throw error;
    }
}
//# sourceMappingURL=list-locations.js.map