/**
 * Utility functions for extracting medical keywords from text
 */
// Import functions
import { extractMedicalKeywords } from './extract-medical-keywords';
import { extractCategorizedMedicalKeywords } from './extract-categorized-medical-keywords';
import { extractKeywordsByCategory } from './extract-keywords-by-category';
// Re-export functions
export { extractMedicalKeywords };
export { extractCategorizedMedicalKeywords };
export { extractKeywordsByCategory };
// Default export for backward compatibility
export default {
    extractMedicalKeywords,
    extractCategorizedMedicalKeywords,
    extractKeywordsByCategory
};
//# sourceMappingURL=index.js.map