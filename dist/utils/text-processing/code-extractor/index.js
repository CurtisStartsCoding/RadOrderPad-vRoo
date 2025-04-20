"use strict";
/**
 * Utility functions for extracting medical codes from text
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMedicalCodeCategory = exports.isMedicalCode = exports.extractMedicalCodes = exports.extractCPTCodes = exports.extractICD10Codes = void 0;
// Export ICD-10 related functions
var extract_icd10_codes_1 = require("./icd10/extract-icd10-codes");
Object.defineProperty(exports, "extractICD10Codes", { enumerable: true, get: function () { return extract_icd10_codes_1.extractICD10Codes; } });
// Export CPT related functions
var extract_cpt_codes_1 = require("./cpt/extract-cpt-codes");
Object.defineProperty(exports, "extractCPTCodes", { enumerable: true, get: function () { return extract_cpt_codes_1.extractCPTCodes; } });
// Export common functions
var extract_medical_codes_1 = require("./common/extract-medical-codes");
Object.defineProperty(exports, "extractMedicalCodes", { enumerable: true, get: function () { return extract_medical_codes_1.extractMedicalCodes; } });
var is_medical_code_1 = require("./common/is-medical-code");
Object.defineProperty(exports, "isMedicalCode", { enumerable: true, get: function () { return is_medical_code_1.isMedicalCode; } });
var get_medical_code_category_1 = require("./common/get-medical-code-category");
Object.defineProperty(exports, "getMedicalCodeCategory", { enumerable: true, get: function () { return get_medical_code_category_1.getMedicalCodeCategory; } });
//# sourceMappingURL=index.js.map