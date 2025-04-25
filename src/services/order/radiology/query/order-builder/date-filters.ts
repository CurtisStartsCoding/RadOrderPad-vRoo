/**
 * Apply date range filters to the query
 * @param query Current query string
 * @param params Current query parameters
 * @param paramIndex Current parameter index
 * @param startDate Start date to filter by
 * @param endDate End date to filter by
 * @returns Updated query, params, and paramIndex
 */
function applyDateRangeFilter(
  query: string,
  params: (string | number | Date)[],
  paramIndex: number,
  startDate?: Date,
  endDate?: Date
): { query: string; params: (string | number | Date)[]; paramIndex: number } {
  if (startDate) {
    query += ` AND o.created_at >= $${paramIndex}`;
    params.push(startDate.toISOString());
    paramIndex++;
  }
  
  if (endDate) {
    query += ` AND o.created_at <= $${paramIndex}`;
    params.push(endDate.toISOString());
    paramIndex++;
  }
  
  return { query, params, paramIndex };
}

export {
  applyDateRangeFilter
};