"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractICD10Codes = extractICD10Codes;
/**
 * Extract potential ICD-10 codes from text
 * @param text - The text to extract codes from
 * @returns Array of extracted ICD-10 codes
 */
function extractICD10Codes(text) {
    // ICD-10 codes typically follow the pattern of a letter followed by 2 digits,
    // optionally followed by a period and 1-2 more digits
    const icd10Regex = /\b[A-Z]\d{2}(?:\.\d{1,2})?\b/g;
    const matches = text.match(icd10Regex);
    return matches ? [...new Set(matches)] : [];
}
//# sourceMappingURL=extract-icd10-codes.js.map