import { s3ClientSingleton } from './s3-client.service';
import getUploadUrl from './presigned-url.service';
import confirmUpload from './document-upload.service';
/**
 * Service for handling file upload operations using AWS S3
 */
export class FileUploadService {
    /**
     * Initialize the S3 client
     */
    static getS3Client() {
        return s3ClientSingleton.getClient();
    }
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
    static async getUploadUrl(fileType, fileName, contentType, orderId, patientId, documentType = 'signature') {
        return getUploadUrl(fileType, fileName, contentType, orderId, patientId, documentType);
    }
    /**
     * Confirm a file upload and record it in the database
     * @param fileKey The S3 file key
     * @param orderId The order ID associated with the upload
     * @param patientId The patient ID associated with the upload
     * @param documentType The type of document
     * @param fileName The original file name
     * @param fileSize The size of the file in bytes
     * @param contentType The content type of the file
     * @param userId The user ID of the uploader
     * @param processingStatus The processing status of the document
     * @returns The ID of the created document record
     */
    static async confirmUpload(fileKey, orderId, patientId, documentType, fileName, fileSize, contentType, userId = 1, processingStatus = 'uploaded') {
        return confirmUpload(fileKey, orderId, patientId, documentType, fileName, fileSize, contentType, userId, processingStatus);
    }
}
export default FileUploadService;
// Also export individual functions for direct use
export { getUploadUrl, confirmUpload, s3ClientSingleton };
//# sourceMappingURL=index.js.map