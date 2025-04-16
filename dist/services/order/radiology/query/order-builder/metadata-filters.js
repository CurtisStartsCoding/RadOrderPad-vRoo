"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyPriorityFilter = applyPriorityFilter;
exports.applyModalityFilter = applyModalityFilter;
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
/**
 * Apply modality filter to the query
 * @param query Current query string
 * @param params Current query parameters
 * @param paramIndex Current parameter index
 * @param modality Modality to filter by
 * @returns Updated query, params, and paramIndex
 */
function applyModalityFilter(query, params, paramIndex, modality) {
    if (modality) {
        query += ` AND o.modality = $${paramIndex}`;
        params.push(modality);
        paramIndex++;
    }
    return { query, params, paramIndex };
}
//# sourceMappingURL=metadata-filters.js.map