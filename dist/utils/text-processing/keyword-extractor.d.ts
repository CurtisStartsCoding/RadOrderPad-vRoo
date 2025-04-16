/**
 * Utility functions for extracting medical keywords from text
 */
import { MedicalKeyword, MedicalKeywordCategory } from './types';
/**
 * Extract medical keywords from text
 * This function identifies medical terms, codes, and abbreviations in the text
 *
 * @param text - The text to extract keywords from
 * @returns Array of extracted medical keywords
 */
export declare function extractMedicalKeywords(text: string): string[];
/**
 * Extract medical keywords with their categories
 *
 * @param text - The text to extract keywords from
 * @returns Array of extracted medical keywords with categories
 */
export declare function extractCategorizedMedicalKeywords(text: string): MedicalKeyword[];
/**
 * Extract keywords by category
 *
 * @param text - The text to extract keywords from
 * @param category - The category of keywords to extract
 * @returns Array of extracted keywords of the specified category
 */
export declare function extractKeywordsByCategory(text: string, category: MedicalKeywordCategory): string[];
