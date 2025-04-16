import { InsuranceData } from '../types';
/**
 * Get primary insurance data for validation
 * @param patientId Patient ID
 * @returns Promise with insurance data or null if not found
 */
export declare function getPrimaryInsurance(patientId: number): Promise<InsuranceData | null>;
