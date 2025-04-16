import { Request, Response } from 'express';
/**
 * Validates that the user is authenticated
 * @param req Express request object
 * @param res Express response object
 * @returns The user ID if authenticated, undefined if not (response is sent in case of not authenticated)
 */
export declare function validateUserAuth(req: Request, res: Response): number | undefined;
