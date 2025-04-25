/**
 * Apply date range filters to the query
 * @param query Current query string
 * @param params Current query parameters
 * @param paramIndex Current parameter index
 * @param startDate Start date to filter by
 * @param endDate End date to filter by
 * @returns Updated query, params, and paramIndex
 */
declare function applyDateRangeFilter(query: string, params: (string | number | Date)[], paramIndex: number, startDate?: Date, endDate?: Date): {
    query: string;
    params: (string | number | Date)[];
    paramIndex: number;
};
export { applyDateRangeFilter };
