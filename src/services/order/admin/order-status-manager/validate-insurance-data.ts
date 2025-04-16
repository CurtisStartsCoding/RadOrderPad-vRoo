/**
 * Validate insurance data for required fields
 * @param insurance Insurance data
 * @returns Array of missing field names
 */
export function validateInsuranceData(insurance: any): string[] {
  const missingFields = [];
  
  if (!insurance) {
    missingFields.push('primary insurance');
    return missingFields;
  }
  
  if (!insurance.insurer_name) missingFields.push('insurance provider name');
  if (!insurance.policy_number) missingFields.push('insurance policy number');
  
  return missingFields;
}