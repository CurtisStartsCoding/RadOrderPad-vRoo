import { OrderStatus } from '../../../../models';
import { OrderFilters } from '../types';

/**
 * Build the main query for getting incoming orders
 * @param orgId Radiology organization ID
 * @param filters Filter parameters
 * @returns Object containing the query string and parameters
 */
export function buildOrderQuery(orgId: number, filters: OrderFilters = {}): { query: string; params: any[] } {
  // Build the query
  let query = `
    SELECT o.id, o.order_number, o.status, o.priority, o.modality, o.body_part, 
           o.final_cpt_code, o.final_cpt_code_description, o.final_validation_status,
           o.created_at, o.updated_at, o.patient_name, o.patient_dob, o.patient_gender,
           o.referring_physician_name, o.referring_organization_id
    FROM orders o
    WHERE o.radiology_organization_id = $1
  `;
  
  const queryParams: any[] = [orgId];
  let paramIndex = 2;
  
  // Add status filter - default to pending_radiology
  if (filters.status) {
    query += ` AND o.status = $${paramIndex}`;
    queryParams.push(filters.status);
    paramIndex++;
  } else {
    query += ` AND o.status = $${paramIndex}`;
    queryParams.push(OrderStatus.PENDING_RADIOLOGY);
    paramIndex++;
  }
  
  // Add referring organization filter
  if (filters.referringOrgId) {
    query += ` AND o.referring_organization_id = $${paramIndex}`;
    queryParams.push(filters.referringOrgId);
    paramIndex++;
  }
  
  // Add priority filter
  if (filters.priority) {
    query += ` AND o.priority = $${paramIndex}`;
    queryParams.push(filters.priority);
    paramIndex++;
  }
  
  // Add modality filter
  if (filters.modality) {
    query += ` AND o.modality = $${paramIndex}`;
    queryParams.push(filters.modality);
    paramIndex++;
  }
  
  // Add date range filter
  if (filters.startDate) {
    query += ` AND o.created_at >= $${paramIndex}`;
    queryParams.push(filters.startDate.toISOString());
    paramIndex++;
  }
  
  if (filters.endDate) {
    query += ` AND o.created_at <= $${paramIndex}`;
    queryParams.push(filters.endDate.toISOString());
    paramIndex++;
  }
  
  // Add validation status filter
  if (filters.validationStatus) {
    query += ` AND o.final_validation_status = $${paramIndex}`;
    queryParams.push(filters.validationStatus);
    paramIndex++;
  }
  
  // Add sorting
  if (filters.sortBy) {
    const validSortColumns = [
      'created_at', 'priority', 'modality', 'final_validation_status', 'patient_name'
    ];
    
    const sortBy = validSortColumns.includes(filters.sortBy) 
      ? filters.sortBy 
      : 'created_at';
    
    const sortOrder = filters.sortOrder === 'asc' ? 'ASC' : 'DESC';
    
    query += ` ORDER BY o.${sortBy} ${sortOrder}`;
  } else {
    // Default sorting: priority DESC (STAT first), then created_at DESC (newest first)
    query += ` ORDER BY 
      CASE WHEN o.priority = 'stat' THEN 0 ELSE 1 END,
      CASE WHEN o.final_validation_status = 'override' THEN 0 ELSE 1 END,
      o.created_at DESC`;
  }
  
  // Add pagination
  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const offset = (page - 1) * limit;
  
  query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
  queryParams.push(limit, offset);
  
  return { query, params: queryParams };
}

export default buildOrderQuery;