/**
 * Export all medical terms for keyword extraction
 */
import { anatomyTerms, isAnatomyTerm } from './anatomy';
import { modalityTerms, isModalityTerm } from './modalities';
import { symptomTerms, isSymptomTerm } from './symptoms';
import { abbreviationTerms, isAbbreviationTerm } from './abbreviations';
import { MedicalKeywordCategory } from '../types';
// Export all term lists
export { anatomyTerms, modalityTerms, symptomTerms, abbreviationTerms };
// Export all term checking functions
export { isAnatomyTerm, isModalityTerm, isSymptomTerm, isAbbreviationTerm };
/**
 * Get the category of a medical term
 * @param term - The term to categorize
 * @returns The category of the term, or undefined if not a medical term
 */
export function getMedicalTermCategory(term) {
    if (isAnatomyTerm(term)) {
        return MedicalKeywordCategory.ANATOMY;
    }
    if (isModalityTerm(term)) {
        return MedicalKeywordCategory.MODALITY;
    }
    if (isSymptomTerm(term)) {
        return MedicalKeywordCategory.SYMPTOM;
    }
    if (isAbbreviationTerm(term)) {
        return MedicalKeywordCategory.ABBREVIATION;
    }
    return undefined;
}
/**
 * Check if a term is a medical term
 * @param term - The term to check
 * @returns True if the term is a medical term
 */
export function isMedicalTerm(term) {
    return getMedicalTermCategory(term) !== undefined;
}
/**
 * Get all medical terms
 * @returns Array of all medical terms
 */
export function getAllMedicalTerms() {
    return [
        ...anatomyTerms,
        ...modalityTerms,
        ...symptomTerms,
        ...abbreviationTerms
    ];
}
//# sourceMappingURL=index.js.map