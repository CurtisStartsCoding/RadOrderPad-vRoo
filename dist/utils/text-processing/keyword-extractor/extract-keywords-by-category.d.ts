import { MedicalKeywordCategory } from '../types';
/**
 * Extract keywords by category
 *
 * @param text - The text to extract keywords from
 * @param category - The category of keywords to extract
 * @returns Array of extracted keywords of the specified category
 */
export declare function extractKeywordsByCategory(text: string, category: MedicalKeywordCategory): string[];
