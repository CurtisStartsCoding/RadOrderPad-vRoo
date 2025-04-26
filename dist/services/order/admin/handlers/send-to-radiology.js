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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendToRadiology = sendToRadiology;
const transaction_1 = require("../utils/transaction");
const clinicalRecordManager = __importStar(require("../clinical-record-manager"));
const orderStatusManager = __importStar(require("../order-status-manager"));
const validation = __importStar(require("../validation"));
const billing_1 = __importStar(require("../../../../services/billing"));
/**
 * Send order to radiology
 * @param orderId Order ID
 * @param userId User ID
 * @returns Promise with result
 */
async function sendToRadiology(orderId, userId) {
    return (0, transaction_1.withTransaction)(async (client) => {
        // 1. Verify order exists and has status 'pending_admin'
        const order = await clinicalRecordManager.verifyOrderStatus(orderId);
        // 2. Check if patient has required information
        const patient = await validation.getPatientForValidation(order.patient_id);
        // 3. Check if patient has insurance information
        const insurance = await validation.getPrimaryInsurance(order.patient_id);
        // Validate patient and insurance data
        const missingPatientFields = validation.validatePatientFields(patient);
        const missingInsuranceFields = validation.validateInsuranceFields(insurance);
        // Combine all missing fields
        const missingFields = [...missingPatientFields, ...missingInsuranceFields];
        // If missing required fields, throw error
        if (missingFields.length > 0) {
            throw new Error(`Cannot send to radiology: Missing required information: ${missingFields.join(', ')}`);
        }
        // Get the organization ID from the order
        const organizationId = order.referring_organization_id;
        // Check if the organization has sufficient credits
        const hasCredits = await billing_1.default.hasCredits(organizationId);
        if (!hasCredits) {
            throw new billing_1.InsufficientCreditsError(`Organization ${organizationId} has insufficient credits to submit order to radiology`);
        }
        // Check if the organization account is active
        const orgStatusResult = await client.query('SELECT status FROM organizations WHERE id = $1', [organizationId]);
        if (orgStatusResult.rows.length === 0) {
            throw new Error(`Organization ${organizationId} not found`);
        }
        const orgStatus = orgStatusResult.rows[0].status;
        if (orgStatus !== 'active') {
            throw new Error(`Cannot send to radiology: Organization account is ${orgStatus}`);
        }
        // 4. Update order status to 'pending_radiology'
        await orderStatusManager.updateOrderStatusToRadiology(orderId, userId);
        // 5. Burn a credit for the order submission
        await billing_1.default.burnCredit({
            organizationId,
            userId,
            orderId,
            actionType: billing_1.CreditActionType.ORDER_SUBMITTED
        });
        // TODO: Implement notification to Radiology group (future enhancement)
        return {
            success: true,
            orderId,
            message: 'Order sent to radiology successfully'
        };
    });
}
exports.default = sendToRadiology;
//# sourceMappingURL=send-to-radiology.js.map