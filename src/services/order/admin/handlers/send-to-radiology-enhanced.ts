import { withTransaction } from '../utils/transaction';
import * as clinicalRecordManager from '../clinical-record-manager';
import * as orderStatusManager from '../order-status-manager';
import * as validation from '../validation';
import BillingService, { InsufficientCreditsError, CreditActionType } from '../../../../services/billing';
import { burnCreditEnhanced } from '../../../../services/billing/credit/burn-credit-enhanced';
import { SendToRadiologyResult } from '../types';
import logger from '../../../../utils/logger';

/**
 * Enhanced send order to radiology that burns credits for both organizations
 * - Burns credit from referring organization when sending
 * - Burns credit from radiology organization when receiving
 * 
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
    
    // Get the organizations from the order
    const referringOrgId = order.referring_organization_id;
    const radiologyOrgId = order.radiology_organization_id;
    
    if (!radiologyOrgId) {
      throw new Error('Cannot send to radiology: No radiology organization assigned to order');
    }
    
    // Check if the referring organization has sufficient credits
    const hasCredits = await BillingService.hasCredits(referringOrgId);
    if (!hasCredits) {
      throw new InsufficientCreditsError(`Referring organization ${referringOrgId} has insufficient credits`);
    }
    
    // Check if both organizations are active
    const orgStatusResult = await client.query(
      'SELECT id, type, status FROM organizations WHERE id IN ($1, $2)',
      [referringOrgId, radiologyOrgId]
    );
    
    const organizations = new Map(orgStatusResult.rows.map(row => [row.id, row]));
    const referringOrg = organizations.get(referringOrgId);
    const radiologyOrg = organizations.get(radiologyOrgId);
    
    if (!referringOrg) {
      throw new Error(`Referring organization ${referringOrgId} not found`);
    }
    
    if (!radiologyOrg) {
      throw new Error(`Radiology organization ${radiologyOrgId} not found`);
    }
    
    if (referringOrg.status !== 'active') {
      throw new Error(`Cannot send to radiology: Referring organization account is ${referringOrg.status}`);
    }
    
    if (radiologyOrg.status !== 'active') {
      throw new Error(`Cannot send to radiology: Radiology organization account is ${radiologyOrg.status}`);
    }
    
    // Get order details for credit type determination
    const orderDetailsResult = await client.query(
      `SELECT o.*, 
              oi.modality,
              array_agg(DISTINCT oi.cpt_code) FILTER (WHERE oi.cpt_code IS NOT NULL) as cpt_codes
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       WHERE o.id = $1
       GROUP BY o.id`,
      [orderId]
    );
    
    const orderDetails = orderDetailsResult.rows[0];
    
    // 4. Update order status to 'pending_radiology'
    await orderStatusManager.updateOrderStatusToRadiology(orderId, userId);
    
    // 5. Burn a credit from the referring organization
    try {
      await burnCreditEnhanced({
        organizationId: referringOrgId,
        userId,
        orderId,
        actionType: CreditActionType.ORDER_SUBMITTED,
        organizationType: referringOrg.type
      });
      
      logger.info('Credit burned from referring organization', {
        organizationId: referringOrgId,
        orderId,
        actionType: CreditActionType.ORDER_SUBMITTED
      });
    } catch (error) {
      // Rollback status change if credit burn fails
      throw error;
    }
    
    // 6. Burn a credit from the radiology organization
    try {
      await burnCreditEnhanced({
        organizationId: radiologyOrgId,
        userId,
        orderId,
        actionType: CreditActionType.ORDER_RECEIVED,
        organizationType: radiologyOrg.type,
        orderDetails: {
          modality: orderDetails.modality,
          cptCodes: orderDetails.cpt_codes || []
        }
      });
      
      logger.info('Credit burned from radiology organization', {
        organizationId: radiologyOrgId,
        orderId,
        actionType: CreditActionType.ORDER_RECEIVED,
        modality: orderDetails.modality,
        cptCodes: orderDetails.cpt_codes
      });
    } catch (error) {
      logger.error('Failed to burn credit from radiology organization', {
        organizationId: radiologyOrgId,
        orderId,
        error: error instanceof Error ? error.message : String(error)
      });
      
      // Note: We don't rollback here because the referring org credit was already burned
      // and the order was already sent. The radiology org will need to handle this
      // through their billing/credit management interface
    }
    
    // TODO: Implement notification to Radiology group (future enhancement)
    
    return {
      success: true,
      orderId,
      message: 'Order sent to radiology successfully'
    };
  });
}

export default sendToRadiology;