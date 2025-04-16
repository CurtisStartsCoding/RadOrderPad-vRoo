"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listLocations = listLocations;
exports.createLocation = createLocation;
exports.getLocation = getLocation;
exports.updateLocation = updateLocation;
exports.deactivateLocation = deactivateLocation;
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
        console.error('Error in createLocation:', error);
        throw error;
    }
}
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
/**
 * Update a location
 * @param locationId Location ID
 * @param orgId Organization ID (for authorization)
 * @param locationData Location data to update
 * @returns Promise with updated location
 */
async function updateLocation(locationId, orgId, locationData) {
    try {
        // Validate required fields
        if (!locationData.name) {
            throw new Error('Location name is required');
        }
        // First, verify the location belongs to the organization
        const checkResult = await (0, db_1.queryMainDb)(`SELECT id FROM locations 
       WHERE id = $1 AND organization_id = $2`, [locationId, orgId]);
        if (checkResult.rows.length === 0) {
            throw new Error(`Location ${locationId} not found or not authorized`);
        }
        // Update the location
        const result = await (0, db_1.queryMainDb)(`UPDATE locations
       SET name = $1, 
           address_line1 = $2, 
           address_line2 = $3, 
           city = $4, 
           state = $5, 
           zip_code = $6, 
           phone_number = $7,
           updated_at = NOW()
       WHERE id = $8 AND organization_id = $9
       RETURNING *`, [
            locationData.name,
            locationData.address_line1 || null,
            locationData.address_line2 || null,
            locationData.city || null,
            locationData.state || null,
            locationData.zip_code || null,
            locationData.phone_number || null,
            locationId,
            orgId
        ]);
        return result.rows[0];
    }
    catch (error) {
        console.error('Error in updateLocation:', error);
        throw error;
    }
}
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
        console.error('Error in deactivateLocation:', error);
        throw error;
    }
}
//# sourceMappingURL=location-management.js.map