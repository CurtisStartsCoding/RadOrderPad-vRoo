/**
 * Create the base query for getting incoming orders
 * @param orgId Radiology organization ID
 * @returns Object containing the query string, parameters, and next parameter index
 */
export declare function createBaseQuery(orgId: number): {
    query: string;
    params: any[];
    paramIndex: number;
};
export default createBaseQuery;
