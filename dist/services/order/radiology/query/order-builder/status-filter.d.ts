/**
 * Apply status filter to the query
 * @param query Current query string
 * @param params Current query parameters
 * @param paramIndex Current parameter index
 * @param status Status to filter by
 * @returns Updated query, params, and paramIndex
 */
export declare function applyStatusFilter(query: string, params: (string | number | Date)[], paramIndex: number, status?: string): {
    query: string;
    params: (string | number | Date)[];
    paramIndex: number;
};
export default applyStatusFilter;
