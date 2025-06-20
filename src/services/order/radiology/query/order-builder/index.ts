import { OrderFilters } from '../../types';
import { createBaseQuery, createSchedulerBaseQuery } from './base-query';
import { applyAllFilters } from './filter-orchestrator';
import { applySorting } from './sorting';
import { applyPagination } from './pagination';

/**
 * Build the main query for getting incoming orders
 * @param orgId Radiology organization ID
 * @param filters Filter parameters
 * @returns Object containing the query string and parameters
 */
function buildOrderQuery(orgId: number, filters: OrderFilters = {}): { query: string; params: (string | number | Date)[] } {
  // Check if this is a scheduler user
  if (filters.userRole === 'scheduler') {
    return buildSchedulerOrderQuery(orgId, filters);
  }

  // Create the base query
  let { query, params, paramIndex } = createBaseQuery(orgId);
  
  // Apply all filters
  const filterResult = applyAllFilters(query, params, paramIndex, filters);
  query = filterResult.query;
  params = filterResult.params;
  paramIndex = filterResult.paramIndex;
  
  // Apply sorting
  query = applySorting(query, filters.sortBy, filters.sortOrder);
  
  // Apply pagination
  const paginationResult = applyPagination(
    query,
    params,
    paramIndex,
    filters.page,
    filters.limit
  );
  query = paginationResult.query;
  params = paginationResult.params;
  
  return { query, params };
}

/**
 * Build the query for scheduler users, including orders from connected organizations
 * @param orgId Radiology organization ID
 * @param filters Filter parameters
 * @returns Object containing the query string and parameters
 */
function buildSchedulerOrderQuery(orgId: number, filters: OrderFilters = {}): { query: string; params: (string | number | Date)[] } {
  // Create the scheduler base query
  let { query, params, paramIndex } = createSchedulerBaseQuery(orgId);
  
  // Apply all filters
  const filterResult = applyAllFilters(query, params, paramIndex, filters);
  query = filterResult.query;
  params = filterResult.params;
  paramIndex = filterResult.paramIndex;
  
  // Apply sorting
  query = applySorting(query, filters.sortBy, filters.sortOrder);
  
  // Apply pagination
  const paginationResult = applyPagination(
    query,
    params,
    paramIndex,
    filters.page,
    filters.limit
  );
  query = paginationResult.query;
  params = paginationResult.params;
  
  return { query, params };
}

// Re-export individual functions for testing and reuse
export {
  createBaseQuery,
  createSchedulerBaseQuery,
  applyAllFilters,
  applySorting,
  applyPagination,
  buildSchedulerOrderQuery
};

// Default export for backward compatibility
export default buildOrderQuery;