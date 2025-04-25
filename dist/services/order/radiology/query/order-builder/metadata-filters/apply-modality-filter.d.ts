/**
 * Apply modality filter to the query
 * @param query Current query string
 * @param params Current query parameters
 * @param paramIndex Current parameter index
 * @param modality Modality to filter by
 * @returns Updated query, params, and paramIndex
 */
export declare function applyModalityFilter(query: string, params: (string | number | Date)[], paramIndex: number, modality?: string): {
    query: string;
    params: (string | number | Date)[];
    paramIndex: number;
};
