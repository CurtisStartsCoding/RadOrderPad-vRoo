/**
 * List purgatory events with filtering and pagination
 */
import { queryMainDb } from '../../../config/db';
import { PurgatoryEvent, PurgatoryEventFilters, PaginatedResponse } from '../../../types/logs';

/**
 * Default pagination values
 */
const DEFAULT_LIMIT = 50;
const DEFAULT_OFFSET = 0;

/**
 * List purgatory events with optional filtering and pagination
 * 
 * @param filters Optional filters to apply (organization_id, date range, status, reason)
 * @returns Paginated array of purgatory events matching the filters
 */
export async function listPurgatoryEvents(
  filters?: PurgatoryEventFilters
): Promise<PaginatedResponse<PurgatoryEvent>> {
  // Set default pagination values
  const limit = filters?.limit || DEFAULT_LIMIT;
  const offset = filters?.offset || DEFAULT_OFFSET;
  
  // Start building the query
  let countQuery = `
    SELECT COUNT(*) as total
    FROM purgatory_events p
  `;
  
  let dataQuery = `
    SELECT 
      p.*,
      o.name as organization_name,
      CASE 
        WHEN p.triggered_by_id IS NOT NULL THEN CONCAT(u.first_name, ' ', u.last_name)
        ELSE NULL
      END as triggered_by_name
    FROM 
      purgatory_events p
    JOIN 
      organizations o ON p.organization_id = o.id
    LEFT JOIN 
      users u ON p.triggered_by_id = u.id
  `;
  
  const conditions: string[] = [];
  const values: (string | number | Date)[] = [];
  let paramIndex = 1;
  
  // Apply filters if provided
  if (filters) {
    if (filters.organization_id !== undefined) {
      conditions.push(`p.organization_id = $${paramIndex}`);
      values.push(filters.organization_id);
      paramIndex++;
    }
    
    if (filters.date_range_start !== undefined) {
      conditions.push(`p.created_at >= $${paramIndex}`);
      values.push(filters.date_range_start);
      paramIndex++;
    }
    
    if (filters.date_range_end !== undefined) {
      conditions.push(`p.created_at <= $${paramIndex}`);
      values.push(filters.date_range_end);
      paramIndex++;
    }
    
    if (filters.status !== undefined) {
      conditions.push(`p.status = $${paramIndex}`);
      values.push(filters.status);
      paramIndex++;
    }
    
    if (filters.reason !== undefined) {
      conditions.push(`p.reason = $${paramIndex}`);
      values.push(filters.reason);
      paramIndex++;
    }
  }
  
  // Add WHERE clause if we have conditions
  if (conditions.length > 0) {
    const whereClause = ` WHERE ${conditions.join(' AND ')}`;
    countQuery += whereClause;
    dataQuery += whereClause;
  }
  
  // Add ordering to ensure consistent results
  dataQuery += ` ORDER BY p.created_at DESC, p.id DESC`;
  
  // Add pagination
  dataQuery += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
  const paginationValues = [...values, limit, offset];
  
  // Execute the count query
  const countResult = await queryMainDb(countQuery, values);
  const total = parseInt(countResult.rows[0].total, 10);
  
  // Execute the data query with pagination
  const dataResult = await queryMainDb(dataQuery, paginationValues);
  
  // Format the response
  return {
    data: dataResult.rows,
    pagination: {
      total,
      limit,
      offset,
      has_more: offset + limit < total
    }
  };
}