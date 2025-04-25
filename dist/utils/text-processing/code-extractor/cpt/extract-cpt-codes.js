"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractCPTCodes = extractCPTCodes;
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
    // Use Array.from instead of spread operator with Set
    return Array.from(new Set(filteredMatches));
}
//# sourceMappingURL=extract-cpt-codes.js.map