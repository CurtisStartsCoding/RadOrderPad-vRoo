import { Response } from 'express';
/**
 * Handles controller errors and sends appropriate response
 * @param error The error that occurred
 * @param res Express response object
 * @param context Additional context for logging (e.g., function name)
 */
export declare function handleControllerError(error: unknown, res: Response, context: string): void;
