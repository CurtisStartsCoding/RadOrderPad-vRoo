/**
 * Apply priority filter to the query
 * @param query Current query string
 * @param params Current query parameters
 * @param paramIndex Current parameter index
 * @param priority Priority to filter by
 * @returns Updated query, params, and paramIndex
 */
export declare function applyPriorityFilter(query: string, params: (string | number | Date)[], paramIndex: number, priority?: string): {
    query: string;
    params: (string | number | Date)[];
    paramIndex: number;
};
