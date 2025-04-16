import { PatientData } from '../types';
/**
 * Validate patient has required information for sending to radiology
 * @param patient Patient data
 * @returns Array of missing field names
 */
export declare function validatePatientFields(patient: PatientData): string[];
