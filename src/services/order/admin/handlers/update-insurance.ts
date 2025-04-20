import * as clinicalRecordManager from '../clinical-record-manager';
import * as insuranceManager from '../insurance-manager';
import { InsuranceUpdateData, InsuranceUpdateResult } from '../types';

/**
 * Update insurance information
 * @param orderId Order ID
 * @param insuranceData Insurance data
 * @param userId User ID
 * @returns Promise with result
 */
export async function updateInsuranceInfo(
  orderId: number, 
  insuranceData: InsuranceUpdateData, 
  userId: number
): Promise<InsuranceUpdateResult> {
  try {
    // 1. Verify order exists and has status 'pending_admin'
    const order = await clinicalRecordManager.verifyOrderStatus(orderId);
    
    // 2. Update insurance information
    // Note: userId is not used in the insuranceManager.updateInsuranceInfo function
    const insuranceId = await insuranceManager.updateInsuranceInfo(order.patient_id, insuranceData);
    
    return {
      success: true,
      orderId,
      insuranceId,
      message: 'Insurance information updated successfully'
    };
  } catch (error) {
    console.error('Error in updateInsuranceInfo:', error);
    throw error;
  }
}

export default updateInsuranceInfo;