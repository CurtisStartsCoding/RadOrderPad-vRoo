"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractICD10Codes = extractICD10Codes;
exports.extractCPTCodes = extractCPTCodes;
exports.extractMedicalCodes = extractMedicalCodes;
exports.isMedicalCode = isMedicalCode;
exports.getMedicalCodeCategory = getMedicalCodeCategory;
/**
 * Utility functions for extracting medical codes from text
 */
const types_1 = require("./types");
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
/**
 * Extract potential CPT codes from text
 * @param text - The text to extract codes from
 * @returns Array of extracted CPT codes
 */
function extractCPTCodes(text) {
    // CPT codes are 5-digit numbers
    const cptRegex = /\b\d{5}\b/g;
    const matches = text.match(cptRegex);
    if (!matches) {
        return [];
    }
    // Filter out potential zip codes or other 5-digit numbers
    // that are not likely to be CPT codes
    const filteredMatches = matches.filter(code => {
        // Most CPT codes for radiology start with 7
        // This is a simple heuristic that could be improved
        return code.startsWith('7') || code.startsWith('9');
    });
    return [...new Set(filteredMatches)];
}
/**
 * Extract all medical codes from text
 * @param text - The text to extract codes from
 * @returns Array of extracted medical codes
 */
function extractMedicalCodes(text) {
    const icd10Codes = extractICD10Codes(text);
    const cptCodes = extractCPTCodes(text);
    return [...icd10Codes, ...cptCodes];
}
/**
 * Check if a string is a medical code (ICD-10 or CPT)
 * @param text - The string to check
 * @returns True if the string is a medical code
 */
function isMedicalCode(text) {
    // Check for ICD-10 code pattern
    const icd10Pattern = /^[A-Z]\d{2}(?:\.\d{1,2})?$/;
    if (icd10Pattern.test(text)) {
        return true;
    }
    // Check for CPT code pattern (with heuristic)
    const cptPattern = /^\d{5}$/;
    if (cptPattern.test(text) && (text.startsWith('7') || text.startsWith('9'))) {
        return true;
    }
    return false;
}
/**
 * Get the category of a medical code
 * @param code - The code to categorize
 * @returns The category of the code, or undefined if not a medical code
 */
function getMedicalCodeCategory(code) {
    if (isMedicalCode(code)) {
        return types_1.MedicalKeywordCategory.CODE;
    }
    return undefined;
}
//# sourceMappingURL=code-extractor.js.map