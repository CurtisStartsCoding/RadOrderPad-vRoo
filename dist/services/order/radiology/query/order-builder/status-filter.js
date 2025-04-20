"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyStatusFilter = applyStatusFilter;
const models_1 = require("../../../../../models");
/**
 * Apply status filter to the query
 * @param query Current query string
 * @param params Current query parameters
 * @param paramIndex Current parameter index
 * @param status Status to filter by
 * @returns Updated query, params, and paramIndex
 */
function applyStatusFilter(query, params, paramIndex, status) {
    if (status) {
        query += ` AND o.status = $${paramIndex}`;
        params.push(status);
        paramIndex++;
    }
    else {
        query += ` AND o.status = $${paramIndex}`;
        params.push(models_1.OrderStatus.PENDING_RADIOLOGY);
        paramIndex++;
    }
    return { query, params, paramIndex };
}
exports.default = applyStatusFilter;
//# sourceMappingURL=status-filter.js.map