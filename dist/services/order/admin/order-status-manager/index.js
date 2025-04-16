"use strict";
/**
 * Order status management utilities
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateInsuranceData = exports.validatePatientData = exports.updateOrderStatusToRadiology = void 0;
// Import functions
const update_order_status_1 = require("./update-order-status");
Object.defineProperty(exports, "updateOrderStatusToRadiology", { enumerable: true, get: function () { return update_order_status_1.updateOrderStatusToRadiology; } });
const validate_patient_data_1 = require("./validate-patient-data");
Object.defineProperty(exports, "validatePatientData", { enumerable: true, get: function () { return validate_patient_data_1.validatePatientData; } });
const validate_insurance_data_1 = require("./validate-insurance-data");
Object.defineProperty(exports, "validateInsuranceData", { enumerable: true, get: function () { return validate_insurance_data_1.validateInsuranceData; } });
// Default export for backward compatibility
exports.default = {
    updateOrderStatusToRadiology: update_order_status_1.updateOrderStatusToRadiology,
    validatePatientData: validate_patient_data_1.validatePatientData,
    validateInsuranceData: validate_insurance_data_1.validateInsuranceData
};
//# sourceMappingURL=index.js.map