import { Request, Response } from 'express';
/**
 * List connections for the authenticated user's organization
 * @param req Express request object
 * @param res Express response object
 */
export declare function listConnections(req: Request, res: Response): Promise<void>;
/**
 * List pending incoming connection requests
 * @param req Express request object
 * @param res Express response object
 */
export declare function listIncomingRequests(req: Request, res: Response): Promise<void>;
declare const _default: {
    listConnections: typeof listConnections;
    listIncomingRequests: typeof listIncomingRequests;
};
export default _default;
