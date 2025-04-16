"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyDateRangeFilter = applyDateRangeFilter;
/**
 * Apply date range filters to the query
 * @param query Current query string
 * @param params Current query parameters
 * @param paramIndex Current parameter index
 * @param startDate Start date to filter by
 * @param endDate End date to filter by
 * @returns Updated query, params, and paramIndex
 */
function applyDateRangeFilter(query, params, paramIndex, startDate, endDate) {
    if (startDate) {
        query += ` AND o.created_at >= $${paramIndex}`;
        params.push(startDate.toISOString());
        paramIndex++;
    }
    if (endDate) {
        query += ` AND o.created_at <= $${paramIndex}`;
        params.push(endDate.toISOString());
        paramIndex++;
    }
    return { query, params, paramIndex };
}
//# sourceMappingURL=date-filters.js.map