"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unassignUserFromLocation = unassignUserFromLocation;
const db_1 = require("../../../config/db");
/**
 * Unassign a user from a location
 * @param userId User ID
 * @param locationId Location ID
 * @param orgId Organization ID (for authorization)
 * @returns Promise with success status
 */
async function unassignUserFromLocation(userId, locationId, orgId) {
    const client = await (0, db_1.getMainDbClient)();
    try {
        await client.query('BEGIN');
        // Verify the user belongs to the organization
        const userCheck = await client.query(`SELECT id FROM users 
       WHERE id = $1 AND organization_id = $2`, [userId, orgId]);
        if (userCheck.rows.length === 0) {
            throw new Error(`User ${userId} not found or not authorized`);
        }
        // Verify the location belongs to the organization
        const locationCheck = await client.query(`SELECT id FROM locations 
       WHERE id = $1 AND organization_id = $2`, [locationId, orgId]);
        if (locationCheck.rows.length === 0) {
            throw new Error(`Location ${locationId} not found or not authorized`);
        }
        // Delete the assignment
        const result = await client.query(`DELETE FROM user_locations 
       WHERE user_id = $1 AND location_id = $2
       RETURNING id`, [userId, locationId]);
        await client.query('COMMIT');
        return result.rowCount !== null && result.rowCount > 0;
    }
    catch (error) {
        await client.query('ROLLBACK');
        console.error('Error in unassignUserFromLocation:', error);
        throw error;
    }
    finally {
        client.release();
    }
}
//# sourceMappingURL=unassign-user-from-location.js.map