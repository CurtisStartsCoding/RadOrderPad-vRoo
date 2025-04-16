import { Request, Response } from 'express';
/**
 * Validates the finalize order payload
 * @param req Express request object
 * @param res Express response object
 * @returns true if valid, false if invalid (response is sent in case of invalid)
 */
export declare function validateFinalizePayload(req: Request, res: Response): boolean;
