/**
 * Handler for upload confirmation
 */
import { Response } from 'express';
import { AuthenticatedRequest } from './types';
/**
 * Confirm a file upload and record it in the database
 */
export declare function confirmUpload(req: AuthenticatedRequest, res: Response): Promise<void>;
