"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applySorting = applySorting;
/**
 * Apply sorting to the query
 * @param query Current query string
 * @param sortBy Column to sort by
 * @param sortOrder Sort order (asc or desc)
 * @returns Updated query string
 */
function applySorting(query, sortBy, sortOrder) {
    if (sortBy) {
        const validSortColumns = [
            'created_at', 'priority', 'modality', 'final_validation_status', 'patient_name'
        ];
        const validatedSortBy = validSortColumns.includes(sortBy)
            ? sortBy
            : 'created_at';
        const validatedSortOrder = sortOrder === 'asc' ? 'ASC' : 'DESC';
        query += ` ORDER BY o.${validatedSortBy} ${validatedSortOrder}`;
    }
    else {
        // Default sorting: priority DESC (STAT first), then created_at DESC (newest first)
        query += ` ORDER BY 
      CASE WHEN o.priority = 'stat' THEN 0 ELSE 1 END,
      CASE WHEN o.final_validation_status = 'override' THEN 0 ELSE 1 END,
      o.created_at DESC`;
    }
    return query;
}
//# sourceMappingURL=sorting.js.map