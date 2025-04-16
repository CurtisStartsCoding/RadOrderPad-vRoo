import { Request, Response } from 'express';
/**
 * List connections for the authenticated user's organization
 * @param req Express request object
 * @param res Express response object
 */
export declare function listConnections(req: Request, res: Response): Promise<void>;
