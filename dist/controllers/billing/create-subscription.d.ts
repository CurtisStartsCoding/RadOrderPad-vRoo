import { Request, Response } from 'express';
/**
 * Create a Stripe subscription for a specific pricing tier
 *
 * @param req Express request object
 * @param res Express response object
 * @returns Response with subscription details or error
 */
export declare function createSubscription(req: Request, res: Response): Promise<Response>;
