import { getMainDbClient } from '../../../config/db';
import notificationManager from '../../notification';
import { TerminateConnectionParams, ConnectionOperationResponse } from '../types';
import {
  GET_RELATIONSHIP_FOR_TERMINATION_QUERY,
  TERMINATE_RELATIONSHIP_QUERY
} from '../queries/terminate';

/**
 * Service for terminating connections
 */
export class TerminateConnectionService {
  /**
   * Terminate an active connection
   * @param params Terminate connection parameters
   * @returns Promise with result
   */
  async terminateConnection(params: TerminateConnectionParams): Promise<ConnectionOperationResponse> {
    const { relationshipId, terminatingUserId, terminatingOrgId } = params;
    const client = await getMainDbClient();
    
    try {
      await client.query('BEGIN');
      
      // Get the relationship
      const relationshipResult = await client.query(
        GET_RELATIONSHIP_FOR_TERMINATION_QUERY,
        [relationshipId, terminatingOrgId]
      );
      
      if (relationshipResult.rows.length === 0) {
        throw new Error('Relationship not found, not authorized, or not in active status');
      }
      
      // Update the relationship
      await client.query(
        TERMINATE_RELATIONSHIP_QUERY,
        [relationshipId]
      );
      
      // Send notification
      const relationship = relationshipResult.rows[0];
      const isInitiator = relationship.organization_id === terminatingOrgId;
      
      // Notify the other organization
      const partnerEmail = isInitiator ? relationship.org2_email : relationship.org1_email;
      const partnerName = isInitiator ? relationship.org2_name : relationship.org1_name;
      const terminatingOrgName = isInitiator ? relationship.org1_name : relationship.org2_name;
      
      if (partnerEmail) {
        await notificationManager.sendConnectionTerminated(
          partnerEmail,
          partnerName,
          terminatingOrgName
        );
      }
      
      await client.query('COMMIT');
      
      return {
        success: true,
        message: 'Connection terminated successfully',
        relationshipId
      };
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error in terminateConnection:', error);
      throw error;
    } finally {
      client.release();
    }
  }
}

export default new TerminateConnectionService();