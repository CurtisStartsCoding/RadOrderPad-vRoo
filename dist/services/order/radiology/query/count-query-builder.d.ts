import { OrderFilters } from '../types';
/**
 * Build the count query for pagination
 * @param orgId Radiology organization ID
 * @param filters Filter parameters
 * @returns Object containing the query string and parameters
 */
export declare function buildCountQuery(orgId: number, filters?: OrderFilters): {
    query: string;
    params: (number | string | Date)[];
};
export default buildCountQuery;
