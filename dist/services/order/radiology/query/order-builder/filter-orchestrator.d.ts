import { OrderFilters } from '../../types';
/**
 * Apply all filters to the query
 * @param query Current query string
 * @param params Current query parameters
 * @param paramIndex Current parameter index
 * @param filters Filter parameters
 * @returns Updated query, params, and paramIndex
 */
declare function applyAllFilters(query: string, params: (string | number | Date)[], paramIndex: number, filters?: OrderFilters): {
    query: string;
    params: (string | number | Date)[];
    paramIndex: number;
};
export { applyAllFilters };
