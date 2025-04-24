import { queryMainDb } from '../../config/db';
import enhancedLogger from '../../utils/enhanced-logger';

interface CreditUsageLog {
  id: number;
  userId: number;
  userName: string;
  orderId: number;
  tokensBurned: number;
  actionType: string;
  createdAt: string;
}

interface PaginationOptions {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: string;
  actionType?: string;
  dateStart?: string;
  dateEnd?: string;
}

interface PaginationResult {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

interface CreditUsageHistoryResult {
  usageLogs: CreditUsageLog[];
  pagination: PaginationResult;
}

/**
 * Get credit usage history for an organization
 * 
 * @param orgId Organization ID
 * @param options Pagination, sorting, and filtering options
 * @returns Promise with credit usage logs and pagination info
 */
export async function getCreditUsageHistory(
  orgId: number,
  options: PaginationOptions
): Promise<CreditUsageHistoryResult> {
  try {
    // Set default values for pagination
    const page = options.page || 1;
    const limit = options.limit || 20;
    const offset = (page - 1) * limit;
    
    // Set default values for sorting
    const validSortColumns = ['created_at', 'action_type', 'user_id', 'tokens_burned', 'order_id'];
    const sortBy = validSortColumns.includes(options.sortBy || '') ? options.sortBy : 'created_at';
    const sortOrder = options.sortOrder?.toLowerCase() === 'asc' ? 'ASC' : 'DESC';
    
    // Build the base WHERE clause and parameters
    let whereClause = 'WHERE cl.organization_id = $1';
    const queryParams: (number | string)[] = [orgId];
    let paramIndex = 2;
    
    // Add optional filters
    if (options.actionType) {
      whereClause += ` AND cl.action_type = $${paramIndex}`;
      queryParams.push(options.actionType);
      paramIndex++;
    }
    
    if (options.dateStart) {
      whereClause += ` AND cl.created_at >= $${paramIndex}`;
      queryParams.push(options.dateStart);
      paramIndex++;
    }
    
    if (options.dateEnd) {
      whereClause += ` AND cl.created_at <= $${paramIndex}`;
      queryParams.push(options.dateEnd);
      paramIndex++;
    }
    
    // Build the main query
    const query = `
      SELECT 
        cl.id,
        cl.user_id,
        CONCAT(u.first_name, ' ', u.last_name) as user_name,
        cl.order_id,
        cl.tokens_burned,
        cl.action_type,
        cl.created_at
      FROM 
        credit_usage_logs cl
      LEFT JOIN 
        users u ON cl.user_id = u.id
      ${whereClause}
      ORDER BY 
        cl.${sortBy} ${sortOrder}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    
    // Add pagination parameters
    queryParams.push(limit, offset);
    
    // Build the count query
    const countQuery = `
      SELECT COUNT(*) as total
      FROM credit_usage_logs cl
      ${whereClause}
    `;
    
    // Execute both queries
    const [result, countResult] = await Promise.all([
      queryMainDb(query, queryParams),
      queryMainDb(countQuery, queryParams.slice(0, paramIndex - 1))
    ]);
    
    // Format the results
    const usageLogs = result.rows.map(row => ({
      id: row.id,
      userId: row.user_id,
      userName: row.user_name,
      orderId: row.order_id,
      tokensBurned: row.tokens_burned,
      actionType: row.action_type,
      createdAt: row.created_at
    }));
    
    // Calculate pagination
    const total = parseInt(countResult.rows[0].total, 10);
    const pages = Math.ceil(total / limit);
    
    enhancedLogger.info('Retrieved credit usage history', { 
      orgId, 
      page, 
      limit, 
      total,
      filters: {
        actionType: options.actionType,
        dateStart: options.dateStart,
        dateEnd: options.dateEnd
      }
    });
    
    return {
      usageLogs,
      pagination: {
        total,
        page,
        limit,
        pages
      }
    };
  } catch (error) {
    // Log the error
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    enhancedLogger.error('Error getting credit usage history', { 
      error: errorMessage, 
      orgId,
      options
    });
    
    // Re-throw the error to be handled by the controller
    throw error;
  }
}