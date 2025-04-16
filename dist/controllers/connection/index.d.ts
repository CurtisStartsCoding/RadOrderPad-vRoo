import { Request, Response } from 'express';
import { listConnections, listIncomingRequests } from './list';
import { requestConnection } from './request.controller';
import { approveConnection } from './approve.controller';
import { rejectConnection } from './reject.controller';
import { terminateConnection } from './terminate.controller';
/**
 * Controller for handling connection-related requests
 */
export declare class ConnectionController {
    /**
     * List connections for the authenticated user's organization
     * @param req Express request object
     * @param res Express response object
     */
    listConnections(req: Request, res: Response): Promise<void>;
    /**
     * List pending incoming connection requests
     * @param req Express request object
     * @param res Express response object
     */
    listIncomingRequests(req: Request, res: Response): Promise<void>;
    /**
     * Request a connection to another organization
     * @param req Express request object
     * @param res Express response object
     */
    requestConnection(req: Request, res: Response): Promise<void>;
    /**
     * Approve a connection request
     * @param req Express request object
     * @param res Express response object
     */
    approveConnection(req: Request, res: Response): Promise<void>;
    /**
     * Reject a connection request
     * @param req Express request object
     * @param res Express response object
     */
    rejectConnection(req: Request, res: Response): Promise<void>;
    /**
     * Terminate an active connection
     * @param req Express request object
     * @param res Express response object
     */
    terminateConnection(req: Request, res: Response): Promise<void>;
}
declare const _default: ConnectionController;
export default _default;
export { listConnections, listIncomingRequests, requestConnection, approveConnection, rejectConnection, terminateConnection };
