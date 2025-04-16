import { FieldMap } from './types';

/**
 * Normalize response field names to handle casing issues
 */
export function normalizeResponseFields(response: any): any {
  const normalized: any = {};
  
  // Map of possible field names to normalized field names
  const fieldMap: FieldMap = {
    // validationStatus variations
    'validationstatus': 'validationStatus',
    'validation_status': 'validationStatus',
    'status': 'validationStatus',
    
    // complianceScore variations
    'compliancescore': 'complianceScore',
    'compliance_score': 'complianceScore',
    'score': 'complianceScore',
    
    // feedback variations
    'feedback_text': 'feedback',
    'feedbacktext': 'feedback',
    'message': 'feedback',
    
    // suggestedICD10Codes variations
    'suggestedicd10codes': 'suggestedICD10Codes',
    'suggested_icd10_codes': 'suggestedICD10Codes',
    'icd10_codes': 'suggestedICD10Codes',
    'icd10codes': 'suggestedICD10Codes',
    'icd10': 'suggestedICD10Codes',
    'icd_10_codes': 'suggestedICD10Codes',
    
    // suggestedCPTCodes variations
    'suggestedcptcodes': 'suggestedCPTCodes',
    'suggested_cpt_codes': 'suggestedCPTCodes',
    'cpt_codes': 'suggestedCPTCodes',
    'cptcodes': 'suggestedCPTCodes',
    'cpt': 'suggestedCPTCodes',
    
    // internalReasoning variations
    'internalreasoning': 'internalReasoning',
    'internal_reasoning': 'internalReasoning',
    'reasoning': 'internalReasoning',
    'rationale': 'internalReasoning'
  };
  
  // Check for each possible field name
  for (const [key, value] of Object.entries(response)) {
    const normalizedKey = fieldMap[key.toLowerCase()] || key;
    normalized[normalizedKey] = value;
  }
  
  return normalized;
}

/**
 * Normalize code arrays to ensure consistent format
 */
export function normalizeCodeArray(codes: any): Array<{ code: string; description: string }> {
  if (!codes) return [];
  
  // If codes is already an array of objects with code and description
  if (Array.isArray(codes) && codes.length > 0 && typeof codes[0] === 'object') {
    return codes.map(item => ({
      code: item.code || '',
      description: item.description || ''
    }));
  }
  
  // If codes is an array of strings
  if (Array.isArray(codes) && codes.length > 0 && typeof codes[0] === 'string') {
    return codes.map(code => ({
      code,
      description: ''
    }));
  }
  
  // If codes is a string (comma-separated list)
  if (typeof codes === 'string') {
    return codes.split(',').map(code => ({
      code: code.trim(),
      description: ''
    }));
  }
  
  // Default to empty array
  return [];
}