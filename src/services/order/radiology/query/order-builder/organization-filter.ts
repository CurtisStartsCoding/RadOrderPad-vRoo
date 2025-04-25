/**
 * Apply referring organization filter to the query
 * @param query Current query string
 * @param params Current query parameters
 * @param paramIndex Current parameter index
 * @param referringOrgId Referring organization ID to filter by
 * @returns Updated query, params, and paramIndex
 */
export function applyReferringOrgFilter(
  query: string,
  params: (string | number | Date)[],
  paramIndex: number,
  referringOrgId?: number
): { query: string; params: (string | number | Date)[]; paramIndex: number } {
  if (referringOrgId) {
    query += ` AND o.referring_organization_id = $${paramIndex}`;
    params.push(referringOrgId);
    paramIndex++;
  }
  
  return { query, params, paramIndex };
}

export default applyReferringOrgFilter;