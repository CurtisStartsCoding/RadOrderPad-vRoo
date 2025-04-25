/**
 * Uploads controller module
 *
 * This module provides functionality for handling file uploads,
 * including generating presigned URLs and confirming uploads.
 */
export * from './types';
export { validatePresignedUrlRequest } from './validate-presigned-url-request';
export { validateConfirmUploadRequest } from './validate-confirm-upload-request';
export { getPresignedUrl } from './get-presigned-url';
export { confirmUpload } from './confirm-upload';
export { getDownloadUrl } from './get-download-url.controller';
import { Request, Response } from 'express';
/**
 * Controller for handling file uploads
 */
export declare class UploadsController {
    /**
     * Generate a presigned URL for uploading a file to S3
     */
    static getPresignedUrl(req: Request, res: Response): Promise<void>;
    /**
     * Confirm a file upload and record it in the database
     */
    static confirmUpload(req: Request, res: Response): Promise<void>;
    /**
     * Generate a presigned URL for downloading a file from S3
     */
    static getDownloadUrl(req: Request, res: Response): Promise<void>;
}
export default UploadsController;
