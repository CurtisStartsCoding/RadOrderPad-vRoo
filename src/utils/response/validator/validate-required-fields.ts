/**
 * Validate that all required fields are present
 */
export function validateRequiredFields(response: any): void {
  const requiredFields = [
    'validationStatus',
    'complianceScore',
    'feedback',
    'suggestedICD10Codes',
    'suggestedCPTCodes'
  ];
  
  const missingFields = requiredFields.filter(field => !response[field]);
  
  if (missingFields.length > 0) {
    throw new Error(`LLM response missing required fields: ${missingFields.join(', ')}`);
  }
}