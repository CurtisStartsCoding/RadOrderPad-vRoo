import { Request, Response } from 'express';
/**
 * List pending incoming connection requests
 * @param req Express request object
 * @param res Express response object
 */
export declare function listIncomingRequests(req: Request, res: Response): Promise<void>;
