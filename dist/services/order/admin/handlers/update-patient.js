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
exports.updatePatientInfo = updatePatientInfo;
const clinicalRecordManager = __importStar(require("../clinical-record-manager"));
const patientManager = __importStar(require("../patient-manager"));
const logger_1 = __importDefault(require("../../../../utils/logger"));
/**
 * Update patient information
 * @param orderId Order ID
 * @param patientData Patient data
 * @param userId User ID
 * @returns Promise with result
 */
async function updatePatientInfo(orderId, patientData, userId) {
    try {
        // 1. Verify order exists and has status 'pending_admin'
        const order = await clinicalRecordManager.verifyOrderStatus(orderId);
        // 2. Update patient information
        // Note: userId is not used in the patientManager.updatePatientInfo function
        const patientId = await patientManager.updatePatientInfo(order.patient_id, patientData);
        return {
            success: true,
            orderId,
            patientId,
            message: 'Patient information updated successfully'
        };
    }
    catch (error) {
        logger_1.default.error('Error in updatePatientInfo:', {
            error,
            orderId,
            patientId: patientData.id
        });
        throw error;
    }
}
exports.default = updatePatientInfo;
//# sourceMappingURL=update-patient.js.map