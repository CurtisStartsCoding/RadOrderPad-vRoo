"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLocation = getLocation;
const db_1 = require("../../config/db");
/**
 * Get a location by ID
 * @param locationId Location ID
 * @param orgId Organization ID (for authorization)
 * @returns Promise with location details
 */
async function getLocation(locationId, orgId) {
    try {
        const result = await (0, db_1.queryMainDb)(`SELECT * FROM locations 
       WHERE id = $1 AND organization_id = $2`, [locationId, orgId]);
        if (result.rows.length === 0) {
            throw new Error(`Location ${locationId} not found or not authorized`);
        }
        return result.rows[0];
    }
    catch (error) {
        console.error('Error in getLocation:', error);
        throw error;
    }
}
//# sourceMappingURL=get-location.js.map