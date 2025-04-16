import { Request, Response } from 'express';
import connectionService from '../services/connection';
import {
  RequestConnectionParams,
  ApproveConnectionParams,
  RejectConnectionParams,
  TerminateConnectionParams
} from '../services/connection/types';

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
    try {
      if (!req.user) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }
      
      const orgId = req.user.orgId;
      const connections = await connectionService.listConnections(orgId);
      
      res.status(200).json({ connections });
    } catch (error) {
      console.error('Error in listConnections controller:', error);
      res.status(500).json({ message: 'Failed to list connections', error: (error as Error).message });
    }
  }
  
  /**
   * List pending incoming connection requests
   * @param req Express request object
   * @param res Express response object
   */
  async listIncomingRequests(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }
      
      const orgId = req.user.orgId;
      const requests = await connectionService.listIncomingRequests(orgId);
      
      res.status(200).json({ requests });
    } catch (error) {
      console.error('Error in listIncomingRequests controller:', error);
      res.status(500).json({ message: 'Failed to list incoming requests', error: (error as Error).message });
    }
  }
  
  /**
   * Request a connection to another organization
   * @param req Express request object
   * @param res Express response object
   */
  async requestConnection(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }
      
      const initiatingOrgId = req.user.orgId;
      const initiatingUserId = req.user.userId;
      const { targetOrgId, notes } = req.body;
      
      if (!targetOrgId) {
        res.status(400).json({ message: 'Target organization ID is required' });
        return;
      }
      
      // Validate that targetOrgId is a number
      const targetOrgIdNum = parseInt(targetOrgId);
      if (isNaN(targetOrgIdNum)) {
        res.status(400).json({ message: 'Target organization ID must be a number' });
        return;
      }
      
      // Validate that the target organization is not the same as the initiating organization
      if (targetOrgIdNum === initiatingOrgId) {
        res.status(400).json({ message: 'Cannot request a connection to your own organization' });
        return;
      }
      
      const params: RequestConnectionParams = {
        initiatingOrgId,
        targetOrgId: targetOrgIdNum,
        initiatingUserId,
        notes
      };
      
      const result = await connectionService.requestConnection(params);
      
      if (result.success) {
        res.status(201).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('Error in requestConnection controller:', error);
      res.status(500).json({ message: 'Failed to request connection', error: (error as Error).message });
    }
  }
  
  /**
   * Approve a connection request
   * @param req Express request object
   * @param res Express response object
   */
  async approveConnection(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }
      
      const approvingOrgId = req.user.orgId;
      const approvingUserId = req.user.userId;
      const relationshipId = parseInt(req.params.relationshipId);
      
      if (isNaN(relationshipId)) {
        res.status(400).json({ message: 'Invalid relationship ID' });
        return;
      }
      
      try {
        const params: ApproveConnectionParams = {
          relationshipId,
          approvingUserId,
          approvingOrgId
        };
        
        const result = await connectionService.approveConnection(params);
        
        res.status(200).json(result);
      } catch (error) {
        // Handle not found or not authorized
        if ((error as Error).message.includes('not found') || 
            (error as Error).message.includes('not authorized')) {
          res.status(404).json({ message: (error as Error).message });
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error('Error in approveConnection controller:', error);
      res.status(500).json({ message: 'Failed to approve connection', error: (error as Error).message });
    }
  }
  
  /**
   * Reject a connection request
   * @param req Express request object
   * @param res Express response object
   */
  async rejectConnection(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }
      
      const rejectingOrgId = req.user.orgId;
      const rejectingUserId = req.user.userId;
      const relationshipId = parseInt(req.params.relationshipId);
      
      if (isNaN(relationshipId)) {
        res.status(400).json({ message: 'Invalid relationship ID' });
        return;
      }
      
      try {
        const params: RejectConnectionParams = {
          relationshipId,
          rejectingUserId,
          rejectingOrgId
        };
        
        const result = await connectionService.rejectConnection(params);
        
        res.status(200).json(result);
      } catch (error) {
        // Handle not found or not authorized
        if ((error as Error).message.includes('not found') || 
            (error as Error).message.includes('not authorized')) {
          res.status(404).json({ message: (error as Error).message });
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error('Error in rejectConnection controller:', error);
      res.status(500).json({ message: 'Failed to reject connection', error: (error as Error).message });
    }
  }
  
  /**
   * Terminate an active connection
   * @param req Express request object
   * @param res Express response object
   */
  async terminateConnection(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }
      
      const terminatingOrgId = req.user.orgId;
      const terminatingUserId = req.user.userId;
      const relationshipId = parseInt(req.params.relationshipId);
      
      if (isNaN(relationshipId)) {
        res.status(400).json({ message: 'Invalid relationship ID' });
        return;
      }
      
      try {
        const params: TerminateConnectionParams = {
          relationshipId,
          terminatingUserId,
          terminatingOrgId
        };
        
        const result = await connectionService.terminateConnection(params);
        
        res.status(200).json(result);
      } catch (error) {
        // Handle not found or not authorized
        if ((error as Error).message.includes('not found') || 
            (error as Error).message.includes('not authorized')) {
          res.status(404).json({ message: (error as Error).message });
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error('Error in terminateConnection controller:', error);
      res.status(500).json({ message: 'Failed to terminate connection', error: (error as Error).message });
    }
  }
}

export default new ConnectionController();