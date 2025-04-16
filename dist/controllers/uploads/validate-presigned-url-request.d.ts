/**
 * Validation for presigned URL request
 */
import { Response } from 'express';
import { AuthenticatedRequest } from './types';
/**
 * Validate request for presigned URL generation
 */
export declare function validatePresignedUrlRequest(req: AuthenticatedRequest, res: Response): boolean;
