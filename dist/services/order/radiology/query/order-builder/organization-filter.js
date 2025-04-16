"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyReferringOrgFilter = applyReferringOrgFilter;
/**
 * Apply referring organization filter to the query
 * @param query Current query string
 * @param params Current query parameters
 * @param paramIndex Current parameter index
 * @param referringOrgId Referring organization ID to filter by
 * @returns Updated query, params, and paramIndex
 */
function applyReferringOrgFilter(query, params, paramIndex, referringOrgId) {
    if (referringOrgId) {
        query += ` AND o.referring_organization_id = $${paramIndex}`;
        params.push(referringOrgId);
        paramIndex++;
    }
    return { query, params, paramIndex };
}
exports.default = applyReferringOrgFilter;
//# sourceMappingURL=organization-filter.js.map