"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listLocations = listLocations;
const queries_1 = require("../queries");
/**
 * List locations for an organization
 * @param orgId Organization ID
 * @returns Promise with locations list
 */
async function listLocations(orgId) {
    return (0, queries_1.listLocations)(orgId);
}
//# sourceMappingURL=list-locations.js.map