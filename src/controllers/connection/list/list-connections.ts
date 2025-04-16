import { Request, Response } from 'express';
import connectionService from '../../../services/connection';
import { authenticateUser } from '../auth-utils';
import { handleConnectionError } from '../error-utils';

/**
 * List connections for the authenticated user's organization
 * @param req Express request object
 * @param res Express response object
 */
export async function listConnections(req: Request, res: Response): Promise<void> {
  try {
    // Authenticate user
    const user = authenticateUser(req, res);
    if (!user) return;
    
    // Get connections
    const connections = await connectionService.listConnections(user.orgId);
    
    // Return response
    res.status(200).json({ connections });
  } catch (error) {
    handleConnectionError(error, res, 'listConnections');
  }
}