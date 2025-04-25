/**
 * Type definitions for text processing utilities
 */

/**
 * Medical keyword categories
 */
export enum MedicalKeywordCategory {
  ANATOMY = 'anatomy',
  MODALITY = 'modality',
  SYMPTOM = 'symptom',
  CODE = 'code',
  ABBREVIATION = 'abbreviation'
}

/**
 * Medical keyword with category
 */
export interface MedicalKeyword {
  term: string;
  category: MedicalKeywordCategory;
}

/**
 * Options for PHI sanitization
 */
export interface PHISanitizerOptions {
  sanitizeMRN?: boolean;
  sanitizeSSN?: boolean;
  sanitizePhoneNumbers?: boolean;
  sanitizeDates?: boolean;
  sanitizeNames?: boolean;
  sanitizeEmails?: boolean;
  sanitizeURLs?: boolean;
  sanitizeAddresses?: boolean;
  sanitizeZipCodes?: boolean;
}

/**
 * Medical code with type and description
 */
export interface MedicalCode {
  code: string;
  type: 'ICD10' | 'CPT';
  description?: string;
}

/**
 * Result of processing medical text
 */
export interface ProcessedMedicalText {
  originalText: string;
  sanitizedText: string;
  keywords: string[];
  categorizedKeywords: MedicalKeyword[];
  medicalCodes: string[];
}