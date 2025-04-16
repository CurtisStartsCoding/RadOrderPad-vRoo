"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = require("../services");
/**
 * Manager for user-location operations
 */
class UserLocationManager {
    /**
     * List locations assigned to a user
     * @param userId User ID
     * @param orgId Organization ID (for authorization)
     * @returns Promise with locations list
     */
    async listUserLocations(userId, orgId) {
        return (0, services_1.listUserLocations)(userId, orgId);
    }
    /**
     * Assign a user to a location
     * @param userId User ID
     * @param locationId Location ID
     * @param orgId Organization ID (for authorization)
     * @returns Promise with success status
     */
    async assignUserToLocation(userId, locationId, orgId) {
        return (0, services_1.assignUserToLocation)(userId, locationId, orgId);
    }
    /**
     * Unassign a user from a location
     * @param userId User ID
     * @param locationId Location ID
     * @param orgId Organization ID (for authorization)
     * @returns Promise with success status
     */
    async unassignUserFromLocation(userId, locationId, orgId) {
        return (0, services_1.unassignUserFromLocation)(userId, locationId, orgId);
    }
}
exports.default = new UserLocationManager();
//# sourceMappingURL=user-location-manager.js.map