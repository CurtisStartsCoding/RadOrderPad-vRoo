"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadsController = void 0;
const upload_1 = __importDefault(require("../services/upload"));
const db_1 = require("../config/db");
/**
 * Controller for handling file uploads
 */
class UploadsController {
    /**
     * Generate a presigned URL for uploading a file to S3
     */
    static async getPresignedUrl(req, res) {
        try {
            const { fileType, fileName, contentType, orderId, patientId, documentType, fileSize } = req.body;
            // Validate required fields
            if (!fileType || !fileName || !contentType) {
                res.status(400).json({
                    success: false,
                    message: 'Missing required fields: fileType, fileName, or contentType'
                });
                return;
            }
            // Validate file size if provided
            if (fileSize) {
                const maxSizeBytes = fileType === 'application/pdf'
                    ? 20 * 1024 * 1024 // 20MB for PDFs
                    : 5 * 1024 * 1024; // 5MB for other files
                if (fileSize > maxSizeBytes) {
                    res.status(400).json({
                        success: false,
                        message: `File size (${Math.round(fileSize / (1024 * 1024))}MB) exceeds the maximum allowed size (${Math.round(maxSizeBytes / (1024 * 1024))}MB)`
                    });
                    return;
                }
            }
            // Validate file type
            const allowedFileTypes = [
                'image/jpeg', 'image/png', 'image/gif', 'application/pdf',
                'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ];
            if (!allowedFileTypes.includes(contentType)) {
                res.status(400).json({
                    success: false,
                    message: `File type ${contentType} is not allowed. Allowed types: ${allowedFileTypes.join(', ')}`
                });
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
    /**
     * Confirm a file upload and record it in the database
     */
    static async confirmUpload(req, res) {
        try {
            const { fileKey, orderId, patientId, documentType, fileName, fileSize, contentType, processingStatus = 'uploaded' // Default to 'uploaded' if not provided
             } = req.body;
            // Validate required fields
            if (!fileKey || !orderId || !patientId || !documentType || !fileName || !fileSize || !contentType) {
                res.status(400).json({
                    success: false,
                    message: 'Missing required fields'
                });
                return;
            }
            // Verify that the order exists and belongs to the user's organization
            const userId = req.user?.userId;
            const userOrgId = req.user?.orgId;
            if (!userId || !userOrgId) {
                res.status(401).json({
                    success: false,
                    message: 'Unauthorized'
                });
                return;
            }
            // Verify order exists and belongs to user's organization
            const orderResult = await (0, db_1.queryPhiDb)('SELECT referring_organization_id FROM orders WHERE id = $1', [orderId]);
            if (orderResult.rows.length === 0) {
                res.status(404).json({
                    success: false,
                    message: 'Order not found'
                });
                return;
            }
            const order = orderResult.rows[0];
            if (order.referring_organization_id !== userOrgId) {
                res.status(403).json({
                    success: false,
                    message: 'You do not have permission to access this order'
                });
                return;
            }
            // Confirm upload
            const result = await upload_1.default.confirmUpload(fileKey, orderId, patientId, documentType, fileName, fileSize, contentType, userId, processingStatus);
            res.status(200).json({
                success: result.success,
                documentId: result.documentId,
                message: 'Upload confirmed and recorded'
            });
        }
        catch (error) {
            console.error('[UploadsController] Error confirming upload:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to confirm upload'
            });
        }
    }
}
exports.UploadsController = UploadsController;
exports.default = UploadsController;
//# sourceMappingURL=uploads.controller.js.map