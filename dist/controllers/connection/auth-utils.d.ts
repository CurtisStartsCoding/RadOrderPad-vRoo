import { Request, Response } from 'express';
/**
 * Check if the user is authenticated and return the user's organization ID
 * @param req Express request object
 * @param res Express response object
 * @returns The user's organization ID if authenticated, null otherwise
 */
export declare function authenticateUser(req: Request, res: Response): {
    orgId: number;
    userId: number;
} | null;
