"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listUserLocations = listUserLocations;
const queries_1 = require("../../queries");
/**
 * List locations assigned to a user
 * @param userId User ID
 * @param orgId Organization ID (for authorization)
 * @returns Promise with locations list
 */
async function listUserLocations(userId, orgId) {
    return (0, queries_1.listUserLocations)(userId, orgId);
}
//# sourceMappingURL=list-user-locations.js.map