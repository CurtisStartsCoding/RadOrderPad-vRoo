import { queryMainDb } from '../../config/db';
import { UserResponse } from '../../models/User';
import enhancedLogger from '../../utils/enhanced-logger';

/**
 * Options for listing users by organization
 */
export interface ListUsersOptions {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: string;
  role?: string;
  status?: boolean;
  name?: string;
}

/**
 * Pagination result interface
 */
export interface PaginationResult {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

/**
 * List users by organization result
 */
export interface ListUsersResult {
  users: UserResponse[];
  pagination: PaginationResult;
}

/**
 * List users belonging to an organization with pagination and filtering
 * 
 * @param orgId Organization ID
 * @param options Pagination, sorting, and filtering options
 * @returns Promise with users and pagination info
 */
export async function listUsersByOrganization(
  orgId: number,
  options: ListUsersOptions
): Promise<ListUsersResult> {
  try {
    enhancedLogger.debug(`Listing users for organization ID: ${orgId} with options:`, options);
    
    // Set default values for options
    const page = options.page || 1;
    const limit = options.limit || 20;
    const offset = (page - 1) * limit;
    
    // Validate and set sorting options
    const validSortColumns = ['last_name', 'first_name', 'email', 'role', 'created_at', 'is_active'];
    const sortBy = validSortColumns.includes(options.sortBy) ? options.sortBy : 'last_name';
    const sortOrder = options.sortOrder?.toLowerCase() === 'asc' ? 'ASC' : 'DESC';
    
    // Build the base query
    const queryParams: (string | number | boolean)[] = [orgId];
    let paramIndex = 1;
    
    // Build the WHERE clause
    let whereClause = 'WHERE u.organization_id = $1';
    
    // Add role filter if provided
    if (options.role) {
      paramIndex++;
      whereClause += ` AND u.role = $${paramIndex}`;
      queryParams.push(options.role);
    }
    
    // Add status filter if provided
    if (options.status !== undefined) {
      paramIndex++;
      whereClause += ` AND u.is_active = $${paramIndex}`;
      queryParams.push(options.status);
    }
    
    // Add name search if provided
    if (options.name) {
      paramIndex++;
      whereClause += ` AND (u.first_name ILIKE $${paramIndex} OR u.last_name ILIKE $${paramIndex})`;
      queryParams.push(`%${options.name}%`);
    }
    
    // Build the main query
    const query = `
      SELECT 
        u.id, 
        u.email, 
        u.first_name, 
        u.last_name, 
        u.role, 
        u.organization_id,
        u.is_active, 
        u.email_verified,
        u.created_at,
        u.updated_at,
        u.npi, 
        u.specialty
      FROM users u
      ${whereClause}
      ORDER BY u.${sortBy} ${sortOrder}
      LIMIT $${paramIndex + 1} OFFSET $${paramIndex + 2}
    `;
    
    // Add limit and offset to params
    queryParams.push(limit, offset);
    
    // Build the count query to get total number of records
    const countQuery = `
      SELECT COUNT(*) as total
      FROM users u
      ${whereClause}
    `;
    
    // Execute both queries
    const [usersResult, countResult] = await Promise.all([
      queryMainDb(query, queryParams),
      queryMainDb(countQuery, queryParams.slice(0, paramIndex)) // Remove limit and offset params
    ]);
    
    // Map database results to UserResponse objects
    const users: UserResponse[] = usersResult.rows.map(row => ({
      id: row.id,
      email: row.email,
      first_name: row.first_name,
      last_name: row.last_name,
      role: row.role,
      organization_id: row.organization_id,
      is_active: row.is_active,
      email_verified: row.email_verified,
      created_at: row.created_at,
      updated_at: row.updated_at,
      npi: row.npi || undefined,
      specialty: row.specialty || undefined
    }));
    
    // Calculate pagination info
    const total = parseInt(countResult.rows[0].total, 10);
    const pages = Math.ceil(total / limit);
    
    enhancedLogger.debug(`Found ${users.length} users for organization ID: ${orgId}`);
    
    // Return users with pagination info
    return {
      users,
      pagination: {
        total,
        page,
        limit,
        pages
      }
    };
  } catch (error) {
    enhancedLogger.error(`Error listing users for organization ID ${orgId}:`, error);
    throw error;
  }
}