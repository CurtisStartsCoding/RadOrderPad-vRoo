"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../config/db");
/**
 * Service for handling location operations
 */
class LocationService {
    /**
     * List locations for an organization
     * @param orgId Organization ID
     * @returns Promise with locations list
     */
    async listLocations(orgId) {
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
    async createLocation(orgId, locationData) {
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
    async getLocation(locationId, orgId) {
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
    async updateLocation(locationId, orgId, locationData) {
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
    async deactivateLocation(locationId, orgId) {
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
    /**
     * List locations assigned to a user
     * @param userId User ID
     * @param orgId Organization ID (for authorization)
     * @returns Promise with locations list
     */
    async listUserLocations(userId, orgId) {
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
    async assignUserToLocation(userId, locationId, orgId) {
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
    async unassignUserFromLocation(userId, locationId, orgId) {
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
}
exports.default = new LocationService();
//# sourceMappingURL=location.service.js.map