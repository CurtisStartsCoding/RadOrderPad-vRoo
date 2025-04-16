"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractKeywordsByCategory = extractKeywordsByCategory;
const extract_categorized_medical_keywords_1 = require("./extract-categorized-medical-keywords");
/**
 * Extract keywords by category
 *
 * @param text - The text to extract keywords from
 * @param category - The category of keywords to extract
 * @returns Array of extracted keywords of the specified category
 */
function extractKeywordsByCategory(text, category) {
    const categorizedKeywords = (0, extract_categorized_medical_keywords_1.extractCategorizedMedicalKeywords)(text);
    return categorizedKeywords
        .filter(keyword => keyword.category === category)
        .map(keyword => keyword.term);
}
//# sourceMappingURL=extract-keywords-by-category.js.map