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
exports.handleValidationRequest = handleValidationRequest;
const db_1 = require("../../config/db");
const models_1 = require("../../models");
const validation_service_1 = __importDefault(require("../validation.service"));
const billing_service_1 = __importStar(require("../billing.service"));
/**
 * Handle validation request for an order
 */
async function handleValidationRequest(dictationText, patientInfo, userId, orgId, orderId, isOverrideValidation = false, radiologyOrganizationId) {
    try {
        let orderIdToUse;
        let attemptNumber = 1;
        // If no orderId provided, create a draft order
        if (!orderId) {
            orderIdToUse = await createDraftOrder(dictationText, userId, patientInfo, radiologyOrganizationId);
        }
        else {
            orderIdToUse = orderId;
            // Get the current attempt number for this order
            attemptNumber = await getNextAttemptNumber(orderIdToUse);
        }
        // Call the validation engine
        const validationContext = {
            patientInfo,
            userId,
            orgId,
            orderId: orderIdToUse,
            isOverrideValidation
        };
        const validationResult = await validation_service_1.default.runValidation(dictationText, validationContext);
        // Log the validation attempt in the PHI database
        await logValidationAttempt(orderIdToUse, attemptNumber, dictationText, validationResult, userId);
        // Log credit usage
        const actionType = isOverrideValidation ? 'override_validate' : 'validate';
        try {
            await billing_service_1.default.burnCredit(orgId, userId, orderIdToUse, actionType);
            return {
                success: true,
                orderId: orderIdToUse,
                validationResult
            };
        }
        catch (error) {
            // Handle insufficient credits error
            if (error instanceof billing_service_1.InsufficientCreditsError) {
                console.warn(`Insufficient credits for organization ${orgId}: ${error.message}`);
                throw {
                    status: 402, // Payment Required
                    message: 'Insufficient validation credits. Please contact your administrator to purchase more credits.',
                    code: 'INSUFFICIENT_CREDITS',
                    orderId: orderIdToUse
                };
            }
            // Re-throw other errors
            throw error;
        }
    }
    catch (error) {
        console.error('Error handling validation request:', error);
        // If it's our custom error object with status, pass it through
        if (error && typeof error === 'object' && 'status' in error) {
            throw error;
        }
        // Otherwise wrap in a generic error
        throw error;
    }
}
/**
 * Create a new draft order
 */
async function createDraftOrder(dictationText, userId, patientInfo, radiologyOrganizationId) {
    // Get user information to determine organization
    const userResult = await (0, db_1.queryMainDb)('SELECT organization_id FROM users WHERE id = $1', [userId]);
    if (userResult.rows.length === 0) {
        throw new Error('User not found');
    }
    const user = userResult.rows[0];
    // Extract patient ID from patientInfo
    const patientId = patientInfo?.id;
    if (!patientId) {
        throw new Error('Patient ID is required');
    }
    // Use default radiology organization ID if not provided
    const radOrgId = radiologyOrganizationId || 1; // Default to 1 if not provided
    // Create a new order in the PHI database
    const orderResult = await (0, db_1.queryPhiDb)(`INSERT INTO orders
    (order_number, referring_organization_id, radiology_organization_id,
    created_by_user_id, status, priority, original_dictation, patient_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING id`, [
        `ORD-${Date.now()}`, // Generate a temporary order number
        user.organization_id, // Referring organization
        radOrgId, // Radiology organization
        userId, // Created by user
        models_1.OrderStatus.PENDING_VALIDATION, // Status
        models_1.OrderPriority.ROUTINE, // Priority
        dictationText, // Original dictation
        patientId // Patient ID
    ]);
    const orderId = orderResult.rows[0].id;
    // Create order history entry
    await (0, db_1.queryPhiDb)(`INSERT INTO order_history 
    (order_id, user_id, event_type, new_status, created_at) 
    VALUES ($1, $2, $3, $4, NOW())`, [
        orderId,
        userId,
        'created',
        models_1.OrderStatus.PENDING_VALIDATION
    ]);
    return orderId;
}
/**
 * Get the next attempt number for an order
 */
async function getNextAttemptNumber(orderId) {
    const attemptResult = await (0, db_1.queryPhiDb)('SELECT MAX(attempt_number) as max_attempt FROM validation_attempts WHERE order_id = $1', [orderId]);
    if (attemptResult.rows.length > 0 && attemptResult.rows[0].max_attempt) {
        return attemptResult.rows[0].max_attempt + 1;
    }
    return 1;
}
/**
 * Log a validation attempt
 */
async function logValidationAttempt(orderId, attemptNumber, dictationText, validationResult, userId) {
    await (0, db_1.queryPhiDb)(`INSERT INTO validation_attempts 
    (order_id, attempt_number, validation_input_text, validation_outcome, 
    generated_icd10_codes, generated_cpt_codes, generated_feedback_text, 
    generated_compliance_score, user_id, created_at) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())`, [
        orderId,
        attemptNumber,
        dictationText,
        validationResult.validationStatus,
        JSON.stringify(validationResult.suggestedICD10Codes),
        JSON.stringify(validationResult.suggestedCPTCodes),
        validationResult.feedback,
        validationResult.complianceScore,
        userId
    ]);
}
//# sourceMappingURL=validation-request.js.map