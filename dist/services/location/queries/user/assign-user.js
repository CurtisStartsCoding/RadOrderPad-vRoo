"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignUserToLocation = assignUserToLocation;
const db_1 = require("../../../../config/db");
const logger_1 = __importDefault(require("../../../../utils/logger"));
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
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger_1.default.error('Error in assignUserToLocation', {
            error: errorMessage,
            userId,
            locationId,
            orgId
        });
        throw error;
    }
    finally {
        client.release();
    }
}
//# sourceMappingURL=assign-user.js.map