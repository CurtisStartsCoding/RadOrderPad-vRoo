/**
 * Validation for upload confirmation request
 */
import { Response } from 'express';
import { AuthenticatedRequest } from './types';
/**
 * Validate request for upload confirmation
 */
export declare function validateConfirmUploadRequest(req: AuthenticatedRequest, res: Response): Promise<boolean>;
