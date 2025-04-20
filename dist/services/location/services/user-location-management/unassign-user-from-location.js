"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unassignUserFromLocation = unassignUserFromLocation;
const queries_1 = require("../../queries");
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
//# sourceMappingURL=unassign-user-from-location.js.map