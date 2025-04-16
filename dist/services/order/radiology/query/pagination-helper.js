"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPaginationResult = createPaginationResult;
/**
 * Create pagination result object
 * @param totalCount Total number of items
 * @param page Current page number
 * @param limit Items per page
 * @returns Pagination result object
 */
function createPaginationResult(totalCount, page, limit) {
    return {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit)
    };
}
exports.default = createPaginationResult;
//# sourceMappingURL=pagination-helper.js.map