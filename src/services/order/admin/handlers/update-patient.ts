import * as clinicalRecordManager from '../clinical-record-manager';
import * as patientManager from '../patient-manager';
import { PatientUpdateData, PatientUpdateResult } from '../types';

/**
 * Update patient information
 * @param orderId Order ID
 * @param patientData Patient data
 * @returns Promise with result
 */
export async function updatePatientInfo(
  orderId: number, 
  patientData: PatientUpdateData
): Promise<PatientUpdateResult> {
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
  } catch (error) {
    console.error('Error in updatePatientInfo:', error);
    throw error;
  }
}

export default updatePatientInfo;