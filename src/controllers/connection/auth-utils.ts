import { Request, Response } from 'express';
import { AuthTokenPayload } from '../../models';

// Define a custom type for authenticated requests
type AuthenticatedRequest = Request & {
  user?: AuthTokenPayload;
};

/**
 * Check if the user is authenticated and return the user's organization ID
 * @param req Express request object
 * @param res Express response object
 * @returns The user's organization ID if authenticated, null otherwise
 */
export function authenticateUser(req: AuthenticatedRequest, res: Response): { orgId: number; userId: number } | null {
  if (!req.user) {
    res.status(401).json({ message: 'User not authenticated' });
    return null;
  }
  
  return {
    orgId: req.user.orgId,
    userId: req.user.userId
  };
}