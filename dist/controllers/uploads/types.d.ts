/**
 * Types for uploads controller
 */
import { Request } from 'express';
/**
 * Request body for getting a presigned URL
 */
export interface PresignedUrlRequestBody {
    fileType: string;
    fileName: string;
    contentType: string;
    orderId?: number;
    patientId?: number;
    documentType?: string;
    fileSize?: number;
}
/**
 * Response for presigned URL generation
 */
export interface PresignedUrlResponse {
    success: boolean;
    uploadUrl?: string;
    fileKey?: string;
    message?: string;
}
/**
 * Request body for confirming an upload
 */
export interface ConfirmUploadRequestBody {
    fileKey: string;
    orderId: number;
    patientId: number;
    documentType: string;
    fileName: string;
    fileSize: number;
    contentType: string;
    processingStatus?: string;
}
/**
 * Response for upload confirmation
 */
export interface ConfirmUploadResponse {
    success: boolean;
    documentId?: number;
    message?: string;
}
/**
 * Extended Express Request with user information
 */
export interface AuthenticatedRequest extends Request {
    user?: {
        userId: number;
        orgId: number;
        role: string;
        email: string;
    };
    body: PresignedUrlRequestBody | ConfirmUploadRequestBody | Record<string, unknown>;
}
