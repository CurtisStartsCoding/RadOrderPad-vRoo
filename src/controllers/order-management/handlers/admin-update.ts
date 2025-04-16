/**
 * Admin Update Handler
 * 
 * This handler processes requests to add administrative updates to an order.
 */

import { Request, Response } from 'express';
import { handleControllerError } from '../error-handling';
import { validateOrderId } from '../validation';
import { queryMainDb, queryPhiDb } from '../../../config/db';

/**
 * Add administrative updates to an order
 * @route POST /api/orders/:orderId/admin-update
 */
export async function adminUpdate(req: Request, res: Response): Promise<void> {
  try {
    // Validate order ID
    if (!validateOrderId(req, res)) {
      return;
    }
    
    const orderId = parseInt(req.params.orderId);
    
    // Extract admin update data from request body
    const { additionalInformation, attachments = [] } = req.body;
    
    if (!additionalInformation && (!attachments || attachments.length === 0)) {
      res.status(400).json({ message: 'Additional information or attachments are required' });
      return;
    }
    
    // Get user information from JWT
    const userId = req.user?.userId;
    
    // Update the order with admin information
    if (additionalInformation) {
      await queryPhiDb(
        `UPDATE orders 
         SET 
           admin_notes = CASE 
             WHEN admin_notes IS NULL THEN $1
             ELSE admin_notes || E'\\n\\n' || $1
           END,
           last_updated_by = $2,
           last_updated_at = NOW()
         WHERE id = $3`,
        [additionalInformation, userId, orderId]
      );
    }
    
    // Process attachments if any
    if (attachments && attachments.length > 0) {
      for (const attachment of attachments) {
        await queryPhiDb(
          `INSERT INTO order_attachments (order_id, file_path, file_type, uploaded_by, description)
           VALUES ($1, $2, $3, $4, $5)`,
          [orderId, attachment.path, attachment.type, userId, attachment.description || null]
        );
      }
    }
    
    // Log the admin update action
    await queryMainDb(
      `INSERT INTO order_history (order_id, action, performed_by, details)
       VALUES ($1, 'admin_update', $2, $3)`,
      [orderId, userId, JSON.stringify({ 
        hasAdditionalInfo: !!additionalInformation,
        attachmentCount: attachments ? attachments.length : 0
      })]
    );
    
    // Return success response
    res.status(200).json({ 
      success: true, 
      message: 'Order successfully updated by admin',
      orderId
    });
    
  } catch (error) {
    handleControllerError(error, res, 'adminUpdate');
  }
}