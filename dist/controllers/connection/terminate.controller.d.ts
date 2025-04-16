import { Request, Response } from 'express';
/**
 * Terminate an active connection
 * @param req Express request object
 * @param res Express response object
 */
export declare function terminateConnection(req: Request, res: Response): Promise<void>;
declare const _default: {
    terminateConnection: typeof terminateConnection;
};
export default _default;
