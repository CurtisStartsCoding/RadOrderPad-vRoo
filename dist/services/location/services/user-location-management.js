"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listUserLocations = listUserLocations;
exports.assignUserToLocation = assignUserToLocation;
exports.unassignUserFromLocation = unassignUserFromLocation;
const queries_1 = require("../queries");
/**
 * List locations assigned to a user
 * @param userId User ID
 * @param orgId Organization ID (for authorization)
 * @returns Promise with locations list
 */
async function listUserLocations(userId, orgId) {
    return (0, queries_1.listUserLocations)(userId, orgId);
}
/**
 * Assign a user to a location
 * @param userId User ID
 * @param locationId Location ID
 * @param orgId Organization ID (for authorization)
 * @returns Promise with success status
 */
async function assignUserToLocation(userId, locationId, orgId) {
    return (0, queries_1.assignUserToLocation)(userId, locationId, orgId);
}
/**
 * Unassign a user from a location
 * @param userId User ID
 * @param locationId Location ID
 * @param orgId Organization ID (for authorization)
 * @returns Promise with success status
 */
async function unassignUserFromLocation(userId, locationId, orgId) {
    return (0, queries_1.unassignUserFromLocation)(userId, locationId, orgId);
}
//# sourceMappingURL=user-location-management.js.map