/**
 * Utility functions for extracting medical keywords from text
 */
import { MedicalKeyword, MedicalKeywordCategory } from './types';
import { 
  anatomyTerms, 
  modalityTerms, 
  symptomTerms, 
  abbreviationTerms,
  getMedicalTermCategory,
  isMedicalTerm
} from './medical-terms';
import { extractMedicalCodes, isMedicalCode, getMedicalCodeCategory } from './code-extractor';

/**
 * Extract medical keywords from text
 * This function identifies medical terms, codes, and abbreviations in the text
 * 
 * @param text - The text to extract keywords from
 * @returns Array of extracted medical keywords
 */
export function extractMedicalKeywords(text: string): string[] {
  const keywords: string[] = [];
  const lowerText = text.toLowerCase();
  
  // Check for anatomy terms
  anatomyTerms.forEach(term => {
    // Look for whole words, not partial matches
    const regex = new RegExp(`\\b${term}\\b`, 'i');
    if (regex.test(lowerText)) {
      keywords.push(term);
    }
  });
  
  // Check for modalities
  modalityTerms.forEach(term => {
    const regex = new RegExp(`\\b${term}\\b`, 'i');
    if (regex.test(lowerText)) {
      keywords.push(term);
    }
  });
  
  // Check for symptoms
  symptomTerms.forEach(term => {
    const regex = new RegExp(`\\b${term}\\b`, 'i');
    if (regex.test(lowerText)) {
      keywords.push(term);
    }
  });
  
  // Check for medical abbreviations
  abbreviationTerms.forEach(abbr => {
    const regex = new RegExp(`\\b${abbr}\\b`, 'i');
    if (regex.test(lowerText)) {
      keywords.push(abbr);
    }
  });
  
  // Extract medical codes (ICD-10 and CPT)
  const medicalCodes = extractMedicalCodes(text);
  keywords.push(...medicalCodes);
  
  // Remove duplicates and convert to lowercase for consistency
  const uniqueKeywords = [...new Set(keywords.map(k => k.toLowerCase()))];
  
  return uniqueKeywords;
}

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