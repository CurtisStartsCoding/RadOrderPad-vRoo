"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyPriorityFilter = applyPriorityFilter;
/**
 * Apply priority filter to the query
 * @param query Current query string
 * @param params Current query parameters
 * @param paramIndex Current parameter index
 * @param priority Priority to filter by
 * @returns Updated query, params, and paramIndex
 */
function applyPriorityFilter(query, params, paramIndex, priority) {
    if (priority) {
        query += ` AND o.priority = $${paramIndex}`;
        params.push(priority);
        paramIndex++;
    }
    return { query, params, paramIndex };
}
//# sourceMappingURL=apply-priority-filter.js.map