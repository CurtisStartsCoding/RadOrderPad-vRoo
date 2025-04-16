import { ParsedInsuranceInfo } from '../types';
/**
 * Update insurance information from EMR data
 * @param patientId Patient ID
 * @param insuranceInfo Parsed insurance information from EMR
 * @returns Promise with insurance ID
 */
export declare function updateInsuranceFromEmr(patientId: number, insuranceInfo: ParsedInsuranceInfo): Promise<number>;
