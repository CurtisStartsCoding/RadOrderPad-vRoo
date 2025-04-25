"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleValidationRequest = handleValidationRequest;
/**
 * Main handler for validation requests
 */
const validation_1 = __importDefault(require("../../../services/validation"));
const draft_order_1 = require("./draft-order");
const attempt_tracking_1 = require("./attempt-tracking");
const logger_1 = __importDefault(require("../../../utils/logger"));
/**
 * Handle validation request for an order
 *
 * @param dictationText - The dictation text to validate
 * @param patientInfo - Information about the patient
 * @param userId - The ID of the user requesting validation
 * @param orgId - The ID of the organization
 * @param orderId - Optional ID of an existing order
 * @param isOverrideValidation - Whether this is an override validation
 * @param radiologyOrganizationId - Optional ID of the radiology organization
 * @returns Object containing success status, order ID, and validation result
 */
async function handleValidationRequest(dictationText, patientInfo, userId, orgId, orderId, isOverrideValidation = false, radiologyOrganizationId) {
    try {
        let orderIdToUse;
        let attemptNumber = 1;
        // If no orderId provided, create a draft order
        if (!orderId) {
            orderIdToUse = await (0, draft_order_1.createDraftOrder)(dictationText, userId, patientInfo, radiologyOrganizationId);
        }
        else {
            orderIdToUse = orderId;
            // Get the current attempt number for this order
            attemptNumber = await (0, attempt_tracking_1.getNextAttemptNumber)(orderIdToUse);
        }
        // Call the validation engine
        const validationContext = {
            patientInfo,
            userId,
            orgId,
            orderId: orderIdToUse,
            isOverrideValidation
        };
        const validationResult = await validation_1.default.runValidation(dictationText, validationContext);
        // Log the validation attempt in the PHI database
        await (0, attempt_tracking_1.logValidationAttempt)(orderIdToUse, attemptNumber, dictationText, validationResult, userId);
        // Return the validation result without credit consumption
        return {
            success: true,
            orderId: orderIdToUse,
            validationResult
        };
    }
    catch (error) {
        logger_1.default.error('Error handling validation request:', { error });
        // If it's our custom error object with status, pass it through
        if (error && typeof error === 'object' && 'status' in error) {
            throw error;
        }
        // Otherwise wrap in a generic error
        throw error;
    }
}
//# sourceMappingURL=handler.js.map