import FileUploadService from '../../services/upload';
import { validateConfirmUploadRequest } from './validate-confirm-upload-request';
/**
 * Confirm a file upload and record it in the database
 */
export async function confirmUpload(req, res) {
    try {
        const { fileKey, orderId, patientId, documentType, fileName, fileSize, contentType, processingStatus = 'uploaded' // Default to 'uploaded' if not provided
         } = req.body;
        // Validate the request
        if (!(await validateConfirmUploadRequest(req, res))) {
            return;
        }
        const userId = req.user?.userId;
        // Confirm upload
        const result = await FileUploadService.confirmUpload(fileKey, orderId, patientId, documentType, fileName, fileSize, contentType, userId, processingStatus);
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
//# sourceMappingURL=confirm-upload.js.map