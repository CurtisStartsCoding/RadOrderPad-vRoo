import { Request, Response } from 'express';
import { queryMainDb, queryPhiDb } from '../../config/db';
import logger from '../../utils/logger';

/**
 * Debug dashboard for troubleshooting
 * Only accessible by super_admin role
 */

/**
 * Get list of all organizations with their types
 * @route GET /api/debug/organizations
 */
export async function getOrganizations(req: Request, res: Response): Promise<void> {
  try {
    const result = await queryMainDb(
      `SELECT id, name, type, status, created_at 
       FROM organizations 
       ORDER BY id`
    );
    
    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    logger.error('Debug: Error fetching organizations', { error });
    res.status(500).json({ success: false, error: 'Failed to fetch organizations' });
  }
}

/**
 * Get list of all users with their organizations
 * @route GET /api/debug/users
 */
export async function getUsers(req: Request, res: Response): Promise<void> {
  try {
    const result = await queryMainDb(
      `SELECT u.id, u.email, u.first_name, u.last_name, u.role, 
              u.organization_id, o.name as organization_name, o.type as organization_type
       FROM users u
       LEFT JOIN organizations o ON u.organization_id = o.id
       ORDER BY u.organization_id, u.role, u.id`
    );
    
    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    logger.error('Debug: Error fetching users', { error });
    res.status(500).json({ success: false, error: 'Failed to fetch users' });
  }
}

/**
 * Get recent orders with full details
 * @route GET /api/debug/orders
 */
export async function getOrders(req: Request, res: Response): Promise<void> {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    
    const result = await queryPhiDb(
      `SELECT o.id, o.order_number, o.status, o.created_at,
              o.patient_id, o.referring_organization_id, o.radiology_organization_id,
              o.created_by_user_id, o.priority, o.target_facility_id,
              p.first_name || ' ' || p.last_name as patient_name
       FROM orders o
       LEFT JOIN patients p ON o.patient_id = p.id
       ORDER BY o.id DESC
       LIMIT $1`,
      [limit]
    );
    
    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    logger.error('Debug: Error fetching orders', { error });
    res.status(500).json({ success: false, error: 'Failed to fetch orders' });
  }
}

/**
 * Get patient clinical records for an order
 * @route GET /api/debug/orders/:orderId/clinical-records
 */
export async function getOrderClinicalRecords(req: Request, res: Response): Promise<void> {
  try {
    const orderId = parseInt(req.params.orderId);
    
    const result = await queryPhiDb(
      `SELECT id, patient_id, order_id, record_type, 
              LEFT(content, 200) as content_preview,
              LENGTH(content) as content_length,
              added_by_user_id, added_at
       FROM patient_clinical_records
       WHERE order_id = $1
       ORDER BY added_at DESC`,
      [orderId]
    );
    
    res.json({
      success: true,
      count: result.rows.length,
      orderId,
      data: result.rows
    });
  } catch (error) {
    logger.error('Debug: Error fetching clinical records', { error });
    res.status(500).json({ success: false, error: 'Failed to fetch clinical records' });
  }
}

/**
 * Get insurance records for a patient
 * @route GET /api/debug/patients/:patientId/insurance
 */
export async function getPatientInsurance(req: Request, res: Response): Promise<void> {
  try {
    const patientId = parseInt(req.params.patientId);
    
    const result = await queryPhiDb(
      `SELECT * FROM patient_insurance
       WHERE patient_id = $1
       ORDER BY is_primary DESC, id`,
      [patientId]
    );
    
    res.json({
      success: true,
      count: result.rows.length,
      patientId,
      data: result.rows
    });
  } catch (error) {
    logger.error('Debug: Error fetching insurance', { error });
    res.status(500).json({ success: false, error: 'Failed to fetch insurance' });
  }
}

/**
 * Get organization connections
 * @route GET /api/debug/connections
 */
export async function getConnections(req: Request, res: Response): Promise<void> {
  try {
    const result = await queryMainDb(
      `SELECT r.*, 
              o1.name as organization_name, o1.type as organization_type,
              o2.name as related_organization_name, o2.type as related_organization_type
       FROM organization_relationships r
       LEFT JOIN organizations o1 ON r.organization_id = o1.id
       LEFT JOIN organizations o2 ON r.related_organization_id = o2.id
       ORDER BY r.id DESC`
    );
    
    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    logger.error('Debug: Error fetching connections', { error });
    res.status(500).json({ success: false, error: 'Failed to fetch connections' });
  }
}

/**
 * Execute custom query (with safety checks)
 * @route POST /api/debug/query
 */
export async function executeQuery(req: Request, res: Response): Promise<void> {
  try {
    const { query, database = 'main' } = req.body;
    
    // Safety check - only allow SELECT queries
    if (!query || !query.trim().toUpperCase().startsWith('SELECT')) {
      res.status(400).json({ 
        success: false, 
        error: 'Only SELECT queries are allowed' 
      });
      return;
    }
    
    // Additional safety - prevent certain keywords
    const forbidden = ['DELETE', 'UPDATE', 'INSERT', 'DROP', 'ALTER', 'CREATE', 'TRUNCATE'];
    if (forbidden.some(word => query.toUpperCase().includes(word))) {
      res.status(400).json({ 
        success: false, 
        error: 'Query contains forbidden keywords' 
      });
      return;
    }
    
    const queryFn = database === 'phi' ? queryPhiDb : queryMainDb;
    const result = await queryFn(query);
    
    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    logger.error('Debug: Error executing query', { error });
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Query execution failed' 
    });
  }
}

export default {
  getOrganizations,
  getUsers,
  getOrders,
  getOrderClinicalRecords,
  getPatientInsurance,
  getConnections,
  executeQuery
};