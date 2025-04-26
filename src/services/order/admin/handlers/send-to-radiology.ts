import { withTransaction } from '../utils/transaction';
import * as clinicalRecordManager from '../clinical-record-manager';
import * as orderStatusManager from '../order-status-manager';
import * as validation from '../validation';
import BillingService, { InsufficientCreditsError, CreditActionType } from '../../../../services/billing';
import { SendToRadiologyResult } from '../types';

/**
 * Send order to radiology
 * @param orderId Order ID
 * @param userId User ID
 * @returns Promise with result
 */
export async function sendToRadiology(
  orderId: number,
  userId: number
): Promise<SendToRadiologyResult> {
  return withTransaction(async (client) => {
    // 1. Verify order exists and has status 'pending_admin'
    const order = await clinicalRecordManager.verifyOrderStatus(orderId);
    
    // 2. Check if patient has required information
    const patient = await validation.getPatientForValidation(order.patient_id);
    
    // 3. Check if patient has insurance information
    const insurance = await validation.getPrimaryInsurance(order.patient_id);
    
    // Validate patient and insurance data
    const missingPatientFields = validation.validatePatientFields(patient);
    const missingInsuranceFields = validation.validateInsuranceFields(insurance);
    
    // Combine all missing fields
    const missingFields = [...missingPatientFields, ...missingInsuranceFields];
    
    // If missing required fields, throw error
    if (missingFields.length > 0) {
      throw new Error(`Cannot send to radiology: Missing required information: ${missingFields.join(', ')}`);
    }
    
    // Get the organization ID from the order
    const organizationId = order.referring_organization_id;
    
    // Check if the organization has sufficient credits
    const hasCredits = await BillingService.hasCredits(organizationId);
    if (!hasCredits) {
      throw new InsufficientCreditsError(`Organization ${organizationId} has insufficient credits to submit order to radiology`);
    }
    
    // Check if the organization account is active
    const orgStatusResult = await client.query(
      'SELECT status FROM organizations WHERE id = $1',
      [organizationId]
    );
    
    if (orgStatusResult.rows.length === 0) {
      throw new Error(`Organization ${organizationId} not found`);
    }
    
    const orgStatus = orgStatusResult.rows[0].status;
    if (orgStatus !== 'active') {
      throw new Error(`Cannot send to radiology: Organization account is ${orgStatus}`);
    }
    
    // 4. Update order status to 'pending_radiology'
    await orderStatusManager.updateOrderStatusToRadiology(orderId, userId);
    
    // 5. Burn a credit for the order submission
    await BillingService.burnCredit({
      organizationId,
      userId,
      orderId,
      actionType: CreditActionType.ORDER_SUBMITTED
    });
    
    // TODO: Implement notification to Radiology group (future enhancement)
    
    return {
      success: true,
      orderId,
      message: 'Order sent to radiology successfully'
    };
  });
}

export default sendToRadiology;