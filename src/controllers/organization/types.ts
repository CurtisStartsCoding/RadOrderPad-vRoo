import { Request, Response } from 'express';
import logger from '../../utils/logger';

/**
 * Interface for authenticated request with user information
 */
export interface AuthenticatedRequest extends Request {
  user?: {
    userId: number;
    orgId: number;
    role: string;
    email: string;
  };
}

/**
 * Type for controller handler function
 */
export type ControllerHandler = (req: AuthenticatedRequest, res: Response) => Promise<void>;

/**
 * Common error handling function
 * @param res Express response object
 * @param error Error object
 * @param message Error message
 */
export function handleControllerError(res: Response, error: unknown, message: string): void {
  logger.error(`Error in organization controller:`, {
    error,
    context: message
  });
  res.status(500).json({ message, error: (error as Error).message });
}

/**
 * Check if user is authenticated
 * @param req Express request object
 * @param res Express response object
 * @returns Boolean indicating if authentication check passed
 */
export function checkAuthentication(req: AuthenticatedRequest, res: Response): boolean {
  if (!req.user) {
    res.status(401).json({ message: 'User not authenticated' });
    return false;
  }
  return true;
}