import { Patient } from './types';
/**
 * Fetch patient data for an order
 * @param patientId Patient ID
 * @returns Patient data or null if not found
 */
export declare function fetchPatient(patientId: number): Promise<Patient | null>;
