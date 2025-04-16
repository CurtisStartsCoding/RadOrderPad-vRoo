import { Request, Response } from 'express';
/**
 * Validates that the order ID is a valid number
 * @param req Express request object
 * @param res Express response object
 * @returns true if valid, false if invalid (response is sent in case of invalid)
 */
export declare function validateOrderId(req: Request, res: Response): boolean;
