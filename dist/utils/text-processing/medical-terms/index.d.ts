/**
 * Export all medical terms for keyword extraction
 */
import { anatomyTerms, isAnatomyTerm } from './anatomy';
import { modalityTerms, isModalityTerm } from './modalities';
import { symptomTerms, isSymptomTerm } from './symptoms';
import { abbreviationTerms, isAbbreviationTerm } from './abbreviations';
import { MedicalKeywordCategory } from '../types';
export { anatomyTerms, modalityTerms, symptomTerms, abbreviationTerms };
export { isAnatomyTerm, isModalityTerm, isSymptomTerm, isAbbreviationTerm };
/**
 * Get the category of a medical term
 * @param term - The term to categorize
 * @returns The category of the term, or undefined if not a medical term
 */
export declare function getMedicalTermCategory(term: string): MedicalKeywordCategory | undefined;
/**
 * Check if a term is a medical term
 * @param term - The term to check
 * @returns True if the term is a medical term
 */
export declare function isMedicalTerm(term: string): boolean;
/**
 * Get all medical terms
 * @returns Array of all medical terms
 */
export declare function getAllMedicalTerms(): string[];
