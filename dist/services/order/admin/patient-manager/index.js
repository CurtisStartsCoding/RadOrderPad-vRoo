"use strict";
/**
 * Patient manager functions
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePatientFromEmr = exports.updatePatientInfo = void 0;
// Import functions
const update_patient_info_1 = require("./update-patient-info");
Object.defineProperty(exports, "updatePatientInfo", { enumerable: true, get: function () { return update_patient_info_1.updatePatientInfo; } });
const update_patient_from_emr_1 = require("./update-patient-from-emr");
Object.defineProperty(exports, "updatePatientFromEmr", { enumerable: true, get: function () { return update_patient_from_emr_1.updatePatientFromEmr; } });
// Default export for backward compatibility
exports.default = {
    updatePatientInfo: update_patient_info_1.updatePatientInfo,
    updatePatientFromEmr: update_patient_from_emr_1.updatePatientFromEmr
};
//# sourceMappingURL=index.js.map