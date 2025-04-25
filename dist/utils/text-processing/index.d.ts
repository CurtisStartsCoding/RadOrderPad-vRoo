/**
 * Text processing utilities
 *
 * This module provides utilities for processing medical text, including:
 * - PHI (Personal Health Information) sanitization
 * - Medical keyword extraction
 * - Medical code extraction
 */
export * from './types';
export * from './medical-terms';
export { stripPHI } from './phi-sanitizer';
export { extractMedicalKeywords, extractCategorizedMedicalKeywords, extractKeywordsByCategory } from './keyword-extractor';
export { extractICD10Codes, extractCPTCodes, extractMedicalCodes, isMedicalCode } from './code-extractor';
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
export declare function processMedicalText(text: string): ProcessedMedicalText;
