import { PresignedUrlResponse } from './types';
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
export declare function getUploadUrl(fileType: string, fileName: string, contentType: string, orderId?: number, patientId?: number, documentType?: string): Promise<PresignedUrlResponse>;
export default getUploadUrl;
