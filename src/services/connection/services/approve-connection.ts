import { getMainDbClient } from '../../../config/db';
import notificationManager from '../../notification/manager';
import { ApproveConnectionParams, ConnectionOperationResponse } from '../types';
import {
  GET_RELATIONSHIP_FOR_APPROVAL_QUERY,
  APPROVE_RELATIONSHIP_QUERY
} from '../queries/approve';
import enhancedLogger from '../../../utils/enhanced-logger';

/**
 * Service for approving connection requests
 */
export class ApproveConnectionService {
  /**
   * Approve a connection request
   * @param params Approve connection parameters
   * @returns Promise with result
   */
  async approveConnection(params: ApproveConnectionParams): Promise<ConnectionOperationResponse> {
    const { relationshipId, approvingUserId, approvingOrgId } = params;
    const client = await getMainDbClient();
    
    enhancedLogger.debug(`Approving connection: relationshipId=${relationshipId}, approvingUserId=${approvingUserId}, approvingOrgId=${approvingOrgId}`);
    
    try {
      await client.query('BEGIN');
      
      // Get the relationship
      enhancedLogger.debug(`Fetching relationship for approval: relationshipId=${relationshipId}, approvingOrgId=${approvingOrgId}`);
      const relationshipResult = await client.query(
        GET_RELATIONSHIP_FOR_APPROVAL_QUERY,
        [relationshipId, approvingOrgId]
      );
      
      if (relationshipResult.rows.length === 0) {
        enhancedLogger.debug(`Relationship not found or not authorized: relationshipId=${relationshipId}, approvingOrgId=${approvingOrgId}`);
        throw new Error('Relationship not found, not authorized, or not in pending status');
      }
      
      // Update the relationship
      enhancedLogger.debug(`Updating relationship status to active: relationshipId=${relationshipId}`);
      await client.query(
        APPROVE_RELATIONSHIP_QUERY,
        [approvingUserId, relationshipId]
      );
      
      // Send notification
      const relationship = relationshipResult.rows[0];
      if (relationship.initiating_org_email) {
        enhancedLogger.debug(`Sending approval notification to: ${relationship.initiating_org_email}`);
        try {
          await notificationManager.sendConnectionApproved(
            relationship.initiating_org_email,
            relationship.initiating_org_name
          );
          enhancedLogger.debug('Notification sent successfully');
        } catch (notificationError) {
          // Log notification error but don't fail the transaction
          enhancedLogger.error('Error sending approval notification:', notificationError);
        }
      } else {
        enhancedLogger.debug('No initiating organization email found, skipping notification');
      }
      
      await client.query('COMMIT');
      enhancedLogger.debug(`Connection approved successfully: relationshipId=${relationshipId}`);
      
      return {
        success: true,
        message: 'Connection request approved successfully',
        relationshipId
      };
    } catch (error) {
      await client.query('ROLLBACK');
      enhancedLogger.error(`Error in approveConnection: ${error instanceof Error ? error.message : 'Unknown error'}`, error);
      throw error;
    } finally {
      client.release();
    }
  }
}

export default new ApproveConnectionService();