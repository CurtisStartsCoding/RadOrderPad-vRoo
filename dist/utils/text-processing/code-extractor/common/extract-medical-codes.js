"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractMedicalCodes = extractMedicalCodes;
const extract_icd10_codes_1 = require("../icd10/extract-icd10-codes");
const extract_cpt_codes_1 = require("../cpt/extract-cpt-codes");
/**
 * Extract all medical codes from text
 * @param text - The text to extract codes from
 * @returns Array of extracted medical codes
 */
function extractMedicalCodes(text) {
    const icd10Codes = (0, extract_icd10_codes_1.extractICD10Codes)(text);
    const cptCodes = (0, extract_cpt_codes_1.extractCPTCodes)(text);
    return [...icd10Codes, ...cptCodes];
}
//# sourceMappingURL=extract-medical-codes.js.map