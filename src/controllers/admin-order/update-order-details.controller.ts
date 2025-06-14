import { Request, Response } from 'express';
import { queryPhiDb } from '../../config/db';
import logger from '../../utils/logger';

interface OrderDetailsRequest {
  priority?: 'routine' | 'stat';
  target_facility_id?: number;
  special_instructions?: string;
  scheduling_timeframe?: string; // Note: This field doesn't exist in DB schema
}

/**
 * Update order details (priority, facility, instructions)
 * @route PUT /api/admin/orders/:orderId/order-details
 */
export async function updateOrderDetails(req: Request, res: Response): Promise<void> {
  try {
    const orderId = parseInt(req.params.orderId);
    const userId = req.user?.userId;
    const orderDetails = req.body as OrderDetailsRequest;
    
    if (isNaN(orderId)) {
      res.status(400).json({ success: false, message: 'Invalid order ID' });
      return;
    }
    
    if (!userId) {
      res.status(401).json({ success: false, message: 'User authentication required' });
      return;
    }
    
    // Verify order exists and is in pending_admin status
    const orderCheck = await queryPhiDb(
      'SELECT id, status FROM orders WHERE id = $1',
      [orderId]
    );
    
    if (orderCheck.rows.length === 0) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }
    
    if (orderCheck.rows[0].status !== 'pending_admin') {
      res.status(400).json({ 
        success: false, 
        message: 'Order can only be updated while in pending_admin status' 
      });
      return;
    }
    
    // Build update query dynamically
    const updateFields: string[] = [];
    const updateValues: (string | number)[] = [];
    let paramCount = 1;
    
    if (orderDetails.priority !== undefined) {
      updateFields.push(`priority = $${paramCount}`);
      updateValues.push(orderDetails.priority);
      paramCount++;
    }
    
    if (orderDetails.target_facility_id !== undefined) {
      updateFields.push(`target_facility_id = $${paramCount}`);
      updateValues.push(orderDetails.target_facility_id);
      paramCount++;
    }
    
    if (orderDetails.special_instructions !== undefined) {
      updateFields.push(`special_instructions = $${paramCount}`);
      updateValues.push(orderDetails.special_instructions);
      paramCount++;
    }
    
    // Note: scheduling_timeframe is not in the database schema
    // We could append it to special_instructions or store it separately
    if (orderDetails.scheduling_timeframe !== undefined && orderDetails.special_instructions === undefined) {
      // If only scheduling timeframe is provided, store it in special_instructions
      updateFields.push(`special_instructions = $${paramCount}`);
      updateValues.push(`Scheduling: ${orderDetails.scheduling_timeframe}`);
      paramCount++;
    }
    
    if (updateFields.length === 0) {
      res.status(400).json({ 
        success: false, 
        message: 'No fields to update' 
      });
      return;
    }
    
    // Add tracking fields
    updateFields.push(`updated_by_user_id = $${paramCount}`);
    updateValues.push(userId);
    paramCount++;
    
    updateFields.push(`updated_at = NOW()`);
    
    // Add order ID to the end of values
    updateValues.push(orderId);
    
    // Execute update
    await queryPhiDb(
      `UPDATE orders SET ${updateFields.join(', ')} WHERE id = $${paramCount}`,
      updateValues
    );
    
    logger.info('Order details updated successfully', {
      orderId,
      userId,
      fieldsUpdated: Object.keys(orderDetails)
    });
    
    res.status(200).json({
      success: true,
      message: 'Order details updated successfully',
      orderId
    });
    
  } catch (error) {
    logger.error('Error updating order details:', { 
      error, 
      orderId: req.params.orderId,
      body: req.body 
    });
    
    res.status(500).json({
      success: false,
      message: 'Failed to update order details',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
}

export default updateOrderDetails;