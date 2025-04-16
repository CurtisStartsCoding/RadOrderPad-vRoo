"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractMedicalKeywords = extractMedicalKeywords;
exports.extractCategorizedMedicalKeywords = extractCategorizedMedicalKeywords;
exports.extractKeywordsByCategory = extractKeywordsByCategory;
/**
 * Utility functions for extracting medical keywords from text
 */
const types_1 = require("./types");
const medical_terms_1 = require("./medical-terms");
const code_extractor_1 = require("./code-extractor");
/**
 * Extract medical keywords from text
 * This function identifies medical terms, codes, and abbreviations in the text
 *
 * @param text - The text to extract keywords from
 * @returns Array of extracted medical keywords
 */
function extractMedicalKeywords(text) {
    const keywords = [];
    const lowerText = text.toLowerCase();
    // Check for anatomy terms
    medical_terms_1.anatomyTerms.forEach(term => {
        // Look for whole words, not partial matches
        const regex = new RegExp(`\\b${term}\\b`, 'i');
        if (regex.test(lowerText)) {
            keywords.push(term);
        }
    });
    // Check for modalities
    medical_terms_1.modalityTerms.forEach(term => {
        const regex = new RegExp(`\\b${term}\\b`, 'i');
        if (regex.test(lowerText)) {
            keywords.push(term);
        }
    });
    // Check for symptoms
    medical_terms_1.symptomTerms.forEach(term => {
        const regex = new RegExp(`\\b${term}\\b`, 'i');
        if (regex.test(lowerText)) {
            keywords.push(term);
        }
    });
    // Check for medical abbreviations
    medical_terms_1.abbreviationTerms.forEach(abbr => {
        const regex = new RegExp(`\\b${abbr}\\b`, 'i');
        if (regex.test(lowerText)) {
            keywords.push(abbr);
        }
    });
    // Extract medical codes (ICD-10 and CPT)
    const medicalCodes = (0, code_extractor_1.extractMedicalCodes)(text);
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
function extractCategorizedMedicalKeywords(text) {
    const keywords = extractMedicalKeywords(text);
    return keywords.map(term => {
        let category;
        if ((0, code_extractor_1.isMedicalCode)(term)) {
            category = types_1.MedicalKeywordCategory.CODE;
        }
        else if ((0, medical_terms_1.isMedicalTerm)(term)) {
            category = (0, medical_terms_1.getMedicalTermCategory)(term);
        }
        else {
            // Default to SYMPTOM if we can't determine the category
            // This should rarely happen as we've checked all categories
            category = types_1.MedicalKeywordCategory.SYMPTOM;
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
function extractKeywordsByCategory(text, category) {
    const categorizedKeywords = extractCategorizedMedicalKeywords(text);
    return categorizedKeywords
        .filter(keyword => keyword.category === category)
        .map(keyword => keyword.term);
}
//# sourceMappingURL=keyword-extractor.js.map