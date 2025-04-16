import { PatientData } from '../types';
/**
 * Get patient data for validation
 * @param patientId Patient ID
 * @returns Promise with patient data
 */
export declare function getPatientForValidation(patientId: number): Promise<PatientData>;
