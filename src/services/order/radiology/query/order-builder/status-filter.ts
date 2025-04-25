import { OrderStatus } from '../../../../../models';

/**
 * Apply status filter to the query
 * @param query Current query string
 * @param params Current query parameters
 * @param paramIndex Current parameter index
 * @param status Status to filter by
 * @returns Updated query, params, and paramIndex
 */
export function applyStatusFilter(
  query: string,
  params: (string | number | Date)[],
  paramIndex: number,
  status?: string
): { query: string; params: (string | number | Date)[]; paramIndex: number } {
  if (status) {
    query += ` AND o.status = $${paramIndex}`;
    params.push(status);
    paramIndex++;
  } else {
    query += ` AND o.status = $${paramIndex}`;
    params.push(OrderStatus.PENDING_RADIOLOGY);
    paramIndex++;
  }
  
  return { query, params, paramIndex };
}

export default applyStatusFilter;