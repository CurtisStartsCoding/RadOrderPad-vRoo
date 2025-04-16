import { OrderFilters } from '../../types';
import { createBaseQuery } from './base-query';
import { applyAllFilters } from './filter-orchestrator';
import { applySorting } from './sorting';
import { applyPagination } from './pagination';
/**
 * Build the main query for getting incoming orders
 * @param orgId Radiology organization ID
 * @param filters Filter parameters
 * @returns Object containing the query string and parameters
 */
declare function buildOrderQuery(orgId: number, filters?: OrderFilters): {
    query: string;
    params: any[];
};
export { createBaseQuery, applyAllFilters, applySorting, applyPagination };
export default buildOrderQuery;
