import { MedicalKeyword } from '../types';
/**
 * Extract medical keywords with their categories
 *
 * @param text - The text to extract keywords from
 * @returns Array of extracted medical keywords with categories
 */
export declare function extractCategorizedMedicalKeywords(text: string): MedicalKeyword[];
