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
}
export default UploadsController;
