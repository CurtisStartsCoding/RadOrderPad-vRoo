"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyPagination = applyPagination;
/**
 * Apply pagination to the query
 * @param query Current query string
 * @param params Current query parameters
 * @param paramIndex Current parameter index
 * @param page Page number
 * @param limit Items per page
 * @returns Updated query, params, and paramIndex
 */
function applyPagination(query, params, paramIndex, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);
    // Update paramIndex by 2 since we added two parameters
    paramIndex += 2;
    return { query, params, paramIndex };
}
//# sourceMappingURL=pagination.js.map