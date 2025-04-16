import { InsuranceData } from '../types';

/**
 * Validate insurance has required information for sending to radiology
 * @param insurance Insurance data
 * @returns Array of missing field names
 */
export function validateInsuranceFields(insurance: InsuranceData | null): string[] {
  const missingFields = [];
  
  if (!insurance) {
    missingFields.push('primary insurance');
    return missingFields;
  }
  
  if (!insurance.insurer_name) missingFields.push('insurance provider name');
  if (!insurance.policy_number) missingFields.push('insurance policy number');
  
  return missingFields;
}