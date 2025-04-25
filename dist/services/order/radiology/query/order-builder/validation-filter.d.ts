/**
 * Apply validation status filter to the query
 * @param query Current query string
 * @param params Current query parameters
 * @param paramIndex Current parameter index
 * @param validationStatus Validation status to filter by
 * @returns Updated query, params, and paramIndex
 */
declare function applyValidationStatusFilter(query: string, params: (string | number | Date)[], paramIndex: number, validationStatus?: string): {
    query: string;
    params: (string | number | Date)[];
    paramIndex: number;
};
export { applyValidationStatusFilter };
