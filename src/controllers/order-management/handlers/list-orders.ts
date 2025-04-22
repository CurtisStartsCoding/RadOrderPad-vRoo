import { Request, Response } from 'express';
import { queryMainDb, queryPhiDb } from '../../../config/db';
import { handleControllerError } from '../error-handling';

/**
 * List orders for the current user
 * @param req Express request object
 * @param res Express response object
 */
export async function listOrders(req: Request, res: Response): Promise<void> {
  try {
    // Get user information from the JWT token
    const userId = req.user?.userId;
    const orgId = req.user?.orgId;
    const userRole = req.user?.role;
    
    if (!userId || !orgId) {
      res.status(401).json({ message: 'User authentication required' });
      return;
    }
    
    // Extract filter parameters from query
    const status = req.query.status as string || 'all';
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;
    const sortBy = req.query.sortBy as string || 'created_at';
    const sortOrder = (req.query.sortOrder as string || 'desc').toUpperCase();
    
    // Build the base query - simplified to avoid joining with organizations table
    let query = `
      SELECT o.*,
        p.first_name as patient_first_name,
        p.last_name as patient_last_name,
        p.date_of_birth as patient_dob
      FROM orders o
      LEFT JOIN patients p ON o.patient_id = p.id
      WHERE 1=1
    `;
    
    const queryParams: any[] = [];
    let paramIndex = 1;
    
    // Apply filters based on user role
    if (userRole === 'physician') {
      // Physicians see orders they created
      query += ` AND o.created_by_user_id = $${paramIndex++}`;
      queryParams.push(userId);
    } else if (userRole === 'admin_staff' || userRole === 'admin_referring') {
      // Admin staff see all orders for their organization
      query += ` AND o.referring_organization_id = $${paramIndex++}`;
      queryParams.push(orgId);
    } else if (userRole === 'admin_radiology' || userRole === 'scheduler') {
      // Radiology staff see orders assigned to their organization
      query += ` AND o.radiology_organization_id = $${paramIndex++}`;
      queryParams.push(orgId);
    } else if (userRole !== 'super_admin') {
      // Other roles don't have access to orders
      res.status(403).json({ message: 'Access denied' });
      return;
    }
    
    // Apply status filter if not 'all'
    if (status !== 'all') {
      query += ` AND o.status = $${paramIndex++}`;
      queryParams.push(status);
    }
    
    // Apply sorting
    query += ` ORDER BY o.${sortBy} ${sortOrder}`;
    
    // Apply pagination
    query += ` LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    queryParams.push(limit, offset);
    
    // Execute the query
    const result = await queryPhiDb(query, queryParams);
    
    // Get total count for pagination
    let countQuery = `
      SELECT COUNT(*) as total
      FROM orders o
      WHERE 1=1
    `;
    
    const countParams: any[] = [];
    paramIndex = 1;
    
    // Apply the same filters to the count query
    if (userRole === 'physician') {
      countQuery += ` AND o.created_by_user_id = $${paramIndex++}`;
      countParams.push(userId);
    } else if (userRole === 'admin_staff' || userRole === 'admin_referring') {
      countQuery += ` AND o.referring_organization_id = $${paramIndex++}`;
      countParams.push(orgId);
    } else if (userRole === 'admin_radiology' || userRole === 'scheduler') {
      countQuery += ` AND o.radiology_organization_id = $${paramIndex++}`;
      countParams.push(orgId);
    }
    
    if (status !== 'all') {
      countQuery += ` AND o.status = $${paramIndex++}`;
      countParams.push(status);
    }
    
    const countResult = await queryPhiDb(countQuery, countParams);
    const total = parseInt(countResult.rows[0].total);
    
    // Return the results with pagination info
    res.status(200).json({
      orders: result.rows,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    handleControllerError(error, res, 'listOrders');
  }
}