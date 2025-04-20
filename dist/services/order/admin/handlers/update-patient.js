import * as clinicalRecordManager from '../clinical-record-manager';
import * as patientManager from '../patient-manager';
/**
 * Update patient information
 * @param orderId Order ID
 * @param patientData Patient data
 * @param userId User ID
 * @returns Promise with result
 */
export async function updatePatientInfo(orderId, patientData, userId) {
    try {
        // 1. Verify order exists and has status 'pending_admin'
        const order = await clinicalRecordManager.verifyOrderStatus(orderId);
        // 2. Update patient information
        const patientId = await patientManager.updatePatientInfo(order.patient_id, patientData);
        return {
            success: true,
            orderId,
            patientId,
            message: 'Patient information updated successfully'
        };
    }
    catch (error) {
        console.error('Error in updatePatientInfo:', error);
        throw error;
    }
}
export default updatePatientInfo;
//# sourceMappingURL=update-patient.js.map