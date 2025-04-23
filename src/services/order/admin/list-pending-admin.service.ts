import { queryPhiDb } from '../../../config/db';

/**
 * Interface for pagination and sorting options
 */
export interface ListOptions {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: string;
  patientName?: string;
  physicianName?: string;
  dateFrom?: string;
  dateTo?: string;
}

/**
 * Interface for pagination metadata
 */
export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

/**
 * Interface for the service response
 */
export interface ListPendingAdminOrdersResponse {
  orders: any[];
  pagination: PaginationInfo;
}

/**
 * List orders awaiting admin finalization
 * @param orgId Organization ID
 * @param options Pagination, sorting, and filtering options
 * @returns Promise with orders and pagination info
 */
async function listPendingAdminOrders(
  orgId: number,
  options: ListOptions
): Promise<ListPendingAdminOrdersResponse> {
  try {
    // Validate and sanitize sort column to prevent SQL injection
    const allowedSortColumns = [
      'id', 'order_number', 'created_at', 'updated_at', 
      'patient_name', 'patient_dob', 'referring_physician_name', 'modality'
    ];
    
    const sortBy = allowedSortColumns.includes(options.sortBy) 
      ? options.sortBy 
      : 'created_at';
    
    const sortOrder = options.sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    const offset = (options.page - 1) * options.limit;
    
    // Build the WHERE clause with filters
    let whereClause = 'WHERE referring_organization_id = $1 AND status = $2';
    const baseParams: any[] = [orgId, 'pending_admin'];
    let paramIndex = 3;
    
    // Add optional filters if provided
    if (options.patientName) {
      whereClause += ` AND patient_name ILIKE $${paramIndex}`;
      baseParams.push(`%${options.patientName}%`);
      paramIndex++;
    }
    
    if (options.physicianName) {
      whereClause += ` AND referring_physician_name ILIKE $${paramIndex}`;
      baseParams.push(`%${options.physicianName}%`);
      paramIndex++;
    }
    
    if (options.dateFrom) {
      whereClause += ` AND created_at >= $${paramIndex}`;
      baseParams.push(options.dateFrom);
      paramIndex++;
    }
    
    if (options.dateTo) {
      whereClause += ` AND created_at <= $${paramIndex}`;
      baseParams.push(options.dateTo);
      paramIndex++;
    }
    
    // Query to get the orders with pagination
    const query = `
      SELECT
        id,
        order_number,
        patient_name,
        patient_dob,
        patient_gender,
        referring_physician_name,
        modality,
        body_part,
        laterality,
        final_cpt_code,
        final_cpt_code_description,
        final_icd10_codes,
        final_icd10_code_descriptions,
        created_at,
        updated_at
      FROM orders
      ${whereClause}
      ORDER BY ${sortBy} ${sortOrder}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    
    // Create query params with limit and offset
    const queryParams = [...baseParams, options.limit, offset];
    
    // Query to get the total count for pagination
    const countQuery = `
      SELECT COUNT(*) as total
      FROM orders
      ${whereClause}
    `;
    
    // Execute both queries
    const [ordersResult, countResult] = await Promise.all([
      queryPhiDb(query, queryParams),
      queryPhiDb(countQuery, baseParams)
    ]);
    
    const orders = ordersResult.rows;
    const total = parseInt(countResult.rows[0].total, 10);
    const pages = Math.ceil(total / options.limit);
    
    return {
      orders,
      pagination: {
        total,
        page: options.page,
        limit: options.limit,
        pages
      }
    };
  } catch (error) {
    console.error('Error in listPendingAdminOrders service:', error);
    throw error;
  }
}

export default listPendingAdminOrders;