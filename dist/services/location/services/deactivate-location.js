"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivateLocation = deactivateLocation;
const queries_1 = require("../queries");
/**
 * Deactivate a location (soft delete)
 * @param locationId Location ID
 * @param orgId Organization ID (for authorization)
 * @returns Promise with success status
 */
async function deactivateLocation(locationId, orgId) {
    return (0, queries_1.deactivateLocation)(locationId, orgId);
}
//# sourceMappingURL=deactivate-location.js.map