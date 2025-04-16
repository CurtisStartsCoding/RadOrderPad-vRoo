import { Request, Response } from 'express';
import connectionService from '../../services/connection';
import { TerminateConnectionParams } from '../../services/connection/types';
import { authenticateUser } from './auth-utils';
import { handleConnectionError } from './error-utils';
import { validateRelationshipId } from './validation-utils';

/**
 * Terminate an active connection
 * @param req Express request object
 * @param res Express response object
 */
export async function terminateConnection(req: Request, res: Response): Promise<void> {
  try {
    // Authenticate user
    const user = authenticateUser(req, res);
    if (!user) return;
    
    // Validate relationship ID
    const relationshipId = validateRelationshipId(req, res);
    if (relationshipId === null) return;
    
    // Create termination parameters
    const params: TerminateConnectionParams = {
      relationshipId,
      terminatingUserId: user.userId,
      terminatingOrgId: user.orgId
    };
    
    try {
      // Terminate connection
      const result = await connectionService.terminateConnection(params);
      
      // Return response
      res.status(200).json(result);
    } catch (error) {
      // Handle not found or not authorized
      if (error instanceof Error && 
          (error.message.includes('not found') || 
           error.message.includes('not authorized'))) {
        res.status(404).json({ message: error.message });
      } else {
        throw error;
      }
    }
  } catch (error) {
    handleConnectionError(error, res, 'terminateConnection');
  }
}

export default {
  terminateConnection
};