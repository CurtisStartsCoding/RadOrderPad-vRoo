"use strict";
/**
 * Utility functions for extracting medical keywords from text
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractKeywordsByCategory = exports.extractCategorizedMedicalKeywords = exports.extractMedicalKeywords = void 0;
// Import functions
const extract_medical_keywords_1 = require("./extract-medical-keywords");
Object.defineProperty(exports, "extractMedicalKeywords", { enumerable: true, get: function () { return extract_medical_keywords_1.extractMedicalKeywords; } });
const extract_categorized_medical_keywords_1 = require("./extract-categorized-medical-keywords");
Object.defineProperty(exports, "extractCategorizedMedicalKeywords", { enumerable: true, get: function () { return extract_categorized_medical_keywords_1.extractCategorizedMedicalKeywords; } });
const extract_keywords_by_category_1 = require("./extract-keywords-by-category");
Object.defineProperty(exports, "extractKeywordsByCategory", { enumerable: true, get: function () { return extract_keywords_by_category_1.extractKeywordsByCategory; } });
// Default export for backward compatibility
exports.default = {
    extractMedicalKeywords: extract_medical_keywords_1.extractMedicalKeywords,
    extractCategorizedMedicalKeywords: extract_categorized_medical_keywords_1.extractCategorizedMedicalKeywords,
    extractKeywordsByCategory: extract_keywords_by_category_1.extractKeywordsByCategory
};
//# sourceMappingURL=index.js.map