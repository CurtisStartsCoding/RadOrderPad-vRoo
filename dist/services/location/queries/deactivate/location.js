"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivateLocation = deactivateLocation;
const db_1 = require("../../../../config/db");
const logger_1 = __importDefault(require("../../../../utils/logger"));
/**
 * Deactivate a location (soft delete)
 * @param locationId Location ID
 * @param orgId Organization ID (for authorization)
 * @returns Promise with success status
 */
async function deactivateLocation(locationId, orgId) {
    try {
        // First, verify the location belongs to the organization
        const checkResult = await (0, db_1.queryMainDb)(`SELECT id FROM locations 
       WHERE id = $1 AND organization_id = $2`, [locationId, orgId]);
        if (checkResult.rows.length === 0) {
            throw new Error(`Location ${locationId} not found or not authorized`);
        }
        // Deactivate the location
        const result = await (0, db_1.queryMainDb)(`UPDATE locations
       SET is_active = false, updated_at = NOW()
       WHERE id = $1 AND organization_id = $2
       RETURNING id`, [locationId, orgId]);
        return result.rows.length > 0;
    }
    catch (error) {
        logger_1.default.error('Error in deactivateLocation query:', {
            error,
            locationId,
            orgId
        });
        throw error;
    }
}
//# sourceMappingURL=location.js.map