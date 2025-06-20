"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeTransaction = executeTransaction;
const db_1 = require("../../../../config/db");
const models_1 = require("../../../../models");
const patient_service_1 = __importDefault(require("../../../patient.service"));
const order_history_service_1 = __importDefault(require("../../../order-history.service"));
const authorization_1 = require("../authorization");
const update_1 = require("../update");
/**
 * Execute the order finalization transaction
 *
 * @param orderId The ID of the order to finalize
 * @param payload The finalize order payload
 * @param userId The ID of the user finalizing the order
 * @returns Promise that resolves with the finalization result
 */
async function executeTransaction(orderId, payload, userId) {
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
        await (0, authorization_1.verifyUserAuthorization)(userId, order.referring_organization_id);
        // Create transaction context
        const context = {
            client,
            orderId,
            order,
            userId,
            payload
        };
        // Handle temporary patient if needed
        let patientId = order.patient_id;
        if (payload.isTemporaryPatient && payload.patientInfo) {
            patientId = await patient_service_1.default.createTemporaryPatient(client, order.referring_organization_id, payload.patientInfo);
        }
        // Update the order
        await (0, update_1.updateOrderWithFinalData)(client, orderId, patientId, payload, userId);
        // Generate presigned URL for signature upload if needed
        let signatureUploadInfo = null;
        if (payload.signatureData) {
            // For backward compatibility, if signatureData is provided as base64,
            // we'll log a warning but still proceed with the order finalization
            console.warn('Base64 signature data provided. This flow is deprecated. Frontend should use presigned URL flow instead.');
        }
        // Note: The frontend should request a presigned URL for signature upload separately
        // using the /api/uploads/presigned-url endpoint, then upload the signature directly to S3,
        // and finally confirm the upload using the /api/uploads/confirm endpoint
        // Log order history
        const eventType = payload.overridden ? 'override' : 'signed';
        await order_history_service_1.default.logOrderHistory(client, orderId, userId, order.status, models_1.OrderStatus.PENDING_ADMIN, eventType);
        // Commit transaction
        await client.query('COMMIT');
        return {
            success: true,
            orderId,
            message: "Order submitted successfully.",
            signatureUploadNote: payload.signatureData ?
                "DEPRECATED: Base64 signature data provided. Future versions will require using the presigned URL flow." :
                "For signature uploads, use the /api/uploads/presigned-url endpoint to get a URL, upload directly to S3, then confirm with /api/uploads/confirm."
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
//# sourceMappingURL=execute-transaction.js.map