import { Request, Response } from 'express';
/**
 * Create a checkout session for purchasing credit bundles
 *
 * @param req Express request object
 * @param res Express response object
 * @returns Response with checkout session ID or error
 */
export declare function createCheckoutSession(req: Request, res: Response): Promise<Response>;
