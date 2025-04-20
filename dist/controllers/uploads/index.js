/**
 * Uploads controller module
 *
 * This module provides functionality for handling file uploads,
 * including generating presigned URLs and confirming uploads.
 */
// Export types
export * from './types';
// Export validation functions
export { validatePresignedUrlRequest } from './validate-presigned-url-request';
export { validateConfirmUploadRequest } from './validate-confirm-upload-request';
// Export handler functions
export { getPresignedUrl } from './get-presigned-url';
export { confirmUpload } from './confirm-upload';
import { getPresignedUrl } from './get-presigned-url';
import { confirmUpload } from './confirm-upload';
/**
 * Controller for handling file uploads
 */
export class UploadsController {
    /**
     * Generate a presigned URL for uploading a file to S3
     */
    static async getPresignedUrl(req, res) {
        return getPresignedUrl(req, res);
    }
    /**
     * Confirm a file upload and record it in the database
     */
    static async confirmUpload(req, res) {
        return confirmUpload(req, res);
    }
}
// Export UploadsController as default for backward compatibility
export default UploadsController;
//# sourceMappingURL=index.js.map