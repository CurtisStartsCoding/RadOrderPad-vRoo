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
    const orderNumber = req.query.orderNumber as string;
    const physicianId = req.query.physicianId as string;
    
    let query = `SELECT o.id, o.order_number, o.status, o.created_at,
                        o.patient_id, o.referring_organization_id, o.radiology_organization_id,
                        o.created_by_user_id, o.priority, o.target_facility_id,
                        p.first_name || ' ' || p.last_name as patient_name
                 FROM orders o
                 LEFT JOIN patients p ON o.patient_id = p.id`;
    
    const params: (string | number)[] = [];
    const conditions: string[] = [];
    
    if (orderNumber) {
      conditions.push(`o.order_number = $${params.length + 1}`);
      params.push(orderNumber);
    }
    
    if (physicianId) {
      conditions.push(`o.created_by_user_id = $${params.length + 1}`);
      params.push(parseInt(physicianId));
    }
    
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }
    
    query += ` ORDER BY o.id DESC LIMIT $${params.length + 1}`;
    params.push(limit);
    
    const result = await queryPhiDb(query, params);
    
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

/**
 * Get trial user statistics
 * @route GET /api/debug/trial-users/stats
 */
export async function getTrialUserStats(req: Request, res: Response): Promise<void> {
  try {
    // Get all trial users with their validation counts
    const trialUsers = await queryMainDb(
      `SELECT id, email, first_name, last_name, specialty,
              validation_count, max_validations, created_at, last_validation_at
       FROM trial_users
       ORDER BY validation_count DESC`
    );
    
    // Get validation logs for trial users
    const validationLogs = await queryMainDb(
      `SELECT 
         tu.id as trial_user_id,
         tu.email,
         COUNT(DISTINCT vl.id) as total_validations,
         COUNT(DISTINCT DATE(vl.created_at)) as active_days,
         MIN(vl.created_at) as first_validation,
         MAX(vl.created_at) as last_validation,
         AVG(vl.latency_ms) as avg_latency_ms
       FROM trial_users tu
       LEFT JOIN llm_validation_logs vl ON vl.user_id = -tu.id
       GROUP BY tu.id, tu.email
       ORDER BY total_validations DESC`
    );
    
    // Get summary statistics
    const summary = await queryMainDb(
      `SELECT 
         COUNT(*) as total_trial_users,
         COUNT(CASE WHEN validation_count > 0 THEN 1 END) as active_users,
         COUNT(CASE WHEN validation_count >= max_validations THEN 1 END) as maxed_out_users,
         SUM(validation_count) as total_validations,
         AVG(validation_count) as avg_validations_per_user,
         MAX(validation_count) as max_validations_by_user
       FROM trial_users`
    );
    
    res.json({
      success: true,
      summary: summary.rows[0],
      topUsers: trialUsers.rows.slice(0, 20), // Top 20 users
      validationDetails: validationLogs.rows,
      allUsers: trialUsers.rows
    });
  } catch (error) {
    logger.error('Debug: Error fetching trial user stats', { error });
    res.status(500).json({ success: false, error: 'Failed to fetch trial user statistics' });
  }
}

/**
 * Get detailed trial user activity
 * @route GET /api/debug/trial-users/:userId/activity
 */
export async function getTrialUserActivity(req: Request, res: Response): Promise<void> {
  try {
    const userId = parseInt(req.params.userId);
    
    // Get user info
    const userInfo = await queryMainDb(
      `SELECT * FROM trial_users WHERE id = $1`,
      [userId]
    );
    
    if (userInfo.rows.length === 0) {
      res.status(404).json({ success: false, error: 'Trial user not found' });
      return;
    }
    
    // Get validation history
    const validations = await queryMainDb(
      `SELECT 
         vl.id, vl.created_at, vl.llm_provider, vl.model_name,
         vl.prompt_tokens, vl.completion_tokens, vl.total_tokens,
         vl.latency_ms, vl.status
       FROM llm_validation_logs vl
       WHERE vl.user_id = $1
       ORDER BY vl.created_at DESC
       LIMIT 100`,
      [-userId] // Negative ID for trial users
    );
    
    // Get daily activity
    const dailyActivity = await queryMainDb(
      `SELECT 
         DATE(created_at) as date,
         COUNT(*) as validations,
         AVG(latency_ms) as avg_latency,
         SUM(total_tokens) as tokens_used
       FROM llm_validation_logs
       WHERE user_id = $1
       GROUP BY DATE(created_at)
       ORDER BY date DESC`,
      [-userId]
    );
    
    res.json({
      success: true,
      user: userInfo.rows[0],
      recentValidations: validations.rows,
      dailyActivity: dailyActivity.rows
    });
  } catch (error) {
    logger.error('Debug: Error fetching trial user activity', { error });
    res.status(500).json({ success: false, error: 'Failed to fetch trial user activity' });
  }
}

/**
 * Get physician orders by user ID
 * @route GET /api/debug/physicians/:physicianId/orders
 */
export async function getPhysicianOrders(req: Request, res: Response): Promise<void> {
  try {
    const physicianId = parseInt(req.params.physicianId);
    const limit = parseInt(req.query.limit as string) || 100;
    
    // Get physician info from main DB
    const physicianInfo = await queryMainDb(
      `SELECT id, email, first_name, last_name, organization_id, role
       FROM users WHERE id = $1`,
      [physicianId]
    );
    
    if (physicianInfo.rows.length === 0) {
      res.status(404).json({ success: false, error: 'Physician not found' });
      return;
    }
    
    // Get orders created by this physician
    const orders = await queryPhiDb(
      `SELECT 
         o.id, o.order_number, o.status, o.created_at,
         o.modality, o.body_part, o.laterality,
         o.final_validation_status, o.final_compliance_score,
         o.overridden, o.is_urgent_override,
         p.first_name || ' ' || p.last_name as patient_name
       FROM orders o
       LEFT JOIN patients p ON o.patient_id = p.id
       WHERE o.created_by_user_id = $1
       ORDER BY o.created_at DESC
       LIMIT $2`,
      [physicianId, limit]
    );
    
    // Get summary statistics
    const stats = await queryPhiDb(
      `SELECT 
         COUNT(*) as total_orders,
         COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_orders,
         COUNT(CASE WHEN overridden = true THEN 1 END) as overridden_orders,
         COUNT(CASE WHEN final_validation_status = 'appropriate' THEN 1 END) as appropriate_orders,
         COUNT(CASE WHEN final_validation_status = 'inappropriate' THEN 1 END) as inappropriate_orders,
         AVG(final_compliance_score) as avg_compliance_score
       FROM orders
       WHERE created_by_user_id = $1`,
      [physicianId]
    );
    
    res.json({
      success: true,
      physician: physicianInfo.rows[0],
      statistics: stats.rows[0],
      recentOrders: orders.rows
    });
  } catch (error) {
    logger.error('Debug: Error fetching physician orders', { error });
    res.status(500).json({ success: false, error: 'Failed to fetch physician orders' });
  }
}

/**
 * Get complete order details with all related data
 * @route GET /api/debug/orders/:orderId/complete
 */
export async function getCompleteOrderDetails(req: Request, res: Response): Promise<void> {
  try {
    const orderId = parseInt(req.params.orderId);
    
    // Get order from PHI database
    const orderResult = await queryPhiDb(
      `SELECT * FROM orders WHERE id = $1`,
      [orderId]
    );
    
    if (orderResult.rows.length === 0) {
      res.status(404).json({ success: false, error: 'Order not found' });
      return;
    }
    
    // Get patient info
    const patientResult = await queryPhiDb(
      `SELECT * FROM patients WHERE id = $1`,
      [orderResult.rows[0].patient_id]
    );
    
    // Get insurance info
    const insuranceResult = await queryPhiDb(
      `SELECT * FROM patient_insurance WHERE patient_id = $1 ORDER BY is_primary DESC`,
      [orderResult.rows[0].patient_id]
    );
    
    // Get clinical records
    const clinicalResult = await queryPhiDb(
      `SELECT * FROM patient_clinical_records WHERE order_id = $1 ORDER BY added_at DESC`,
      [orderId]
    );
    
    // Get validation logs from main DB
    const validationResult = await queryMainDb(
      `SELECT * FROM llm_validation_logs WHERE order_id = $1 ORDER BY created_at DESC`,
      [orderId]
    );
    
    res.json({
      success: true,
      order: orderResult.rows[0],
      patient: patientResult.rows[0] || null,
      insurance: insuranceResult.rows,
      clinicalRecords: clinicalResult.rows,
      validationLogs: validationResult.rows
    });
  } catch (error) {
    logger.error('Debug: Error fetching complete order details', { error });
    res.status(500).json({ success: false, error: 'Failed to fetch complete order details' });
  }
}

/**
 * Get organization connections for frontend dropdowns
 * @route GET /api/debug/organizations/:orgId/connections
 */
export async function getOrganizationConnections(req: Request, res: Response): Promise<void> {
  try {
    const orgId = parseInt(req.params.orgId);
    
    // Get connections where this org is the referring org
    const connectionsResult = await queryMainDb(
      `SELECT r.*, o.name, o.type, l.name as location_name, l.id as location_id
       FROM organization_relationships r
       JOIN organizations o ON o.id = r.related_organization_id
       LEFT JOIN locations l ON l.organization_id = o.id
       WHERE r.organization_id = $1 AND r.status = 'active'
       ORDER BY o.name, l.name`,
      [orgId]
    );
    
    // Group by organization with their locations
    interface GroupedConnection {
      organizationId: number;
      organizationName: string;
      organizationType: string;
      locations: Array<{ locationId: number; locationName: string }>;
    }
    
    interface ConnectionRow {
      related_organization_id: number;
      name: string;
      type: string;
      location_id: number | null;
      location_name: string | null;
    }
    
    const groupedConnections = connectionsResult.rows.reduce((acc: Record<number, GroupedConnection>, row: ConnectionRow) => {
      if (!acc[row.related_organization_id]) {
        acc[row.related_organization_id] = {
          organizationId: row.related_organization_id,
          organizationName: row.name,
          organizationType: row.type,
          locations: []
        };
      }
      if (row.location_id && row.location_name) {
        acc[row.related_organization_id].locations.push({
          locationId: row.location_id,
          locationName: row.location_name
        });
      }
      return acc;
    }, {});
    
    res.json({
      success: true,
      organizationId: orgId,
      connections: Object.values(groupedConnections)
    });
  } catch (error) {
    logger.error('Debug: Error fetching organization connections', { error });
    res.status(500).json({ success: false, error: 'Failed to fetch organization connections' });
  }
}

/**
 * Get recent API update calls for an order
 * @route GET /api/debug/orders/:orderId/update-history
 */
export async function getOrderUpdateHistory(req: Request, res: Response): Promise<void> {
  try {
    const orderId = parseInt(req.params.orderId);
    
    // Get audit logs if available
    const historyResult = await queryPhiDb(
      `SELECT 
        'order' as table_name,
        updated_at as timestamp,
        'Order updated' as action
       FROM orders 
       WHERE id = $1
       UNION ALL
       SELECT 
        'patient' as table_name,
        updated_at as timestamp,
        'Patient info updated' as action
       FROM patients 
       WHERE id = (SELECT patient_id FROM orders WHERE id = $1)
       UNION ALL
       SELECT 
        'insurance' as table_name,
        updated_at as timestamp,
        'Insurance updated' as action
       FROM patient_insurance 
       WHERE patient_id = (SELECT patient_id FROM orders WHERE id = $1)
       ORDER BY timestamp DESC
       LIMIT 20`,
      [orderId]
    );
    
    res.json({
      success: true,
      orderId,
      updateHistory: historyResult.rows
    });
  } catch (error) {
    logger.error('Debug: Error fetching order update history', { error });
    res.status(500).json({ success: false, error: 'Failed to fetch order update history' });
  }
}

export default {
  getOrganizations,
  getUsers,
  getOrders,
  getOrderClinicalRecords,
  getPatientInsurance,
  getConnections,
  executeQuery,
  getTrialUserStats,
  getTrialUserActivity,
  getPhysicianOrders,
  getCompleteOrderDetails,
  getOrganizationConnections,
  getOrderUpdateHistory
};