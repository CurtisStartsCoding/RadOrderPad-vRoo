/**
 * Apply pagination to the query
 * @param query Current query string
 * @param params Current query parameters
 * @param paramIndex Current parameter index
 * @param page Page number
 * @param limit Items per page
 * @returns Updated query, params, and paramIndex
 */
declare function applyPagination(query: string, params: any[], paramIndex: number, page?: number, limit?: number): {
    query: string;
    params: any[];
    paramIndex: number;
};
export { applyPagination };
