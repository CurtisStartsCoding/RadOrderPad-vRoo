"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleFinalizeOrder = handleFinalizeOrder;
const db_1 = require("../../config/db");
const models_1 = require("../../models");
const upload_1 = __importDefault(require("../upload"));
const patient_service_1 = __importDefault(require("../patient.service"));
const order_history_service_1 = __importDefault(require("../order-history.service"));
/**
 * Handle finalization of an order
 */
async function handleFinalizeOrder(orderId, payload, userId) {
    // Get a client for transaction
    const client = await (0, db_1.getPhiDbClient)();
    try {
        // Start transaction
        await client.query('BEGIN');
        // Find the draft order
        const orderResult = await client.query('SELECT * FROM orders WHERE id = $1', [orderId]);
        if (orderResult.rows.length === 0) {
            throw new Error('Order not found');
        }
        const order = orderResult.rows[0];
        // Verify authorization (user belongs to the referring organization)
        await verifyUserAuthorization(userId, order.referring_organization_id);
        // Handle temporary patient if needed
        let patientId = order.patient_id;
        if (payload.isTemporaryPatient && payload.patientInfo) {
            patientId = await patient_service_1.default.createTemporaryPatient(client, order.referring_organization_id, payload.patientInfo);
        }
        // Update the order
        await updateOrderWithFinalData(client, orderId, patientId, payload, userId);
        // Handle signature upload if provided
        if (payload.signatureData) {
            await handleSignatureUpload(orderId, payload.signatureData, userId);
        }
        // Log order history
        const eventType = payload.overridden ? 'override' : 'signed';
        await order_history_service_1.default.logOrderHistory(client, orderId, userId, order.status, models_1.OrderStatus.PENDING_ADMIN, eventType);
        // Commit transaction
        await client.query('COMMIT');
        return {
            success: true,
            orderId,
            message: "Order submitted successfully."
        };
    }
    catch (error) {
        // Rollback transaction on error
        await client.query('ROLLBACK');
        console.error('Error finalizing order:', error);
        throw error;
    }
    finally {
        // Release client back to pool
        client.release();
    }
}
/**
 * Verify that the user belongs to the referring organization
 */
async function verifyUserAuthorization(userId, referringOrgId) {
    const userResult = await (0, db_1.queryMainDb)('SELECT organization_id FROM users WHERE id = $1', [userId]);
    if (userResult.rows.length === 0) {
        throw new Error('User not found');
    }
    const user = userResult.rows[0];
    if (user.organization_id !== referringOrgId) {
        throw new Error('Unauthorized: User does not belong to the referring organization');
    }
}
/**
 * Update the order with final data
 */
async function updateOrderWithFinalData(client, orderId, patientId, payload, userId) {
    await client.query(`UPDATE orders SET
    patient_id = $1,
    status = $2,
    clinical_indication = $3,
    final_cpt_code = $4,
    final_cpt_code_description = $5,
    final_icd10_codes = $6,
    final_icd10_code_descriptions = $7,
    final_validation_status = $8,
    final_compliance_score = $9,
    overridden = $10,
    override_justification = $11,
    is_urgent_override = $12,
    signed_by_user_id = $13,
    signature_date = NOW(),
    validated_at = NOW(),
    updated_at = NOW(),
    updated_by_user_id = $14
    WHERE id = $15`, [
        patientId,
        models_1.OrderStatus.PENDING_ADMIN,
        payload.clinicalIndication,
        payload.finalCPTCode,
        payload.finalCPTCodeDescription,
        payload.finalICD10Codes,
        payload.finalICD10CodeDescriptions,
        payload.finalValidationStatus,
        payload.finalComplianceScore,
        payload.overridden || false,
        payload.overrideJustification || null,
        payload.isUrgentOverride || false,
        userId, // Signed by the current user
        userId, // Updated by the current user
        orderId
    ]);
}
/**
 * Handle signature upload
 */
async function handleSignatureUpload(orderId, signatureData, userId) {
    const signatureUrl = await upload_1.default.processSignature(orderId, signatureData);
    if (signatureUrl) {
        // The signature has been uploaded to S3 and recorded in the document_uploads table
        console.log(`Signature uploaded: ${signatureUrl}`);
    }
}
//# sourceMappingURL=finalize-order.js.map