/**
 * List LLM validation logs with filtering and pagination
 */
import { queryMainDb } from '../../../config/db';
import { LlmValidationLog, LlmValidationLogFilters, PaginatedResponse } from '../../../types/logs';

/**
 * Default pagination values
 */
const DEFAULT_LIMIT = 50;
const DEFAULT_OFFSET = 0;

/**
 * List LLM validation logs with optional filtering and pagination
 * 
 * @param filters Optional filters to apply (organization_id, user_id, date range, status, llm_provider, model_name)
 * @returns Paginated array of LLM validation logs matching the filters
 */
export async function listLlmValidationLogs(
  filters?: LlmValidationLogFilters
): Promise<PaginatedResponse<LlmValidationLog>> {
  // Set default pagination values
  const limit = filters?.limit || DEFAULT_LIMIT;
  const offset = filters?.offset || DEFAULT_OFFSET;
  
  // Start building the query
  let countQuery = `
    SELECT COUNT(*) as total
    FROM llm_validation_logs l
  `;
  
  let dataQuery = `
    SELECT 
      l.*,
      CONCAT(u.first_name, ' ', u.last_name) as user_name,
      o.name as organization_name
    FROM 
      llm_validation_logs l
    JOIN 
      users u ON l.user_id = u.id
    JOIN 
      organizations o ON l.organization_id = o.id
  `;
  
  const conditions: string[] = [];
  const values: (string | number | Date)[] = [];
  let paramIndex = 1;
  
  // Apply filters if provided
  if (filters) {
    if (filters.organization_id !== undefined) {
      conditions.push(`l.organization_id = $${paramIndex}`);
      values.push(filters.organization_id);
      paramIndex++;
    }
    
    if (filters.user_id !== undefined) {
      conditions.push(`l.user_id = $${paramIndex}`);
      values.push(filters.user_id);
      paramIndex++;
    }
    
    if (filters.date_range_start !== undefined) {
      conditions.push(`l.created_at >= $${paramIndex}`);
      values.push(filters.date_range_start);
      paramIndex++;
    }
    
    if (filters.date_range_end !== undefined) {
      conditions.push(`l.created_at <= $${paramIndex}`);
      values.push(filters.date_range_end);
      paramIndex++;
    }
    
    if (filters.status !== undefined) {
      conditions.push(`l.status = $${paramIndex}`);
      values.push(filters.status);
      paramIndex++;
    }
    
    if (filters.llm_provider !== undefined) {
      conditions.push(`l.llm_provider = $${paramIndex}`);
      values.push(filters.llm_provider);
      paramIndex++;
    }
    
    if (filters.model_name !== undefined) {
      conditions.push(`l.model_name = $${paramIndex}`);
      values.push(filters.model_name);
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
  dataQuery += ` ORDER BY l.created_at DESC, l.id DESC`;
  
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