import { getMainDbClient } from '../../../config/db';
import notificationManager from '../../notification/manager';
import { TerminateConnectionParams, ConnectionOperationResponse } from '../types';
import {
  GET_RELATIONSHIP_FOR_TERMINATION_QUERY,
  TERMINATE_RELATIONSHIP_QUERY
} from '../queries/terminate';
import enhancedLogger from '../../../utils/enhanced-logger';

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
    enhancedLogger.debug('terminateConnection called with params:', {
      relationshipId: params.relationshipId,
      terminatingOrgId: params.terminatingOrgId
    });
    
    const { relationshipId, terminatingOrgId } = params;
    const client = await getMainDbClient();
    
    try {
      enhancedLogger.debug('Beginning transaction');
      await client.query('BEGIN');
      
      // Get the relationship
      enhancedLogger.debug('Fetching relationship with query:', {
        query: GET_RELATIONSHIP_FOR_TERMINATION_QUERY,
        params: [relationshipId, terminatingOrgId]
      });
      
      const relationshipResult = await client.query(
        GET_RELATIONSHIP_FOR_TERMINATION_QUERY,
        [relationshipId, terminatingOrgId]
      );
      
      enhancedLogger.debug('Relationship query result:', {
        rowCount: relationshipResult.rowCount,
        hasRows: relationshipResult.rows.length > 0
      });
      
      if (relationshipResult.rows.length === 0) {
        enhancedLogger.debug('Relationship not found, not authorized, or not in active status');
        throw new Error('Relationship not found, not authorized, or not in active status');
      }
      
      // Update the relationship
      enhancedLogger.debug('Updating relationship status to terminated with query:', {
        query: TERMINATE_RELATIONSHIP_QUERY,
        params: [relationshipId]
      });
      
      await client.query(
        TERMINATE_RELATIONSHIP_QUERY,
        [relationshipId]
      );
      
      // Send notification
      const relationship = relationshipResult.rows[0];
      const isInitiator = relationship.organization_id === terminatingOrgId;
      
      enhancedLogger.debug('Relationship details for notification:', {
        isInitiator,
        terminatingOrgId,
        relationship: {
          id: relationship.id,
          organization_id: relationship.organization_id,
          related_organization_id: relationship.related_organization_id,
          org1_name: relationship.org1_name,
          org2_name: relationship.org2_name
        }
      });
      
      // Notify the other organization
      const partnerEmail = isInitiator ? relationship.org2_email : relationship.org1_email;
      const terminatingOrgName = isInitiator ? relationship.org1_name : relationship.org2_name;
      const partnerOrgName = isInitiator ? relationship.org2_name : relationship.org1_name;
      
      enhancedLogger.debug('Notification details:', {
        partnerEmail,
        partnerOrgName,
        terminatingOrgName
      });
      
      if (partnerEmail) {
        try {
          enhancedLogger.debug('Sending connection terminated notification');
          await notificationManager.sendConnectionTerminated(
            partnerEmail,
            partnerOrgName,
            terminatingOrgName
          );
          enhancedLogger.debug('Notification sent successfully');
        } catch (notificationError) {
          // Log notification error but don't fail the transaction
          enhancedLogger.error('Error sending termination notification:', notificationError);
          enhancedLogger.debug('Continuing despite notification error');
        }
      } else {
        enhancedLogger.debug('No partner email found, skipping notification');
      }
      
      enhancedLogger.debug('Committing transaction');
      await client.query('COMMIT');
      
      enhancedLogger.debug('Connection terminated successfully');
      return {
        success: true,
        message: 'Connection terminated successfully',
        relationshipId
      };
    } catch (error) {
      enhancedLogger.debug('Error occurred, rolling back transaction');
      try {
        await client.query('ROLLBACK');
        enhancedLogger.debug('Transaction rolled back successfully');
      } catch (rollbackError) {
        enhancedLogger.error('Error rolling back transaction:', rollbackError);
      }
      
      enhancedLogger.error('Error in terminateConnection:', error);
      throw error;
    } finally {
      enhancedLogger.debug('Releasing database client');
      client.release();
    }
  }
}

export default new TerminateConnectionService();