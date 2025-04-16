import { PatientUpdateData } from '../types';
/**
 * Update patient information
 * @param patientId Patient ID
 * @param patientData Patient data
 * @returns Promise with result
 */
export declare function updatePatientInfo(patientId: number, patientData: PatientUpdateData): Promise<number>;
export default updatePatientInfo;
