/**
 * Apply priority filter to the query
 * @param query Current query string
 * @param params Current query parameters
 * @param paramIndex Current parameter index
 * @param priority Priority to filter by
 * @returns Updated query, params, and paramIndex
 */
declare function applyPriorityFilter(query: string, params: any[], paramIndex: number, priority?: string): {
    query: string;
    params: any[];
    paramIndex: number;
};
/**
 * Apply modality filter to the query
 * @param query Current query string
 * @param params Current query parameters
 * @param paramIndex Current parameter index
 * @param modality Modality to filter by
 * @returns Updated query, params, and paramIndex
 */
declare function applyModalityFilter(query: string, params: any[], paramIndex: number, modality?: string): {
    query: string;
    params: any[];
    paramIndex: number;
};
export { applyPriorityFilter, applyModalityFilter };
