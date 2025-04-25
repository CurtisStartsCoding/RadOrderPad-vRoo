/**
 * Apply pagination to the query
 * @param query Current query string
 * @param params Current query parameters
 * @param paramIndex Current parameter index
 * @param page Page number
 * @param limit Items per page
 * @returns Updated query, params, and paramIndex
 */
function applyPagination(
  query: string,
  params: (string | number | Date)[],
  paramIndex: number,
  page: number = 1,
  limit: number = 20
): { query: string; params: (string | number | Date)[]; paramIndex: number } {
  const offset = (page - 1) * limit;
  
  query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
  params.push(limit, offset);
  
  // Update paramIndex by 2 since we added two parameters
  paramIndex += 2;
  
  return { query, params, paramIndex };
}

export {
  applyPagination
};