import { Request, Response } from 'express';
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
export declare function handleControllerError(res: Response, error: unknown, message: string): void;
/**
 * Check if user is authenticated
 * @param req Express request object
 * @param res Express response object
 * @returns Boolean indicating if authentication check passed
 */
export declare function checkAuthentication(req: AuthenticatedRequest, res: Response): boolean;
/**
 * Validate location ID from request parameters
 * @param req Express request object
 * @param res Express response object
 * @returns Boolean indicating if validation passed
 */
export declare function validateLocationId(req: AuthenticatedRequest, res: Response): boolean;
/**
 * Validate user ID from request parameters
 * @param req Express request object
 * @param res Express response object
 * @returns Boolean indicating if validation passed
 */
export declare function validateUserId(req: AuthenticatedRequest, res: Response): boolean;
/**
 * Validate both user ID and location ID from request parameters
 * @param req Express request object
 * @param res Express response object
 * @returns Boolean indicating if validation passed
 */
export declare function validateUserAndLocationIds(req: AuthenticatedRequest, res: Response): boolean;
