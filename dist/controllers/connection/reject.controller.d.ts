import { Request, Response } from 'express';
/**
 * Reject a connection request
 * @param req Express request object
 * @param res Express response object
 */
export declare function rejectConnection(req: Request, res: Response): Promise<void>;
declare const _default: {
    rejectConnection: typeof rejectConnection;
};
export default _default;
