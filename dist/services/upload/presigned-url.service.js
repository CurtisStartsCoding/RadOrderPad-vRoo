"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUploadUrl = getUploadUrl;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const db_1 = require("../../config/db");
const config_1 = __importDefault(require("../../config/config"));
const s3_client_service_1 = __importDefault(require("./s3-client.service"));
/**
 * Generate a presigned URL for uploading a file to S3
 * @param fileType The MIME type of the file
 * @param fileName The name of the file
 * @param contentType The content type of the file
 * @param orderId Optional order ID to associate with the upload
 * @param patientId Optional patient ID to associate with the upload
 * @param documentType The type of document (e.g., 'signature', 'report', etc.)
 * @returns Object containing the presigned URL and the file key
 */
async function getUploadUrl(fileType, fileName, contentType, orderId, patientId, documentType = 'signature') {
    try {
        // Validate inputs
        if (!fileType || !fileName || !contentType) {
            throw new Error('Missing required parameters: fileType, fileName, or contentType');
        }
        // Ensure AWS credentials are configured
        if (!config_1.default.aws.accessKeyId || !config_1.default.aws.secretAccessKey || !config_1.default.aws.s3.bucketName) {
            throw new Error('AWS credentials or S3 bucket name not configured');
        }
        // Validate file type
        const allowedFileTypes = [
            'image/jpeg', 'image/png', 'image/gif', 'application/pdf',
            'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];
        if (!allowedFileTypes.includes(contentType)) {
            throw new Error(`File type ${contentType} is not allowed. Allowed types: ${allowedFileTypes.join(', ')}`);
        }
        // Generate a unique file key
        const timestamp = new Date().getTime();
        const randomString = Math.random().toString(36).substring(2, 15);
        const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
        // Get organization ID (we'll need to query for this based on the order or user)
        let organizationId = 0;
        if (orderId) {
            try {
                const orderResult = await (0, db_1.queryPhiDb)('SELECT referring_organization_id FROM orders WHERE id = $1', [orderId]);
                if (orderResult.rows.length > 0) {
                    organizationId = orderResult.rows[0].referring_organization_id;
                }
            }
            catch (error) {
                console.error('[FileUploadService] Error getting organization ID:', error);
            }
        }
        // Create a path structure following the specification:
        // uploads/{organization_id}/{context_type}/{id}/{uuid}_{filename}
        const contextType = orderId ? 'orders' : (patientId ? 'patients' : 'general');
        const contextId = orderId || patientId || 'no_id';
        const fileKey = `uploads/${organizationId}/${contextType}/${contextId}/${timestamp}_${randomString}_${sanitizedFileName}`;
        // Create the S3 command
        const command = new client_s3_1.PutObjectCommand({
            Bucket: config_1.default.aws.s3.bucketName,
            Key: fileKey,
            ContentType: contentType
        });
        // Generate the presigned URL
        const s3Client = s3_client_service_1.default.getClient();
        const presignedUrl = await (0, s3_request_presigner_1.getSignedUrl)(s3Client, command, { expiresIn: 3600 }); // URL expires in 1 hour
        console.log(`[FileUploadService] Generated presigned URL for ${fileKey}`);
        return {
            success: true,
            presignedUrl,
            filePath: fileKey
        };
    }
    catch (error) {
        console.error(`[FileUploadService] Error generating presigned URL: ${error.message}`);
        throw error;
    }
}
exports.default = getUploadUrl;
//# sourceMappingURL=presigned-url.service.js.map