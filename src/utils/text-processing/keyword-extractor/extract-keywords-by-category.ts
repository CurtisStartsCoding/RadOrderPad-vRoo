import { MedicalKeywordCategory } from '../types';
import { extractCategorizedMedicalKeywords } from './extract-categorized-medical-keywords';

/**
 * Extract keywords by category
 * 
 * @param text - The text to extract keywords from
 * @param category - The category of keywords to extract
 * @returns Array of extracted keywords of the specified category
 */
export function extractKeywordsByCategory(
  text: string, 
  category: MedicalKeywordCategory
): string[] {
  const categorizedKeywords = extractCategorizedMedicalKeywords(text);
  return categorizedKeywords
    .filter(keyword => keyword.category === category)
    .map(keyword => keyword.term);
}