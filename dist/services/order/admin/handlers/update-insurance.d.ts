import { InsuranceUpdateData, InsuranceUpdateResult } from '../types';
/**
 * Update insurance information
 * @param orderId Order ID
 * @param insuranceData Insurance data
 * @param userId User ID
 * @returns Promise with result
 */
export declare function updateInsuranceInfo(orderId: number, insuranceData: InsuranceUpdateData, _userId: number): Promise<InsuranceUpdateResult>;
export default updateInsuranceInfo;
