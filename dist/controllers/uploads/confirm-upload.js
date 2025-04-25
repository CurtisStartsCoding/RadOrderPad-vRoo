"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmUpload = confirmUpload;
const upload_1 = __importDefault(require("../../services/upload"));
const validate_confirm_upload_request_1 = require("./validate-confirm-upload-request");
const logger_1 = __importDefault(require("../../utils/logger"));
/**
 * Confirm a file upload and record it in the database
 */
async function confirmUpload(req, res) {
    try {
        const { fileKey, orderId, patientId, documentType, fileName, fileSize, contentType, processingStatus = 'uploaded' // Default to 'uploaded' if not provided
         } = req.body;
        // Validate the request
        if (!(await (0, validate_confirm_upload_request_1.validateConfirmUploadRequest)(req, res))) {
            return;
        }
        const userId = req.user?.userId;
        // Confirm upload
        const result = await upload_1.default.confirmUpload(fileKey, orderId, patientId, documentType, fileName, fileSize, contentType, userId, processingStatus);
        res.status(200).json({
            success: result.success,
            documentId: result.documentId,
            message: 'Upload confirmed and recorded'
        });
    }
    catch (error) {
        logger_1.default.error('[UploadsController] Error confirming upload:', {
            error,
            userId: req.user?.userId,
            orderId: req.body?.orderId
        });
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to confirm upload'
        });
    }
}
//# sourceMappingURL=confirm-upload.js.map