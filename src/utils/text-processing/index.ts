/**
 * Text processing utilities
 *
 * This module provides utilities for processing medical text, including:
 * - PHI (Personal Health Information) sanitization
 * - Medical keyword extraction
 * - Medical code extraction
 */

// Import functions needed for the processMedicalText function
import { stripPHI } from './phi-sanitizer';
import {
  extractMedicalKeywords,
  extractCategorizedMedicalKeywords
} from './keyword-extractor';
import { extractMedicalCodes } from './code-extractor';

// Export types
export * from './types';

// Export medical terms
export * from './medical-terms';

// Export PHI sanitization utilities
export { stripPHI } from './phi-sanitizer';

// Export keyword extraction utilities
export {
  extractMedicalKeywords,
  extractCategorizedMedicalKeywords,
  extractKeywordsByCategory
} from './keyword-extractor';

// Export code extraction utilities
export {
  extractICD10Codes,
  extractCPTCodes,
  extractMedicalCodes,
  isMedicalCode
} from './code-extractor';

/**
 * Main text processing functions
 */

import { ProcessedMedicalText } from './types';

/**
 * Process medical text by sanitizing PHI and extracting keywords
 *
 * @param text - The text to process
 * @returns Object containing sanitized text and extracted keywords
 */
export function processMedicalText(text: string): ProcessedMedicalText {
  // First sanitize PHI
  const sanitizedText = stripPHI(text);
  
  // Then extract keywords from the sanitized text
  const keywords = extractMedicalKeywords(sanitizedText);
  
  // Extract categorized keywords
  const categorizedKeywords = extractCategorizedMedicalKeywords(sanitizedText);
  
  // Extract medical codes
  const medicalCodes = extractMedicalCodes(sanitizedText);
  
  return {
    originalText: text,
    sanitizedText,
    keywords,
    categorizedKeywords,
    medicalCodes
  };
}