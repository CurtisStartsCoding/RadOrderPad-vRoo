"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMedicalCodeCategory = getMedicalCodeCategory;
const types_1 = require("../../types");
const is_medical_code_1 = require("./is-medical-code");
/**
 * Get the category of a medical code
 * @param code - The code to categorize
 * @returns The category of the code, or undefined if not a medical code
 */
function getMedicalCodeCategory(code) {
    if ((0, is_medical_code_1.isMedicalCode)(code)) {
        return types_1.MedicalKeywordCategory.CODE;
    }
    return undefined;
}
//# sourceMappingURL=get-medical-code-category.js.map