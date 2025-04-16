import { MedicalKeyword, MedicalKeywordCategory } from '../types';
import { isMedicalTerm, getMedicalTermCategory } from '../medical-terms';
import { isMedicalCode } from '../code-extractor';
import { extractMedicalKeywords } from './extract-medical-keywords';

/**
 * Extract medical keywords with their categories
 * 
 * @param text - The text to extract keywords from
 * @returns Array of extracted medical keywords with categories
 */
export function extractCategorizedMedicalKeywords(text: string): MedicalKeyword[] {
  const keywords = extractMedicalKeywords(text);
  
  return keywords.map(term => {
    let category: MedicalKeywordCategory;
    
    if (isMedicalCode(term)) {
      category = MedicalKeywordCategory.CODE;
    } else if (isMedicalTerm(term)) {
      category = getMedicalTermCategory(term)!;
    } else {
      // Default to SYMPTOM if we can't determine the category
      // This should rarely happen as we've checked all categories
      category = MedicalKeywordCategory.SYMPTOM;
    }
    
    return {
      term,
      category
    };
  });
}