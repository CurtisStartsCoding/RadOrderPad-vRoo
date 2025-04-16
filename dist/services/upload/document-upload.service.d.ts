import { UploadConfirmationResponse } from './types';
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
export declare function confirmUpload(fileKey: string, orderId: number, patientId: number, documentType: string, fileName: string, fileSize: number, contentType: string, userId?: number, // Default to 1 if not provided
processingStatus?: string): Promise<UploadConfirmationResponse>;
export default confirmUpload;
