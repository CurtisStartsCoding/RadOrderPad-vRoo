"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listUserLocations = listUserLocations;
const db_1 = require("../../../config/db");
/**
 * List locations assigned to a user
 * @param userId User ID
 * @param orgId Organization ID (for authorization)
 * @returns Promise with locations list
 */
async function listUserLocations(userId, orgId) {
    try {
        // First, verify the user belongs to the organization
        const userCheck = await (0, db_1.queryMainDb)(`SELECT id FROM users 
       WHERE id = $1 AND organization_id = $2`, [userId, orgId]);
        if (userCheck.rows.length === 0) {
            throw new Error(`User ${userId} not found or not authorized`);
        }
        // Get locations assigned to the user
        const result = await (0, db_1.queryMainDb)(`SELECT l.* FROM locations l
       JOIN user_locations ul ON l.id = ul.location_id
       WHERE ul.user_id = $1 AND l.organization_id = $2
       ORDER BY l.name ASC`, [userId, orgId]);
        return result.rows;
    }
    catch (error) {
        console.error('Error in listUserLocations:', error);
        throw error;
    }
}
//# sourceMappingURL=list-user-locations.js.map