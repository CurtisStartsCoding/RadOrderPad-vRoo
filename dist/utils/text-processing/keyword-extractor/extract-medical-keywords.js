"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractMedicalKeywords = extractMedicalKeywords;
const medical_terms_1 = require("../medical-terms");
const code_extractor_1 = require("../code-extractor");
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
    // Use Array.from instead of spread operator with Set
    const uniqueKeywords = Array.from(new Set(keywords.map(k => k.toLowerCase())));
    return uniqueKeywords;
}
//# sourceMappingURL=extract-medical-keywords.js.map