import { InsuranceUpdateData } from '../types';
/**
 * Update insurance information for a patient
 * @param patientId Patient ID
 * @param insuranceData Insurance data
 * @returns Promise with insurance ID
 */
export declare function updateInsuranceInfo(patientId: number, insuranceData: InsuranceUpdateData): Promise<number>;
