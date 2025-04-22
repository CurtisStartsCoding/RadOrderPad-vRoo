/**
 * Enhanced LLM validation logs listing with advanced filtering capabilities
 */
import { queryMainDb } from '../../../config/db';
import { LlmValidationLog, PaginatedResponse } from '../../../types/logs';
import { EnhancedLlmValidationLogFilters } from '../../../types/enhanced-logs';
import logger from '../../../utils/logger';

/**
 * Default pagination values
 */
const DEFAULT_LIMIT = 50;
const DEFAULT_OFFSET = 0;
const MAX_LIMIT = 500;

/**
 * Process date preset into actual date range
 * 
 * @param preset Date range preset
 * @returns Object with start and end dates
 */
function processDatePreset(preset?: string): { start?: Date; end?: Date } {
  if (!preset || preset === 'custom') {
    return { start: undefined, end: undefined };
  }
  
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const result: { start?: Date; end?: Date } = { end: now };
  
  switch (preset) {
    case 'today':
      result.start = today;
      break;
      
    case 'yesterday':
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      result.start = yesterday;
      result.end = new Date(today);
      break;
      
    case 'last_7_days':
      const last7Days = new Date(today);
      last7Days.setDate(last7Days.getDate() - 7);
      result.start = last7Days;
      break;
      
    case 'last_30_days':
      const last30Days = new Date(today);
      last30Days.setDate(last30Days.getDate() - 30);
      result.start = last30Days;
      break;
      
    case 'this_month':
      result.start = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
      
    case 'last_month':
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      result.start = lastMonth;
      result.end = endOfLastMonth;
      break;
  }
  
  return result;
}

/**
 * Enhanced list LLM validation logs with advanced filtering and pagination
 * 
 * @param filters Optional enhanced filters to apply
 * @returns Paginated array of LLM validation logs matching the filters
 */
export async function listLlmValidationLogsEnhanced(
  filters?: EnhancedLlmValidationLogFilters
): Promise<PaginatedResponse<LlmValidationLog>> {
  try {
    // Set default pagination values
    const limit = Math.min(filters?.limit || DEFAULT_LIMIT, MAX_LIMIT);
    const offset = filters?.offset || DEFAULT_OFFSET;
    
    // Process date preset if provided
    if (filters?.date_preset && filters.date_preset !== 'custom') {
      const dateRange = processDatePreset(filters.date_preset);
      filters.date_range_start = dateRange.start || filters.date_range_start;
      filters.date_range_end = dateRange.end || filters.date_range_end;
    }
    
    // Start building the query
    let countQuery = `
      SELECT COUNT(*) as total
      FROM llm_validation_logs l
    `;
    
    let dataQuery = `
      SELECT 
        l.*,
        CONCAT(u.first_name, ' ', u.last_name) as user_name,
        o.name as organization_name,
        pt.name as prompt_template_name
      FROM 
        llm_validation_logs l
      JOIN 
        users u ON l.user_id = u.id
      JOIN 
        organizations o ON l.organization_id = o.id
      LEFT JOIN
        prompt_templates pt ON l.prompt_template_id = pt.id
    `;
    
    const conditions: string[] = [];
    const values: (string | number | Date | string[])[] = [];
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
      
      // Single status (backward compatibility)
      if (filters.status !== undefined) {
        conditions.push(`l.status = $${paramIndex}`);
        values.push(filters.status);
        paramIndex++;
      }
      
      // Multiple statuses (new feature)
      if (filters.statuses && filters.statuses.length > 0) {
        conditions.push(`l.status = ANY($${paramIndex}::text[])`);
        values.push(filters.statuses);
        paramIndex++;
      }
      
      // Single provider (backward compatibility)
      if (filters.llm_provider !== undefined) {
        conditions.push(`l.llm_provider = $${paramIndex}`);
        values.push(filters.llm_provider);
        paramIndex++;
      }
      
      // Multiple providers (new feature)
      if (filters.llm_providers && filters.llm_providers.length > 0) {
        conditions.push(`l.llm_provider = ANY($${paramIndex}::text[])`);
        values.push(filters.llm_providers);
        paramIndex++;
      }
      
      // Single model (backward compatibility)
      if (filters.model_name !== undefined) {
        conditions.push(`l.model_name = $${paramIndex}`);
        values.push(filters.model_name);
        paramIndex++;
      }
      
      // Multiple models (new feature)
      if (filters.model_names && filters.model_names.length > 0) {
        conditions.push(`l.model_name = ANY($${paramIndex}::text[])`);
        values.push(filters.model_names);
        paramIndex++;
      }
      
      // Text search (new feature)
      if (filters.search_text) {
        const searchTerm = `%${filters.search_text}%`;
        conditions.push(`(
          l.status ILIKE $${paramIndex} OR
          l.llm_provider ILIKE $${paramIndex} OR
          l.model_name ILIKE $${paramIndex} OR
          l.error_message ILIKE $${paramIndex} OR
          CAST(l.order_id AS TEXT) = $${paramIndex + 1}
        )`);
        values.push(searchTerm);
        paramIndex++;
        values.push(filters.search_text.trim());
        paramIndex++;
      }
    }
    
    // Add WHERE clause if we have conditions
    if (conditions.length > 0) {
      const whereClause = ` WHERE ${conditions.join(' AND ')}`;
      countQuery += whereClause;
      dataQuery += whereClause;
    }
    
    // Add ordering based on sort parameters or default
    const sortBy = filters?.sort_by || 'created_at';
    const sortDirection = filters?.sort_direction || 'desc';
    dataQuery += ` ORDER BY l.${sortBy} ${sortDirection}, l.id DESC`;
    
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
  } catch (error) {
    logger.error('Error in enhanced LLM validation logs listing:', error);
    throw error;
  }
}