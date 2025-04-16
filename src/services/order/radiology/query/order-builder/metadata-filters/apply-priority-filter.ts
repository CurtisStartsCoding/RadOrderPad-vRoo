/**
 * Apply priority filter to the query
 * @param query Current query string
 * @param params Current query parameters
 * @param paramIndex Current parameter index
 * @param priority Priority to filter by
 * @returns Updated query, params, and paramIndex
 */
export function applyPriorityFilter(
  query: string, 
  params: any[], 
  paramIndex: number, 
  priority?: string
): { query: string; params: any[]; paramIndex: number } {
  if (priority) {
    query += ` AND o.priority = $${paramIndex}`;
    params.push(priority);
    paramIndex++;
  }
  
  return { query, params, paramIndex };
}