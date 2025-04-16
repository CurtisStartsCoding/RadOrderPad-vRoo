"use strict";
/**
 * Validation utilities for admin order service
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateInsuranceFields = exports.getPrimaryInsurance = exports.validatePatientFields = exports.getPatientForValidation = void 0;
// Import functions
const patient_1 = require("./patient");
Object.defineProperty(exports, "getPatientForValidation", { enumerable: true, get: function () { return patient_1.getPatientForValidation; } });
Object.defineProperty(exports, "validatePatientFields", { enumerable: true, get: function () { return patient_1.validatePatientFields; } });
const insurance_1 = require("./insurance");
Object.defineProperty(exports, "getPrimaryInsurance", { enumerable: true, get: function () { return insurance_1.getPrimaryInsurance; } });
Object.defineProperty(exports, "validateInsuranceFields", { enumerable: true, get: function () { return insurance_1.validateInsuranceFields; } });
// Default export for backward compatibility
exports.default = {
    getPatientForValidation: patient_1.getPatientForValidation,
    getPrimaryInsurance: insurance_1.getPrimaryInsurance,
    validatePatientFields: patient_1.validatePatientFields,
    validateInsuranceFields: insurance_1.validateInsuranceFields
};
//# sourceMappingURL=index.js.map