/**
 * Handler for presigned URL generation
 */
import { Response } from 'express';
import { AuthenticatedRequest } from './types';
/**
 * Generate a presigned URL for uploading a file to S3
 */
export declare function getPresignedUrl(req: AuthenticatedRequest, res: Response): Promise<void>;
