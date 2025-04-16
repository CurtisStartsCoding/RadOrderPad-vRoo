/**
 * Apply priority filter to the query
 * @param query Current query string
 * @param params Current query parameters
 * @param paramIndex Current parameter index
 * @param priority Priority to filter by
 * @returns Updated query, params, and paramIndex
 */
function applyPriorityFilter(
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

/**
 * Apply modality filter to the query
 * @param query Current query string
 * @param params Current query parameters
 * @param paramIndex Current parameter index
 * @param modality Modality to filter by
 * @returns Updated query, params, and paramIndex
 */
function applyModalityFilter(
  query: string, 
  params: any[], 
  paramIndex: number, 
  modality?: string
): { query: string; params: any[]; paramIndex: number } {
  if (modality) {
    query += ` AND o.modality = $${paramIndex}`;
    params.push(modality);
    paramIndex++;
  }
  
  return { query, params, paramIndex };
}

export {
  applyPriorityFilter,
  applyModalityFilter
};