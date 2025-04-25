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
exports.updateInsuranceInfo = updateInsuranceInfo;
const clinicalRecordManager = __importStar(require("../clinical-record-manager"));
const insuranceManager = __importStar(require("../insurance-manager"));
const logger_1 = __importDefault(require("../../../../utils/logger"));
/**
 * Update insurance information
 * @param orderId Order ID
 * @param insuranceData Insurance data
 * @param userId User ID
 * @returns Promise with result
 */
async function updateInsuranceInfo(orderId, insuranceData, userId) {
    try {
        // 1. Verify order exists and has status 'pending_admin'
        const order = await clinicalRecordManager.verifyOrderStatus(orderId);
        // 2. Update insurance information
        // Note: userId is not used in the insuranceManager.updateInsuranceInfo function
        const insuranceId = await insuranceManager.updateInsuranceInfo(order.patient_id, insuranceData);
        return {
            success: true,
            orderId,
            insuranceId,
            message: 'Insurance information updated successfully'
        };
    }
    catch (error) {
        logger_1.default.error('Error in updateInsuranceInfo:', {
            error,
            orderId,
            patientId: insuranceData.patient_id
        });
        throw error;
    }
}
exports.default = updateInsuranceInfo;
//# sourceMappingURL=update-insurance.js.map