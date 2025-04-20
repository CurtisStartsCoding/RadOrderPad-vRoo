"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLocation = createLocation;
const queries_1 = require("../queries");
/**
 * Create a new location for an organization
 * @param orgId Organization ID
 * @param locationData Location data
 * @returns Promise with created location
 */
async function createLocation(orgId, locationData) {
    return (0, queries_1.createLocation)(orgId, locationData);
}
//# sourceMappingURL=create-location.js.map