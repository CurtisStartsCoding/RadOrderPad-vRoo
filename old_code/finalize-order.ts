import { queryMainDb, queryPhiDb, getPhiDbClient } from '../../config/db';
import { Order, OrderStatus } from '../../models';
import FileUploadService from '../upload';
import PatientService from '../patient.service';
import OrderHistoryService from '../order-history.service';

/**
 * Handle finalization of an order
 */
export async function handleFinalizeOrder(
  orderId: number,
  payload: any,
  userId: number
): Promise<{ success: boolean; orderId: number; message: string }> {
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
      patientId = await PatientService.createTemporaryPatient(client, order.referring_organization_id, payload.patientInfo);
    }
    
    // Update the order
    await updateOrderWithFinalData(client, orderId, patientId, payload, userId);
    
    // Handle signature upload if provided
    if (payload.signatureData) {
      await handleSignatureUpload(orderId, payload.signatureData, userId);
    }
    
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
      message: "Order submitted successfully."
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

/**
 * Verify that the user belongs to the referring organization
 */
async function verifyUserAuthorization(userId: number, referringOrgId: number): Promise<void> {
  const userResult = await queryMainDb(
    'SELECT organization_id FROM users WHERE id = $1',
    [userId]
  );
  
  if (userResult.rows.length === 0) {
    throw new Error('User not found');
  }
  
  const user = userResult.rows[0];
  
  if (user.organization_id !== referringOrgId) {
    throw new Error('Unauthorized: User does not belong to the referring organization');
  }
}

/**
 * Update the order with final data
 */
async function updateOrderWithFinalData(
  client: any,
  orderId: number,
  patientId: number,
  payload: any,
  userId: number
): Promise<void> {
  await client.query(
    `UPDATE orders SET
    patient_id = $1,
    status = $2,
    clinical_indication = $3,
    final_cpt_code = $4,
    final_cpt_code_description = $5,
    final_icd10_codes = $6,
    final_icd10_code_descriptions = $7,
    final_validation_status = $8,
    final_compliance_score = $9,
    overridden = $10,
    override_justification = $11,
    is_urgent_override = $12,
    signed_by_user_id = $13,
    signature_date = NOW(),
    validated_at = NOW(),
    updated_at = NOW(),
    updated_by_user_id = $14
    WHERE id = $15`,
    [
      patientId,
      OrderStatus.PENDING_ADMIN,
      payload.clinicalIndication,
      payload.finalCPTCode,
      payload.finalCPTCodeDescription,
      payload.finalICD10Codes,
      payload.finalICD10CodeDescriptions,
      payload.finalValidationStatus,
      payload.finalComplianceScore,
      payload.overridden || false,
      payload.overrideJustification || null,
      payload.isUrgentOverride || false,
      userId, // Signed by the current user
      userId, // Updated by the current user
      orderId
    ]
  );
}

/**
 * Handle signature upload
 */
async function handleSignatureUpload(orderId: number, signatureData: string, userId: number): Promise<void> {
  const signatureUrl = await FileUploadService.processSignature(orderId, signatureData);
  
  if (signatureUrl) {
    // The signature has been uploaded to S3 and recorded in the document_uploads table
    console.log(`Signature uploaded: ${signatureUrl}`);
  }
}