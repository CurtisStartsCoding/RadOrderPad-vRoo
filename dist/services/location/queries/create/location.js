"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLocation = createLocation;
const db_1 = require("../../../../config/db");
const logger_1 = __importDefault(require("../../../../utils/logger"));
/**
 * Create a new location for an organization
 * @param orgId Organization ID
 * @param locationData Location data
 * @returns Promise with created location
 */
async function createLocation(orgId, locationData) {
    try {
        // Validate required fields
        if (!locationData.name) {
            throw new Error('Location name is required');
        }
        const result = await (0, db_1.queryMainDb)(`INSERT INTO locations
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
        logger_1.default.error('Error in createLocation query:', {
            error,
            orgId,
            locationName: locationData.name
        });
        throw error;
    }
}
//# sourceMappingURL=location.js.map