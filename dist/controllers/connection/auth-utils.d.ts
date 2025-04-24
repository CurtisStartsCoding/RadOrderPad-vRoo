import { Request, Response } from 'express';
import { AuthTokenPayload } from '../../models';
type AuthenticatedRequest = Request & {
    user?: AuthTokenPayload;
};
/**
 * Check if the user is authenticated and return the user's organization ID
 * @param req Express request object
 * @param res Express response object
 * @returns The user's organization ID if authenticated, null otherwise
 */
export declare function authenticateUser(req: AuthenticatedRequest, res: Response): {
    orgId: number;
    userId: number;
} | null;
export {};
