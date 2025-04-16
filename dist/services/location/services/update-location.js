"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLocation = updateLocation;
const queries_1 = require("../queries");
/**
 * Update a location
 * @param locationId Location ID
 * @param orgId Organization ID (for authorization)
 * @param locationData Location data to update
 * @returns Promise with updated location
 */
async function updateLocation(locationId, orgId, locationData) {
    return (0, queries_1.updateLocation)(locationId, orgId, locationData);
}
//# sourceMappingURL=update-location.js.map