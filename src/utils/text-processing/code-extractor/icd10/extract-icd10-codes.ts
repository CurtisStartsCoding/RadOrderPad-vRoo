/**
 * Extract potential ICD-10 codes from text
 * @param text - The text to extract codes from
 * @returns Array of extracted ICD-10 codes
 */
export function extractICD10Codes(text: string): string[] {
  // ICD-10 codes typically follow the pattern of a letter followed by 2 digits,
  // optionally followed by a period and 1-2 more digits
  const icd10Regex = /\b[A-Z]\d{2}(?:\.\d{1,2})?\b/g;
  const matches = text.match(icd10Regex);
  
  // Use Array.from instead of spread operator with Set
  return matches ? Array.from(new Set(matches)) : [];
}