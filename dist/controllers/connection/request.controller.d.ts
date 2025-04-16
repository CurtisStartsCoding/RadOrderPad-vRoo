import { Request, Response } from 'express';
/**
 * Request a connection to another organization
 * @param req Express request object
 * @param res Express response object
 */
export declare function requestConnection(req: Request, res: Response): Promise<void>;
declare const _default: {
    requestConnection: typeof requestConnection;
};
export default _default;
