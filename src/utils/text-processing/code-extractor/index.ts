/**
 * Utility functions for extracting medical codes from text
 */

// Export ICD-10 related functions
export { extractICD10Codes } from './icd10/extract-icd10-codes';

// Export CPT related functions
export { extractCPTCodes } from './cpt/extract-cpt-codes';

// Export common functions
export { extractMedicalCodes } from './common/extract-medical-codes';
export { isMedicalCode } from './common/is-medical-code';
export { getMedicalCodeCategory } from './common/get-medical-code-category';