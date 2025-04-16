import { InsuranceData } from '../types';
/**
 * Validate insurance has required information for sending to radiology
 * @param insurance Insurance data
 * @returns Array of missing field names
 */
export declare function validateInsuranceFields(insurance: InsuranceData | null): string[];
