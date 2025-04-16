import { Request, Response } from 'express';
import connectionService from '../../services/connection';
import { ApproveConnectionParams } from '../../services/connection/types';
import { authenticateUser } from './auth-utils';
import { handleConnectionError } from './error-utils';
import { validateRelationshipId } from './validation-utils';

/**
 * Approve a connection request
 * @param req Express request object
 * @param res Express response object
 */
export async function approveConnection(req: Request, res: Response): Promise<void> {
  try {
    // Authenticate user
    const user = authenticateUser(req, res);
    if (!user) return;
    
    // Validate relationship ID
    const relationshipId = validateRelationshipId(req, res);
    if (relationshipId === null) return;
    
    // Create approval parameters
    const params: ApproveConnectionParams = {
      relationshipId,
      approvingUserId: user.userId,
      approvingOrgId: user.orgId
    };
    
    try {
      // Approve connection
      const result = await connectionService.approveConnection(params);
      
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
    handleConnectionError(error, res, 'approveConnection');
  }
}

export default {
  approveConnection
};