import * as clinicalRecordManager from '../clinical-record-manager';
import * as patientManager from '../patient-manager';
import { PatientUpdateData, PatientUpdateResult } from '../types';
import logger from '../../../../utils/logger';

/**
 * Update patient information
 * @param orderId Order ID
 * @param patientData Patient data
 * @param userId User ID
 * @returns Promise with result
 */
export async function updatePatientInfo(
  orderId: number, 
  patientData: PatientUpdateData,
  _userId: number
): Promise<PatientUpdateResult> {
  try {
    // 1. Verify order exists and has status 'pending_admin'
    const order = await clinicalRecordManager.verifyOrderStatus(orderId);
    
    // 2. Update patient information
    // Note: userId is not used in the patientManager.updatePatientInfo function
    const patientId = await patientManager.updatePatientInfo(order.patient_id, patientData);
    
    return {
      success: true,
      orderId,
      patientId,
      message: 'Patient information updated successfully'
    };
  } catch (error) {
    logger.error('Error in updatePatientInfo:', {
      error,
      orderId,
      patientId: patientData.id
    });
    throw error;
  }
}

export default updatePatientInfo;