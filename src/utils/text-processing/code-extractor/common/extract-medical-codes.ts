import { extractICD10Codes } from '../icd10/extract-icd10-codes';
import { extractCPTCodes } from '../cpt/extract-cpt-codes';

/**
 * Extract all medical codes from text
 * @param text - The text to extract codes from
 * @returns Array of extracted medical codes
 */
export function extractMedicalCodes(text: string): string[] {
  const icd10Codes = extractICD10Codes(text);
  const cptCodes = extractCPTCodes(text);
  
  return [...icd10Codes, ...cptCodes];
}