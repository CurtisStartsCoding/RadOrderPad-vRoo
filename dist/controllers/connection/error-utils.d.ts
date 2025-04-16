import { Response } from 'express';
/**
 * Handle errors in connection controllers
 * @param error The error object
 * @param res Express response object
 * @param controllerName The name of the controller for logging purposes
 */
export declare function handleConnectionError(error: unknown, res: Response, controllerName: string): void;
