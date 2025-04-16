"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listLocations = listLocations;
const db_1 = require("../../config/db");
/**
 * List locations for an organization
 * @param orgId Organization ID
 * @returns Promise with locations list
 */
async function listLocations(orgId) {
    try {
        const result = await (0, db_1.queryMainDb)(`SELECT * FROM locations 
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