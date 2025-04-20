"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLocation = getLocation;
const queries_1 = require("../queries");
/**
 * Get a location by ID
 * @param locationId Location ID
 * @param orgId Organization ID (for authorization)
 * @returns Promise with location details
 */
async function getLocation(locationId, orgId) {
    return (0, queries_1.getLocation)(locationId, orgId);
}
//# sourceMappingURL=get-location.js.map