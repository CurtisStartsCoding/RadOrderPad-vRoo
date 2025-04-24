"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.s3ClientSingleton = exports.confirmUpload = exports.getUploadUrl = exports.FileUploadService = void 0;
const s3_client_service_1 = require("./s3-client.service");
Object.defineProperty(exports, "s3ClientSingleton", { enumerable: true, get: function () { return s3_client_service_1.s3ClientSingleton; } });
const presigned_url_service_1 = __importDefault(require("./presigned-url.service"));
exports.getUploadUrl = presigned_url_service_1.default;
const document_upload_service_1 = __importDefault(require("./document-upload.service"));
exports.confirmUpload = document_upload_service_1.default;
/**
 * Service for handling file upload operations using AWS S3
 */
class FileUploadService {
    /**
     * Initialize the S3 client
     */
    static getS3Client() {
        return s3_client_service_1.s3ClientSingleton.getClient();
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
    static async getUploadUrl(fileType, fileName, contentType, orderId, patientId, documentType = 'signature', fileSize) {
        return (0, presigned_url_service_1.default)(fileType, fileName, contentType, orderId, patientId, documentType, fileSize);
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
        return (0, document_upload_service_1.default)(fileKey, orderId, patientId, documentType, fileName, fileSize, contentType, userId, processingStatus);
    }
}
exports.FileUploadService = FileUploadService;
exports.default = FileUploadService;
//# sourceMappingURL=index.js.map