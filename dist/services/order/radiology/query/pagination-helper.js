/**
 * Create pagination result object
 * @param totalCount Total number of items
 * @param page Current page number
 * @param limit Items per page
 * @returns Pagination result object
 */
export function createPaginationResult(totalCount, page, limit) {
    return {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit)
    };
}
export default createPaginationResult;
//# sourceMappingURL=pagination-helper.js.map