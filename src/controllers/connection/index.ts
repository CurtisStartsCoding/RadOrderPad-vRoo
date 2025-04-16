import { Request, Response } from 'express';
import { listConnections, listIncomingRequests } from './list';
import { requestConnection } from './request.controller';
import { approveConnection } from './approve.controller';
import { rejectConnection } from './reject.controller';
import { terminateConnection } from './terminate.controller';

/**
 * Controller for handling connection-related requests
 */
export class ConnectionController {
  /**
   * List connections for the authenticated user's organization
   * @param req Express request object
   * @param res Express response object
   */
  async listConnections(req: Request, res: Response): Promise<void> {
    return listConnections(req, res);
  }
  
  /**
   * List pending incoming connection requests
   * @param req Express request object
   * @param res Express response object
   */
  async listIncomingRequests(req: Request, res: Response): Promise<void> {
    return listIncomingRequests(req, res);
  }
  
  /**
   * Request a connection to another organization
   * @param req Express request object
   * @param res Express response object
   */
  async requestConnection(req: Request, res: Response): Promise<void> {
    return requestConnection(req, res);
  }
  
  /**
   * Approve a connection request
   * @param req Express request object
   * @param res Express response object
   */
  async approveConnection(req: Request, res: Response): Promise<void> {
    return approveConnection(req, res);
  }
  
  /**
   * Reject a connection request
   * @param req Express request object
   * @param res Express response object
   */
  async rejectConnection(req: Request, res: Response): Promise<void> {
    return rejectConnection(req, res);
  }
  
  /**
   * Terminate an active connection
   * @param req Express request object
   * @param res Express response object
   */
  async terminateConnection(req: Request, res: Response): Promise<void> {
    return terminateConnection(req, res);
  }
}

// Export a singleton instance
export default new ConnectionController();

// Export individual controllers for direct use if needed
export {
  listConnections,
  listIncomingRequests,
  requestConnection,
  approveConnection,
  rejectConnection,
  terminateConnection
};