/**
 * List credit usage logs with filtering and pagination
 */
import { queryMainDb } from '../../../config/db';
import { CreditUsageLog, CreditUsageLogFilters, PaginatedResponse } from '../../../types/logs';

/**
 * Default pagination values
 */
const DEFAULT_LIMIT = 50;
const DEFAULT_OFFSET = 0;

/**
 * List credit usage logs with optional filtering and pagination
 * 
 * @param filters Optional filters to apply (organization_id, user_id, date range, action_type)
 * @returns Paginated array of credit usage logs matching the filters
 */
export async function listCreditUsageLogs(
  filters?: CreditUsageLogFilters
): Promise<PaginatedResponse<CreditUsageLog>> {
  // Set default pagination values
  const limit = filters?.limit || DEFAULT_LIMIT;
  const offset = filters?.offset || DEFAULT_OFFSET;
  
  // Start building the query
  let countQuery = `
    SELECT COUNT(*) as total
    FROM credit_usage_logs c
  `;
  
  let dataQuery = `
    SELECT 
      c.*,
      CONCAT(u.first_name, ' ', u.last_name) as user_name,
      o.name as organization_name
    FROM 
      credit_usage_logs c
    JOIN 
      users u ON c.user_id = u.id
    JOIN 
      organizations o ON c.organization_id = o.id
  `;
  
  const conditions: string[] = [];
  const values: (string | number | Date)[] = [];
  let paramIndex = 1;
  
  // Apply filters if provided
  if (filters) {
    if (filters.organization_id !== undefined) {
      conditions.push(`c.organization_id = $${paramIndex}`);
      values.push(filters.organization_id);
      paramIndex++;
    }
    
    if (filters.user_id !== undefined) {
      conditions.push(`c.user_id = $${paramIndex}`);
      values.push(filters.user_id);
      paramIndex++;
    }
    
    if (filters.date_range_start !== undefined) {
      conditions.push(`c.created_at >= $${paramIndex}`);
      values.push(filters.date_range_start);
      paramIndex++;
    }
    
    if (filters.date_range_end !== undefined) {
      conditions.push(`c.created_at <= $${paramIndex}`);
      values.push(filters.date_range_end);
      paramIndex++;
    }
    
    if (filters.action_type !== undefined) {
      conditions.push(`c.action_type = $${paramIndex}`);
      values.push(filters.action_type);
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
  dataQuery += ` ORDER BY c.created_at DESC, c.id DESC`;
  
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