"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processSignature = processSignature;
const client_s3_1 = require("@aws-sdk/client-s3");
const db_1 = require("../../config/db");
const config_1 = __importDefault(require("../../config/config"));
const s3_client_service_1 = __importDefault(require("./s3-client.service"));
/**
 * Process a signature upload (for backward compatibility with existing code)
 *
 * Note: This method might be redundant if the frontend converts the canvas to a Blob/File
 * and uses the standard presigned URL flow. Consider deprecating this method in the future.
 *
 * @param orderId The order ID
 * @param signatureData Base64 encoded signature data
 * @param userId The user ID of the uploader
 * @returns The URL of the uploaded signature or null if no signature data provided
 */
async function processSignature(orderId, signatureData, userId = 1 // Default to 1 if not provided
) {
    if (!signatureData) {
        return null;
    }
    try {
        // Get order details to get patient ID
        const orderResult = await (0, db_1.queryPhiDb)('SELECT patient_id FROM orders WHERE id = $1', [orderId]);
        if (orderResult.rows.length === 0) {
            throw new Error(`Order not found: ${orderId}`);
        }
        const patientId = orderResult.rows[0].patient_id;
        // Get organization ID
        const orgResult = await (0, db_1.queryPhiDb)('SELECT referring_organization_id FROM orders WHERE id = $1', [orderId]);
        const organizationId = orgResult.rows[0].referring_organization_id;
        // Generate a unique file key for the signature
        const timestamp = new Date().getTime();
        const randomString = Math.random().toString(36).substring(2, 15);
        const fileName = `signature_${orderId}.png`;
        const contentType = 'image/png';
        // Create a path structure following the specification:
        // uploads/{organization_id}/orders/{order_id}/signatures/{timestamp}_{randomString}_{filename}
        const fileKey = `uploads/${organizationId}/orders/${orderId}/signatures/${timestamp}_${randomString}_${fileName}`;
        try {
            // Convert base64 data to binary
            const base64Data = signatureData.replace(/^data:image\/png;base64,/, '');
            const binaryData = Buffer.from(base64Data, 'base64');
            // Upload the signature to S3 directly
            const s3Client = s3_client_service_1.default.getClient();
            await s3Client.send(new client_s3_1.PutObjectCommand({
                Bucket: config_1.default.aws.s3.bucketName,
                Key: fileKey,
                Body: binaryData,
                ContentType: contentType
            }));
            // Generate the S3 URL for reference (not stored in DB anymore)
            const fileUrl = `https://${config_1.default.aws.s3.bucketName}.s3.${config_1.default.aws.region}.amazonaws.com/${fileKey}`;
            // Record the upload in the database
            await (0, db_1.queryPhiDb)(`INSERT INTO document_uploads
        (user_id, order_id, patient_id, document_type, filename, file_size, mime_type, file_path, processing_status, uploaded_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())`, [userId, orderId, patientId, 'signature', fileName, binaryData.length, contentType, fileKey, 'uploaded']);
            console.log(`[FileUploadService] Signature uploaded successfully for order ${orderId}`);
            return fileUrl;
        }
        catch (error) {
            console.error(`[FileUploadService] Error uploading signature: ${error.message}`);
            throw error;
        }
    }
    catch (error) {
        console.error('[FileUploadService] Error processing signature:', error);
        throw new Error(`Failed to process signature: ${error.message || 'Unknown error'}`);
    }
}
exports.default = processSignature;
//# sourceMappingURL=signature-processing.service.js.map