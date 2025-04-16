"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildCountQuery = buildCountQuery;
const models_1 = require("../../../../models");
/**
 * Build the count query for pagination
 * @param orgId Radiology organization ID
 * @param filters Filter parameters
 * @returns Object containing the query string and parameters
 */
function buildCountQuery(orgId, filters = {}) {
    // Build the count query
    let countQuery = `
    SELECT COUNT(*) as total
    FROM orders o
    WHERE o.radiology_organization_id = $1
    AND o.status = $2
  `;
    const countParams = [orgId, filters.status || models_1.OrderStatus.PENDING_RADIOLOGY];
    // Add the same filters as the main query
    let countParamIndex = 3;
    if (filters.referringOrgId) {
        countQuery += ` AND o.referring_organization_id = $${countParamIndex}`;
        countParams.push(filters.referringOrgId);
        countParamIndex++;
    }
    if (filters.priority) {
        countQuery += ` AND o.priority = $${countParamIndex}`;
        countParams.push(filters.priority);
        countParamIndex++;
    }
    if (filters.modality) {
        countQuery += ` AND o.modality = $${countParamIndex}`;
        countParams.push(filters.modality);
        countParamIndex++;
    }
    if (filters.startDate) {
        countQuery += ` AND o.created_at >= $${countParamIndex}`;
        countParams.push(filters.startDate.toISOString());
        countParamIndex++;
    }
    if (filters.endDate) {
        countQuery += ` AND o.created_at <= $${countParamIndex}`;
        countParams.push(filters.endDate.toISOString());
        countParamIndex++;
    }
    if (filters.validationStatus) {
        countQuery += ` AND o.final_validation_status = $${countParamIndex}`;
        countParams.push(filters.validationStatus);
        countParamIndex++;
    }
    return { query: countQuery, params: countParams };
}
exports.default = buildCountQuery;
//# sourceMappingURL=count-query-builder.js.map