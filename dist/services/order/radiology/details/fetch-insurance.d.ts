import { Insurance } from './types';
/**
 * Fetch insurance information for a patient
 * @param patientId Patient ID
 * @returns Array of insurance records
 */
export declare function fetchInsurance(patientId: number): Promise<Insurance[]>;
