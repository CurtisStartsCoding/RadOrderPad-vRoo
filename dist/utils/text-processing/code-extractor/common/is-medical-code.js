"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMedicalCode = isMedicalCode;
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
//# sourceMappingURL=is-medical-code.js.map