import { getMainDbClient } from '../../../config/db';
import notificationManager from '../../notification';
import { RejectConnectionParams, ConnectionOperationResponse } from '../types';
import { GET_RELATIONSHIP_FOR_APPROVAL_QUERY } from '../queries/approve';
import { REJECT_RELATIONSHIP_QUERY } from '../queries/reject';

/**
 * Service for rejecting connection requests
 */
export class RejectConnectionService {
  /**
   * Reject a connection request
   * @param params Reject connection parameters
   * @returns Promise with result
   */
  async rejectConnection(params: RejectConnectionParams): Promise<ConnectionOperationResponse> {
    const { relationshipId, rejectingUserId, rejectingOrgId } = params;
    const client = await getMainDbClient();
    
    try {
      await client.query('BEGIN');
      
      // Get the relationship
      const relationshipResult = await client.query(
        GET_RELATIONSHIP_FOR_APPROVAL_QUERY,
        [relationshipId, rejectingOrgId]
      );
      
      if (relationshipResult.rows.length === 0) {
        throw new Error('Relationship not found, not authorized, or not in pending status');
      }
      
      // Update the relationship
      await client.query(
        REJECT_RELATIONSHIP_QUERY,
        [rejectingUserId, relationshipId]
      );
      
      // Send notification
      const relationship = relationshipResult.rows[0];
      if (relationship.initiating_org_email) {
        await notificationManager.sendConnectionRejected(
          relationship.initiating_org_email,
          relationship.initiating_org_name
        );
      }
      
      await client.query('COMMIT');
      
      return {
        success: true,
        message: 'Connection request rejected successfully',
        relationshipId
      };
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error in rejectConnection:', error);
      throw error;
    } finally {
      client.release();
    }
  }
}

export default new RejectConnectionService();