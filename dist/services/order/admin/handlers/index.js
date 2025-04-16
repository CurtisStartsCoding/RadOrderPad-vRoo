"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendToRadiology = exports.updateInsuranceInfo = exports.updatePatientInfo = exports.handlePasteSupplemental = exports.handlePasteSummary = void 0;
const paste_summary_1 = __importDefault(require("./paste-summary"));
exports.handlePasteSummary = paste_summary_1.default;
const paste_supplemental_1 = __importDefault(require("./paste-supplemental"));
exports.handlePasteSupplemental = paste_supplemental_1.default;
const update_patient_1 = __importDefault(require("./update-patient"));
exports.updatePatientInfo = update_patient_1.default;
const update_insurance_1 = __importDefault(require("./update-insurance"));
exports.updateInsuranceInfo = update_insurance_1.default;
const send_to_radiology_1 = __importDefault(require("./send-to-radiology"));
exports.sendToRadiology = send_to_radiology_1.default;
//# sourceMappingURL=index.js.map