/**
 * Insurance data interface with required fields
 */
interface InsuranceData {
  insurer_name?: string;
  policy_number?: string;
  [key: string]: unknown;
}

/**
 * Validate insurance data for required fields
 * @param insurance Insurance data
 * @returns Array of missing field names
 */
export function validateInsuranceData(insurance: InsuranceData | null | undefined): string[] {
  const missingFields = [];
  
  if (!insurance) {
    missingFields.push('primary insurance');
    return missingFields;
  }
  
  if (!insurance.insurer_name) missingFields.push('insurance provider name');
  if (!insurance.policy_number) missingFields.push('insurance policy number');
  
  return missingFields;
}