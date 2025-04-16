import { Request, Response } from 'express';
/**
 * Approve a connection request
 * @param req Express request object
 * @param res Express response object
 */
export declare function approveConnection(req: Request, res: Response): Promise<void>;
declare const _default: {
    approveConnection: typeof approveConnection;
};
export default _default;
