"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyModalityFilter = applyModalityFilter;
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
//# sourceMappingURL=apply-modality-filter.js.map