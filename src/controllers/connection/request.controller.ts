import { Request, Response } from 'express';
import connectionService from '../../services/connection';
import { RequestConnectionParams } from '../../services/connection/types';
import { authenticateUser } from './auth-utils';
import { handleConnectionError } from './error-utils';
import { validateTargetOrgId } from './validation-utils';

/**
 * Request a connection to another organization
 * @param req Express request object
 * @param res Express response object
 */
export async function requestConnection(req: Request, res: Response): Promise<void> {
  try {
    // Authenticate user
    const user = authenticateUser(req, res);
    if (!user) return;
    
    // Validate target organization ID
    const targetOrgId = validateTargetOrgId(req, res, user.orgId);
    if (targetOrgId === null) return;
    
    // Extract notes from request body
    const { notes } = req.body;
    
    // Create request parameters
    const params: RequestConnectionParams = {
      initiatingOrgId: user.orgId,
      targetOrgId,
      initiatingUserId: user.userId,
      notes
    };
    
    // Request connection
    const result = await connectionService.requestConnection(params);
    
    // Return response
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    handleConnectionError(error, res, 'requestConnection');
  }
}

export default {
  requestConnection
};