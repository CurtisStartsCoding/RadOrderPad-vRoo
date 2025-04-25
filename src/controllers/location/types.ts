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
  logger.error(`Error in location controller:`, {
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

/**
 * Validate location ID from request parameters
 * @param req Express request object
 * @param res Express response object
 * @returns Boolean indicating if validation passed
 */
export function validateLocationId(req: AuthenticatedRequest, res: Response): boolean {
  const locationId = parseInt(req.params.locationId);
  
  if (isNaN(locationId)) {
    res.status(400).json({ message: 'Invalid location ID' });
    return false;
  }
  
  return true;
}

/**
 * Validate user ID from request parameters
 * @param req Express request object
 * @param res Express response object
 * @returns Boolean indicating if validation passed
 */
export function validateUserId(req: AuthenticatedRequest, res: Response): boolean {
  const userId = parseInt(req.params.userId);
  
  if (isNaN(userId)) {
    res.status(400).json({ message: 'Invalid user ID' });
    return false;
  }
  
  return true;
}

/**
 * Validate both user ID and location ID from request parameters
 * @param req Express request object
 * @param res Express response object
 * @returns Boolean indicating if validation passed
 */
export function validateUserAndLocationIds(req: AuthenticatedRequest, res: Response): boolean {
  const userId = parseInt(req.params.userId);
  const locationId = parseInt(req.params.locationId);
  
  if (isNaN(userId) || isNaN(locationId)) {
    res.status(400).json({ message: 'Invalid user ID or location ID' });
    return false;
  }
  
  return true;
}