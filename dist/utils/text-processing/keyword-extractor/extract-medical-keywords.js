import { anatomyTerms, modalityTerms, symptomTerms, abbreviationTerms } from '../medical-terms';
import { extractMedicalCodes } from '../code-extractor';
/**
 * Extract medical keywords from text
 * This function identifies medical terms, codes, and abbreviations in the text
 *
 * @param text - The text to extract keywords from
 * @returns Array of extracted medical keywords
 */
export function extractMedicalKeywords(text) {
    const keywords = [];
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
//# sourceMappingURL=extract-medical-keywords.js.map