"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUploadUrl = getUploadUrl;
exports.confirmUpload = confirmUpload;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const uuid_1 = require("uuid");
const config_1 = __importDefault(require("../config/config"));
const db_1 = require("../config/db");
/**
 * Generates a presigned URL for uploading a file to S3
 *
 * @param params - Parameters for generating the upload URL
 * @returns Object containing the presigned URL and file path
 */
async function getUploadUrl({ filename, contentType, context, orgId, orderId, patientId, maxSizeBytes = 10 * 1024 * 1024, // Default 10MB max
allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain'] }) {
    try {
        // Validate input parameters
        if (!filename || !contentType || !context || !orgId) {
            throw new Error('Missing required parameters: filename, contentType, context, orgId');
        }
        if (context === 'order' && !orderId) {
            throw new Error('orderId is required when context is "order"');
        }
        if (context === 'patient' && !patientId) {
            throw new Error('patientId is required when context is "patient"');
        }
        // Validate file type
        if (allowedTypes.length > 0 && !allowedTypes.includes(contentType)) {
            throw new Error(`File type ${contentType} is not allowed. Allowed types: ${allowedTypes.join(', ')}`);
        }
        // Validate AWS credentials
        if (!config_1.default.aws.accessKeyId || !config_1.default.aws.secretAccessKey || !config_1.default.aws.s3.bucketName) {
            throw new Error('AWS credentials or bucket name not configured');
        }
        // Initialize S3 client with credentials from config
        const s3Client = new client_s3_1.S3Client({
            region: config_1.default.aws.region,
            credentials: {
                accessKeyId: config_1.default.aws.accessKeyId,
                secretAccessKey: config_1.default.aws.secretAccessKey
            }
        });
        // Generate a unique file path in S3
        const uuid = (0, uuid_1.v4)();
        const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_'); // Sanitize filename
        // Construct the S3 key (file path) based on context
        let filePath;
        if (context === 'order') {
            filePath = `uploads/${orgId}/orders/${orderId}/${uuid}_${sanitizedFilename}`;
        }
        else if (context === 'patient') {
            filePath = `uploads/${orgId}/patients/${patientId}/${uuid}_${sanitizedFilename}`;
        }
        else if (context === 'signature') {
            filePath = `uploads/${orgId}/signatures/${orderId}/${uuid}_${sanitizedFilename}`;
        }
        else {
            filePath = `uploads/${orgId}/${context}/${uuid}_${sanitizedFilename}`;
        }
        // Create the S3 PutObject command
        const putObjectCommand = new client_s3_1.PutObjectCommand({
            Bucket: config_1.default.aws.s3.bucketName,
            Key: filePath,
            ContentType: contentType,
            // Add optional metadata
            Metadata: {
                'original-filename': filename,
                'upload-context': context,
                'organization-id': orgId.toString(),
                ...(orderId && { 'order-id': orderId.toString() }),
                ...(patientId && { 'patient-id': patientId.toString() })
            }
        });
        // Generate the presigned URL (expires in 15 minutes)
        const presignedUrl = await (0, s3_request_presigner_1.getSignedUrl)(s3Client, putObjectCommand, {
            expiresIn: 900 // 15 minutes in seconds
        });
        return {
            success: true,
            presignedUrl,
            filePath,
            contentType,
            expiresIn: 900
        };
    }
    catch (error) {
        console.error('Error generating presigned URL:', error);
        return {
            success: false,
            error: error.message || 'Failed to generate upload URL'
        };
    }
}
/**
 * Confirms a file upload by creating a record in the document_uploads table
 *
 * @param params - Parameters for confirming the upload
 * @returns Object containing the result of the confirmation
 */
async function confirmUpload({ filePath, fileSize, documentType, filename, mimeType, userId, orderId, patientId }) {
    try {
        // Validate input parameters
        if (!filePath || !fileSize || !documentType || !filename || !userId) {
            throw new Error('Missing required parameters: filePath, fileSize, documentType, filename, userId');
        }
        // Validate AWS credentials
        if (!config_1.default.aws.accessKeyId || !config_1.default.aws.secretAccessKey || !config_1.default.aws.s3.bucketName) {
            throw new Error('AWS credentials or bucket name not configured');
        }
        // Verify the file exists in S3 before creating the database record
        const s3Client = new client_s3_1.S3Client({
            region: config_1.default.aws.region,
            credentials: {
                accessKeyId: config_1.default.aws.accessKeyId,
                secretAccessKey: config_1.default.aws.secretAccessKey
            }
        });
        // Check if the file exists in S3
        try {
            const headObjectCommand = new client_s3_1.HeadObjectCommand({
                Bucket: config_1.default.aws.s3.bucketName,
                Key: filePath
            });
            await s3Client.send(headObjectCommand);
        }
        catch (s3Error) {
            console.error('Error verifying file in S3:', s3Error);
            return {
                success: false,
                error: 'File not found in S3. Upload may have failed or not completed yet.'
            };
        }
        // Insert record into document_uploads table
        const insertQuery = `
      INSERT INTO document_uploads (
        user_id,
        order_id,
        patient_id,
        document_type,
        filename,
        file_path,
        file_size,
        mime_type,
        processing_status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id
    `;
        const queryParams = [
            userId,
            orderId || null,
            patientId || null,
            documentType,
            filename,
            filePath,
            fileSize,
            mimeType,
            'uploaded' // Default processing status
        ];
        const result = await (0, db_1.queryPhiDb)(insertQuery, queryParams);
        if (result.rows && result.rows.length > 0) {
            return {
                success: true,
                documentId: result.rows[0].id
            };
        }
        else {
            throw new Error('Failed to insert document record');
        }
    }
    catch (error) {
        console.error('Error confirming upload:', error);
        return {
            success: false,
            error: error.message || 'Failed to confirm upload'
        };
    }
}
//# sourceMappingURL=fileUpload.service.js.map