import { OrderFilters } from '../types';
/**
 * Build the main query for getting incoming orders
 * @param orgId Radiology organization ID
 * @param filters Filter parameters
 * @returns Object containing the query string and parameters
 */
export declare function buildOrderQuery(orgId: number, filters?: OrderFilters): {
    query: string;
    params: any[];
};
export default buildOrderQuery;
