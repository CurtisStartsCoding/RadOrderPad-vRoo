interface UploadUrlParams {
    filename: string;
    contentType: string;
    context: 'order' | 'patient' | 'signature' | string;
    orgId: number;
    orderId?: number;
    patientId?: number;
    maxSizeBytes?: number;
    allowedTypes?: string[];
}
interface UploadUrlResult {
    success: boolean;
    presignedUrl?: string;
    filePath?: string;
    contentType?: string;
    expiresIn?: number;
    error?: string;
}
interface ConfirmUploadParams {
    filePath: string;
    fileSize: number;
    documentType: string;
    filename: string;
    mimeType: string;
    userId: number;
    orderId?: number;
    patientId?: number;
}
interface ConfirmUploadResult {
    success: boolean;
    documentId?: number;
    error?: string;
}
/**
 * Generates a presigned URL for uploading a file to S3
 *
 * @param params - Parameters for generating the upload URL
 * @returns Object containing the presigned URL and file path
 */
export declare function getUploadUrl({ filename, contentType, context, orgId, orderId, patientId, maxSizeBytes, // Default 10MB max
allowedTypes }: UploadUrlParams): Promise<UploadUrlResult>;
/**
 * Confirms a file upload by creating a record in the document_uploads table
 *
 * @param params - Parameters for confirming the upload
 * @returns Object containing the result of the confirmation
 */
export declare function confirmUpload({ filePath, fileSize, documentType, filename, mimeType, userId, orderId, patientId }: ConfirmUploadParams): Promise<ConfirmUploadResult>;
export {};
