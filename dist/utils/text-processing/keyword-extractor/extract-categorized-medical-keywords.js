"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractCategorizedMedicalKeywords = extractCategorizedMedicalKeywords;
const types_1 = require("../types");
const medical_terms_1 = require("../medical-terms");
const code_extractor_1 = require("../code-extractor");
const extract_medical_keywords_1 = require("./extract-medical-keywords");
/**
 * Extract medical keywords with their categories
 *
 * @param text - The text to extract keywords from
 * @returns Array of extracted medical keywords with categories
 */
function extractCategorizedMedicalKeywords(text) {
    const keywords = (0, extract_medical_keywords_1.extractMedicalKeywords)(text);
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
//# sourceMappingURL=extract-categorized-medical-keywords.js.map