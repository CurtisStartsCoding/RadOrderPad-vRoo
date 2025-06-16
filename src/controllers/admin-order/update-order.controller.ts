import { Request, Response } from 'express';
import { phiDbPool } from '../../config/db';
import logger from '../../utils/logger';

interface UpdateOrderRequest {
  // Patient info fields
  patient?: {
    firstName?: string;
    lastName?: string;
    middleName?: string;
    dateOfBirth?: string;
    gender?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    phoneNumber?: string;
    email?: string;
    mrn?: string;
  };
  
  // Insurance status
  hasInsurance?: boolean;
  
  // Insurance info fields (only relevant if hasInsurance is true)
  insurance?: {
    insurerName?: string;
    planType?: string;
    policyNumber?: string;
    groupNumber?: string;
    policyHolderName?: string;
    policyHolderRelationship?: string;
    policyHolderDateOfBirth?: string;
    verificationStatus?: string;
    isPrimary?: boolean;
  };
  
  // Order details fields
  orderDetails?: {
    priority?: 'routine' | 'stat';
    targetFacilityId?: number;
    specialInstructions?: string;
    schedulingTimeframe?: string; // Note: This field doesn't exist in DB yet
  };
  
  // Supplemental text
  supplementalText?: string;
}

/**
 * Unified endpoint to update any order fields
 * @route PUT /api/admin/orders/:orderId
 */
export async function updateOrder(req: Request, res: Response): Promise<void> {
  const client = await phiDbPool.connect();
  
  try {
    const orderId = parseInt(req.params.orderId);
    const userId = req.user?.userId;
    const updateData = req.body as UpdateOrderRequest;
    
    if (isNaN(orderId)) {
      res.status(400).json({ success: false, message: 'Invalid order ID' });
      return;
    }
    
    if (!userId) {
      res.status(401).json({ success: false, message: 'User authentication required' });
      return;
    }
    
    // Start transaction
    await client.query('BEGIN');
    
    // Verify order exists and get patient_id
    const orderResult = await client.query(
      'SELECT patient_id, status FROM orders WHERE id = $1',
      [orderId]
    );
    
    if (orderResult.rows.length === 0) {
      await client.query('ROLLBACK');
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }
    
    const order = orderResult.rows[0];
    
    // Verify order is in pending_admin status
    if (order.status !== 'pending_admin') {
      await client.query('ROLLBACK');
      res.status(400).json({ 
        success: false, 
        message: 'Order can only be updated while in pending_admin status' 
      });
      return;
    }
    
    // Update patient info if provided
    if (updateData.patient) {
      const patientFields: string[] = [];
      const patientValues: (string | number | null)[] = [];
      let paramCount = 1;
      
      const fieldMap: { [key: string]: string } = {
        firstName: 'first_name',
        lastName: 'last_name',
        middleName: 'middle_name',
        dateOfBirth: 'date_of_birth',
        gender: 'gender',
        addressLine1: 'address_line1',
        addressLine2: 'address_line2',
        city: 'city',
        state: 'state',
        zipCode: 'zip_code',
        phoneNumber: 'phone_number',
        email: 'email',
        mrn: 'mrn'
      };
      
      for (const [key, value] of Object.entries(updateData.patient)) {
        if (value !== undefined && fieldMap[key]) {
          patientFields.push(`${fieldMap[key]} = $${paramCount}`);
          patientValues.push(value);
          paramCount++;
        }
      }
      
      if (patientFields.length > 0) {
        patientValues.push(order.patient_id);
        await client.query(
          `UPDATE patients SET ${patientFields.join(', ')}, updated_at = NOW() 
           WHERE id = $${paramCount}`,
          patientValues
        );
      }
    }
    
    // Update has_insurance status if provided
    if (updateData.hasInsurance !== undefined) {
      await client.query(
        'UPDATE orders SET has_insurance = $1, updated_at = NOW() WHERE id = $2',
        [updateData.hasInsurance, orderId]
      );
    }
    
    // Update insurance info only if patient has insurance
    if (updateData.hasInsurance === true && updateData.insurance) {
      const { isPrimary = true, ...insuranceData } = updateData.insurance;
      
      // Check if insurance record exists
      const insuranceCheck = await client.query(
        'SELECT id FROM patient_insurance WHERE patient_id = $1 AND is_primary = $2',
        [order.patient_id, isPrimary]
      );
      
      if (insuranceCheck.rows.length > 0) {
        // Update existing insurance
        const insuranceFields: string[] = [];
        const insuranceValues: (string | number | null)[] = [];
        let paramCount = 1;
        
        const fieldMap: { [key: string]: string } = {
          insurerName: 'insurer_name',
          planType: 'plan_type',
          policyNumber: 'policy_number',
          groupNumber: 'group_number',
          policyHolderName: 'policy_holder_name',
          policyHolderRelationship: 'policy_holder_relationship',
          policyHolderDateOfBirth: 'policy_holder_date_of_birth',
          verificationStatus: 'verification_status'
        };
        
        for (const [key, value] of Object.entries(insuranceData)) {
          if (value !== undefined && fieldMap[key]) {
            insuranceFields.push(`${fieldMap[key]} = $${paramCount}`);
            insuranceValues.push(value);
            paramCount++;
          }
        }
        
        if (insuranceFields.length > 0) {
          insuranceValues.push(insuranceCheck.rows[0].id);
          await client.query(
            `UPDATE patient_insurance SET ${insuranceFields.join(', ')}, updated_at = NOW() 
             WHERE id = $${paramCount}`,
            insuranceValues
          );
        }
      } else {
        // Insert new insurance record (only called if hasInsurance is true)
        // Use empty strings for required fields if not provided
        await client.query(
          `INSERT INTO patient_insurance 
           (patient_id, insurer_name, plan_type, policy_number, group_number,
            policy_holder_name, policy_holder_relationship, policy_holder_date_of_birth,
            verification_status, is_primary, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())`,
          [
            order.patient_id,
            insuranceData.insurerName || '',
            insuranceData.planType || null,
            insuranceData.policyNumber || '',
            insuranceData.groupNumber || null,
            insuranceData.policyHolderName || null,
            insuranceData.policyHolderRelationship || null,
            insuranceData.policyHolderDateOfBirth || null,
            insuranceData.verificationStatus || null,
            isPrimary
          ]
        );
      }
    } else if (updateData.hasInsurance === false) {
      // Patient is uninsured - remove any existing insurance records
      await client.query(
        'DELETE FROM patient_insurance WHERE patient_id = $1',
        [order.patient_id]
      );
    }
    
    // Update order details if provided
    if (updateData.orderDetails) {
      const orderFields: string[] = [];
      const orderValues: (string | number)[] = [];
      let paramCount = 1;
      
      if (updateData.orderDetails.priority !== undefined) {
        orderFields.push(`priority = $${paramCount}`);
        orderValues.push(updateData.orderDetails.priority);
        paramCount++;
      }
      
      if (updateData.orderDetails.targetFacilityId !== undefined) {
        orderFields.push(`target_facility_id = $${paramCount}`);
        orderValues.push(updateData.orderDetails.targetFacilityId);
        paramCount++;
      }
      
      if (updateData.orderDetails.specialInstructions !== undefined) {
        orderFields.push(`special_instructions = $${paramCount}`);
        orderValues.push(updateData.orderDetails.specialInstructions);
        paramCount++;
      }
      
      // Note: schedulingTimeframe is not in the database schema
      // We could store it in special_instructions or create a new column
      
      if (orderFields.length > 0) {
        orderFields.push(`updated_by_user_id = $${paramCount}`);
        orderValues.push(userId);
        paramCount++;
        
        orderValues.push(orderId);
        await client.query(
          `UPDATE orders SET ${orderFields.join(', ')}, updated_at = NOW() 
           WHERE id = $${paramCount}`,
          orderValues
        );
      }
    }
    
    // Update supplemental text if provided
    if (updateData.supplementalText !== undefined) {
      // Delete existing supplemental record if any
      await client.query(
        `DELETE FROM patient_clinical_records 
         WHERE order_id = $1 AND record_type = 'supplemental_docs_paste'`,
        [orderId]
      );
      
      // Insert new supplemental record if text is not empty
      if (updateData.supplementalText.trim()) {
        await client.query(
          `INSERT INTO patient_clinical_records 
           (patient_id, order_id, record_type, content, added_by_user_id, added_at)
           VALUES ($1, $2, $3, $4, $5, NOW())`,
          [order.patient_id, orderId, 'supplemental_docs_paste', updateData.supplementalText, userId]
        );
      }
    }
    
    // Commit transaction
    await client.query('COMMIT');
    
    res.status(200).json({
      success: true,
      message: 'Order updated successfully',
      orderId
    });
    
  } catch (error) {
    await client.query('ROLLBACK');
    logger.error('Error updating order:', { error, orderId: req.params.orderId });
    res.status(500).json({
      success: false,
      message: 'Failed to update order',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  } finally {
    client.release();
  }
}

export default updateOrder;