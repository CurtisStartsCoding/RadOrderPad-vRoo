import { PatientUpdateData, PatientUpdateResult } from '../types';
/**
 * Update patient information
 * @param orderId Order ID
 * @param patientData Patient data
 * @param userId User ID
 * @returns Promise with result
 */
export declare function updatePatientInfo(orderId: number, patientData: PatientUpdateData, userId: number): Promise<PatientUpdateResult>;
export default updatePatientInfo;
