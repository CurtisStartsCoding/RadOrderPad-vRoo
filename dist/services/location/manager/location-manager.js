"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = require("../services");
/**
 * Manager for location operations
 */
class LocationManager {
    /**
     * List locations for an organization
     * @param orgId Organization ID
     * @returns Promise with locations list
     */
    async listLocations(orgId) {
        return (0, services_1.listLocations)(orgId);
    }
    /**
     * Create a new location for an organization
     * @param orgId Organization ID
     * @param locationData Location data
     * @returns Promise with created location
     */
    async createLocation(orgId, locationData) {
        return (0, services_1.createLocation)(orgId, locationData);
    }
    /**
     * Get a location by ID
     * @param locationId Location ID
     * @param orgId Organization ID (for authorization)
     * @returns Promise with location details
     */
    async getLocation(locationId, orgId) {
        return (0, services_1.getLocation)(locationId, orgId);
    }
    /**
     * Update a location
     * @param locationId Location ID
     * @param orgId Organization ID (for authorization)
     * @param locationData Location data to update
     * @returns Promise with updated location
     */
    async updateLocation(locationId, orgId, locationData) {
        return (0, services_1.updateLocation)(locationId, orgId, locationData);
    }
    /**
     * Deactivate a location (soft delete)
     * @param locationId Location ID
     * @param orgId Organization ID (for authorization)
     * @returns Promise with success status
     */
    async deactivateLocation(locationId, orgId) {
        return (0, services_1.deactivateLocation)(locationId, orgId);
    }
}
exports.default = new LocationManager();
//# sourceMappingURL=location-manager.js.map