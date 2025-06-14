import { queryMainDb, queryPhiDb } from '../../config/db';
import { Order } from '../../models';
import logger from '../../utils/logger';

/**
 * Get order details by ID
 */
export async function getOrderById(orderId: number, userId: number): Promise<Order> {
  try {
    // Get user information to determine organization
    const userResult = await queryMainDb(
      'SELECT organization_id FROM users WHERE id = $1',
      [userId]
    );
    
    if (userResult.rows.length === 0) {
      throw new Error('User not found');
    }
    
    const user = userResult.rows[0];
    
    // Get order details with patient, insurance, and supplemental info
    const orderResult = await queryPhiDb(`
      SELECT 
        o.*,
        -- Patient info from patients table
        p.first_name as patient_first_name,
        p.last_name as patient_last_name,
        p.middle_name as patient_middle_name,
        p.date_of_birth as patient_date_of_birth,
        p.gender as patient_gender,
        p.address_line1 as patient_address_line1,
        p.address_line2 as patient_address_line2,
        p.city as patient_city,
        p.state as patient_state,
        p.zip_code as patient_zip_code,
        p.phone_number as patient_phone_number,
        p.email as patient_email,
        p.mrn as patient_mrn,
        
        -- Primary insurance info
        pi.insurer_name as insurance_name,
        pi.plan_type as insurance_plan_name,
        pi.policy_number as insurance_policy_number,
        pi.group_number as insurance_group_number,
        pi.policy_holder_name as insurance_policy_holder_name,
        pi.policy_holder_relationship as insurance_policy_holder_relationship,
        pi.policy_holder_date_of_birth as insurance_policy_holder_dob,
        
        -- Secondary insurance info
        si.insurer_name as secondary_insurance_name,
        si.plan_type as secondary_insurance_plan_name,
        si.policy_number as secondary_insurance_policy_number,
        si.group_number as secondary_insurance_group_number,
        
        -- Supplemental EMR info (latest record)
        pcr.content as supplemental_emr_content
        
      FROM orders o
      LEFT JOIN patients p ON o.patient_id = p.id
      LEFT JOIN patient_insurance pi ON p.id = pi.patient_id AND pi.is_primary = true
      LEFT JOIN patient_insurance si ON p.id = si.patient_id AND si.is_primary = false
      LEFT JOIN LATERAL (
        SELECT content
        FROM patient_clinical_records 
        WHERE order_id = o.id 
          AND record_type = 'supplemental_docs_paste'
        ORDER BY added_at DESC
        LIMIT 1
      ) pcr ON true
      WHERE o.id = $1
    `, [orderId]);
    
    if (orderResult.rows.length === 0) {
      throw new Error('Order not found');
    }
    
    const order = orderResult.rows[0] as Order;
    
    // Debug logging to check insurance and supplemental data
    logger.info('GET ORDER DEBUG - Insurance and supplemental fields:', {
      orderId,
      insurance_name: order.insurance_name,
      insurance_policy_number: order.insurance_policy_number,
      insurance_group_number: order.insurance_group_number,
      supplemental_emr_content: order.supplemental_emr_content ? 'HAS_CONTENT' : 'NO_CONTENT',
      supplemental_emr_content_length: order.supplemental_emr_content?.length || 0,
      patient_first_name: order.patient_first_name,
      patient_city: order.patient_city
    });
    
    // Add supplemental_text alias for frontend compatibility
    if (order.supplemental_emr_content) {
      (order as Order & { supplemental_text?: string }).supplemental_text = order.supplemental_emr_content;
    }
    
    // Check authorization (user belongs to the referring or radiology organization)
    if (user.organization_id !== order.referring_organization_id && 
        user.organization_id !== order.radiology_organization_id) {
      throw new Error('Unauthorized: User does not have access to this order');
    }
    
    return order;
  } catch (error) {
    logger.error('Error getting order by ID:', {
      error,
      orderId,
      userId
    });
    throw error;
  }
}