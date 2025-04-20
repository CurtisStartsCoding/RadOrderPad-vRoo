"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignUserToLocation = assignUserToLocation;
const queries_1 = require("../../queries");
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
//# sourceMappingURL=assign-user-to-location.js.map