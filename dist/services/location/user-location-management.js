"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listUserLocations = listUserLocations;
exports.assignUserToLocation = assignUserToLocation;
exports.unassignUserFromLocation = unassignUserFromLocation;
const db_1 = require("../../config/db");
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
/**
 * Assign a user to a location
 * @param userId User ID
 * @param locationId Location ID
 * @param orgId Organization ID (for authorization)
 * @returns Promise with success status
 */
async function assignUserToLocation(userId, locationId, orgId) {
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
        // Check if the assignment already exists
        const existingCheck = await client.query(`SELECT id FROM user_locations 
       WHERE user_id = $1 AND location_id = $2`, [userId, locationId]);
        if (existingCheck.rows.length > 0) {
            // Assignment already exists, consider this a success
            await client.query('COMMIT');
            return true;
        }
        // Create the assignment
        await client.query(`INSERT INTO user_locations (user_id, location_id)
       VALUES ($1, $2)`, [userId, locationId]);
        await client.query('COMMIT');
        return true;
    }
    catch (error) {
        await client.query('ROLLBACK');
        console.error('Error in assignUserToLocation:', error);
        throw error;
    }
    finally {
        client.release();
    }
}
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
//# sourceMappingURL=user-location-management.js.map