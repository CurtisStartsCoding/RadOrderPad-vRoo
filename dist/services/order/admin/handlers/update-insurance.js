import * as clinicalRecordManager from '../clinical-record-manager';
import * as insuranceManager from '../insurance-manager';
/**
 * Update insurance information
 * @param orderId Order ID
 * @param insuranceData Insurance data
 * @param userId User ID
 * @returns Promise with result
 */
export async function updateInsuranceInfo(orderId, insuranceData, userId) {
    try {
        // 1. Verify order exists and has status 'pending_admin'
        const order = await clinicalRecordManager.verifyOrderStatus(orderId);
        // 2. Update insurance information
        const insuranceId = await insuranceManager.updateInsuranceInfo(order.patient_id, insuranceData);
        return {
            success: true,
            orderId,
            insuranceId,
            message: 'Insurance information updated successfully'
        };
    }
    catch (error) {
        console.error('Error in updateInsuranceInfo:', error);
        throw error;
    }
}
export default updateInsuranceInfo;
//# sourceMappingURL=update-insurance.js.map