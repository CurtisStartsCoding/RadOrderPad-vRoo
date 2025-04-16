"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPresignedUrl = getPresignedUrl;
const upload_1 = __importDefault(require("../../services/upload"));
const validate_presigned_url_request_1 = require("./validate-presigned-url-request");
/**
 * Generate a presigned URL for uploading a file to S3
 */
async function getPresignedUrl(req, res) {
    try {
        const { fileType, fileName, contentType, orderId, patientId, documentType } = req.body;
        // Validate the request
        if (!(0, validate_presigned_url_request_1.validatePresignedUrlRequest)(req, res)) {
            return;
        }
        // Generate presigned URL
        const result = await upload_1.default.getUploadUrl(fileType, fileName, contentType, orderId, patientId, documentType || 'document');
        res.status(200).json({
            success: result.success,
            uploadUrl: result.presignedUrl,
            fileKey: result.filePath
        });
    }
    catch (error) {
        console.error('[UploadsController] Error generating presigned URL:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to generate upload URL'
        });
    }
}
//# sourceMappingURL=get-presigned-url.js.map