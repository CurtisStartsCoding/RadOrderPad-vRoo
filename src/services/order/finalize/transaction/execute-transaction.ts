import { getPhiDbClient } from '../../../../config/db';
import { Order, OrderStatus } from '../../../../models';
import PatientService from '../../../patient.service';
import OrderHistoryService from '../../../order-history.service';
import { FinalizeOrderPayload, FinalizeOrderResponse } from '../types';
import { verifyUserAuthorization } from '../authorization';
import { updateOrderWithFinalData } from '../update';

/**
 * Execute the order finalization transaction
 * 
 * @param orderId The ID of the order to finalize
 * @param payload The finalize order payload
 * @param userId The ID of the user finalizing the order
 * @returns Promise that resolves with the finalization result
 */
export async function executeTransaction(
  orderId: number,
  payload: FinalizeOrderPayload,
  userId: number
): Promise<FinalizeOrderResponse> {
  // Get a client for transaction
  const client = await getPhiDbClient();
  
  try {
    // Start transaction
    await client.query('BEGIN');
    
    // Find the draft order
    const orderResult = await client.query(
      'SELECT * FROM orders WHERE id = $1',
      [orderId]
    );
    
    if (orderResult.rows.length === 0) {
      throw new Error('Order not found');
    }
    
    const order = orderResult.rows[0] as Order;
    
    // Verify authorization (user belongs to the referring organization)
    await verifyUserAuthorization(userId, order.referring_organization_id);
    
    // Handle temporary patient if needed
    let patientId = order.patient_id;
    if (payload.isTemporaryPatient && payload.patientInfo) {
      patientId = await PatientService.createTemporaryPatient(
        client, 
        order.referring_organization_id, 
        payload.patientInfo
      );
    }
    
    // Update the order
    await updateOrderWithFinalData(client, orderId, patientId, payload, userId);
    
    if (payload.signatureData) {
      // For backward compatibility, if signatureData is provided as base64,
      // we'll log a warning but still proceed with the order finalization
      console.warn('Base64 signature data provided. This flow is deprecated. Frontend should use presigned URL flow instead.');
    }
    
    // Note: The frontend should request a presigned URL for signature upload separately
    // using the /api/uploads/presigned-url endpoint, then upload the signature directly to S3,
    // and finally confirm the upload using the /api/uploads/confirm endpoint
    
    // Log order history
    const eventType = payload.overridden ? 'override' : 'signed';
    await OrderHistoryService.logOrderHistory(
      client,
      orderId,
      userId,
      order.status,
      OrderStatus.PENDING_ADMIN,
      eventType
    );
    
    // Commit transaction
    await client.query('COMMIT');
    
    return {
      success: true,
      orderId,
      message: "Order submitted successfully.",
      signatureUploadNote: payload.signatureData ?
        "DEPRECATED: Base64 signature data provided. Future versions will require using the presigned URL flow." :
        "For signature uploads, use the /api/uploads/presigned-url endpoint to get a URL, upload directly to S3, then confirm with /api/uploads/confirm."
    };
  } catch (error) {
    // Rollback transaction on error
    await client.query('ROLLBACK');
    console.error('Error finalizing order:', error);
    throw error;
  } finally {
    // Release client back to pool
    client.release();
  }
}