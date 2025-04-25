/**
 * Apply sorting to the query
 * @param query Current query string
 * @param sortBy Column to sort by
 * @param sortOrder Sort order (asc or desc)
 * @returns Updated query string
 */
function applySorting(
  query: string,
  sortBy?: string,
  sortOrder?: 'asc' | 'desc'
): string {
  if (sortBy) {
    const validSortColumns = [
      'created_at', 'priority', 'modality', 'final_validation_status', 'patient_name'
    ];
    
    const validatedSortBy = validSortColumns.includes(sortBy) 
      ? sortBy 
      : 'created_at';
    
    const validatedSortOrder = sortOrder === 'asc' ? 'ASC' : 'DESC';
    
    query += ` ORDER BY o.${validatedSortBy} ${validatedSortOrder}`;
  } else {
    // Default sorting: priority DESC (STAT first), then created_at DESC (newest first)
    query += ` ORDER BY 
      CASE WHEN o.priority = 'stat' THEN 0 ELSE 1 END,
      CASE WHEN o.final_validation_status = 'override' THEN 0 ELSE 1 END,
      o.created_at DESC`;
  }
  
  return query;
}

export {
  applySorting
};