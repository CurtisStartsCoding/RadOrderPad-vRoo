"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPresignedUrl = getPresignedUrl;
const upload_1 = __importDefault(require("../../services/upload"));
const validate_presigned_url_request_1 = require("./validate-presigned-url-request");
const logger_1 = __importDefault(require("../../utils/logger"));
/**
 * Generate a presigned URL for uploading a file to S3
 */
async function getPresignedUrl(req, res) {
    try {
        // Ensure user is authenticated
        if (!req.user || !req.user.userId || !req.user.orgId) {
            logger_1.default.warn('Unauthorized attempt to get presigned URL', {
                ip: req.ip,
                path: req.path
            });
            res.status(401).json({
                success: false,
                message: 'Unauthorized: User authentication required'
            });
            return;
        }
        const { fileType, fileName, contentType, orderId, patientId, documentType, fileSize } = req.body;
        logger_1.default.debug('Presigned URL request received', {
            userId: req.user.userId,
            orgId: req.user.orgId,
            fileType,
            fileName,
            contentType,
            orderId,
            patientId,
            documentType,
            fileSize
        });
        // Validate the request
        if (!(0, validate_presigned_url_request_1.validatePresignedUrlRequest)(req, res)) {
            return;
        }
        // Generate presigned URL
        const result = await upload_1.default.getUploadUrl(fileType, fileName, contentType, orderId, patientId, documentType || 'document', fileSize);
        logger_1.default.info('Presigned URL generated successfully', {
            userId: req.user.userId,
            fileKey: result.filePath
        });
        res.status(200).json({
            success: result.success,
            uploadUrl: result.presignedUrl,
            fileKey: result.filePath
        });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to generate upload URL';
        const errorStack = error instanceof Error ? error.stack : undefined;
        logger_1.default.error('Error generating presigned URL', {
            error: errorMessage,
            stack: errorStack,
            userId: req.user?.userId,
            orgId: req.user?.orgId
        });
        res.status(500).json({
            success: false,
            message: errorMessage
        });
    }
}
//# sourceMappingURL=get-presigned-url.js.map