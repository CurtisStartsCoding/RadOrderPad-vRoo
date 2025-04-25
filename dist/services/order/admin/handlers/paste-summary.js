"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlePasteSummary = handlePasteSummary;
const transaction_1 = require("../utils/transaction");
const emr_parser_1 = __importDefault(require("../emr-parser"));
const clinicalRecordManager = __importStar(require("../clinical-record-manager"));
const patientManager = __importStar(require("../patient-manager"));
const insuranceManager = __importStar(require("../insurance-manager"));
/**
 * Handle pasted EMR summary
 * @param orderId Order ID
 * @param pastedText Pasted EMR summary text
 * @param userId User ID
 * @returns Promise with result
 */
async function handlePasteSummary(orderId, pastedText, userId) {
    return (0, transaction_1.withTransaction)(async (_client) => {
        // 1. Verify order exists and has status 'pending_admin'
        const order = await clinicalRecordManager.verifyOrderStatus(orderId);
        // 2. Save the raw pasted text to patient_clinical_records
        await clinicalRecordManager.saveEmrSummary(orderId, order.patient_id, pastedText, userId);
        // 3. Parse the text to extract patient demographics and insurance details
        const parsedData = (0, emr_parser_1.default)(pastedText);
        // 4. Update patient information with extracted data
        if (parsedData.patientInfo) {
            await patientManager.updatePatientFromEmr(order.patient_id, parsedData.patientInfo);
        }
        // 5. Create/Update insurance information with extracted data
        if (parsedData.insuranceInfo) {
            await insuranceManager.updateInsuranceFromEmr(order.patient_id, parsedData.insuranceInfo);
        }
        return {
            success: true,
            orderId,
            message: 'EMR summary processed successfully',
            parsedData
        };
    });
}
exports.default = handlePasteSummary;
//# sourceMappingURL=paste-summary.js.map