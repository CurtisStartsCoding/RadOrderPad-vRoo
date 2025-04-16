import { getMainDbClient } from '../../../config/db';
import notificationManager from '../../notification';
import { ApproveConnectionParams, ConnectionOperationResponse } from '../types';
import {
  GET_RELATIONSHIP_FOR_APPROVAL_QUERY,
  APPROVE_RELATIONSHIP_QUERY
} from '../queries/approve';

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
    
    try {
      await client.query('BEGIN');
      
      // Get the relationship
      const relationshipResult = await client.query(
        GET_RELATIONSHIP_FOR_APPROVAL_QUERY,
        [relationshipId, approvingOrgId]
      );
      
      if (relationshipResult.rows.length === 0) {
        throw new Error('Relationship not found, not authorized, or not in pending status');
      }
      
      // Update the relationship
      await client.query(
        APPROVE_RELATIONSHIP_QUERY,
        [approvingUserId, relationshipId]
      );
      
      // Send notification
      const relationship = relationshipResult.rows[0];
      if (relationship.initiating_org_email) {
        await notificationManager.sendConnectionApproved(
          relationship.initiating_org_email,
          relationship.initiating_org_name
        );
      }
      
      await client.query('COMMIT');
      
      return {
        success: true,
        message: 'Connection request approved successfully',
        relationshipId
      };
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error in approveConnection:', error);
      throw error;
    } finally {
      client.release();
    }
  }
}

export default new ApproveConnectionService();