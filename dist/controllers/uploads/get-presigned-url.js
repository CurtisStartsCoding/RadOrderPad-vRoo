import FileUploadService from '../../services/upload';
import { validatePresignedUrlRequest } from './validate-presigned-url-request';
/**
 * Generate a presigned URL for uploading a file to S3
 */
export async function getPresignedUrl(req, res) {
    try {
        const { fileType, fileName, contentType, orderId, patientId, documentType } = req.body;
        // Validate the request
        if (!validatePresignedUrlRequest(req, res)) {
            return;
        }
        // Generate presigned URL
        const result = await FileUploadService.getUploadUrl(fileType, fileName, contentType, orderId, patientId, documentType || 'document');
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