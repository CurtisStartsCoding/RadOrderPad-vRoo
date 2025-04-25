import { ClinicalRecord } from './types';
/**
 * Fetch clinical records for an order
 * @param orderId Order ID
 * @returns Array of clinical records
 */
export declare function fetchClinicalRecords(orderId: number): Promise<ClinicalRecord[]>;
