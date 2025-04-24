import { getMainDbClient } from '../../../config/db';
import notificationManager from '../../notification/manager';
import { RejectConnectionParams, ConnectionOperationResponse } from '../types';
import { GET_RELATIONSHIP_FOR_APPROVAL_QUERY } from '../queries/approve';
import { REJECT_RELATIONSHIP_QUERY } from '../queries/reject';
import enhancedLogger from '../../../utils/enhanced-logger';

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
    enhancedLogger.debug(`Rejecting connection request: relationshipId=${relationshipId}, rejectingUserId=${rejectingUserId}, rejectingOrgId=${rejectingOrgId}`);
    
    const client = await getMainDbClient();
    
    try {
      // Start transaction
      enhancedLogger.debug(`Starting transaction for rejecting connection request: relationshipId=${relationshipId}`);
      await client.query('BEGIN');
      
      // Check if the relationship exists, is in pending status, and the user is authorized to reject it
      enhancedLogger.debug(`Checking if relationship exists and can be rejected: relationshipId=${relationshipId}, rejectingOrgId=${rejectingOrgId}`);
      
      const relationshipResult = await client.query(
        GET_RELATIONSHIP_FOR_APPROVAL_QUERY,
        [relationshipId, rejectingOrgId]
      );
      
      if (relationshipResult.rows.length === 0) {
        enhancedLogger.debug(`Relationship not found, not authorized, or not in pending status: relationshipId=${relationshipId}, rejectingOrgId=${rejectingOrgId}`);
        throw new Error('Relationship not found, not authorized, or not in pending status');
      }
      
      // Update the relationship status to rejected
      enhancedLogger.debug(`Updating relationship status to rejected: relationshipId=${relationshipId}, rejectingUserId=${rejectingUserId}`);
      await client.query(
        REJECT_RELATIONSHIP_QUERY,
        [rejectingUserId, relationshipId]
      );
      
      // Send notification to the initiating organization
      const relationship = relationshipResult.rows[0];
      if (relationship.initiating_org_email) {
        enhancedLogger.debug(`Sending rejection notification to initiating organization: email=${relationship.initiating_org_email}, name=${relationship.initiating_org_name}`);
        try {
          await notificationManager.sendConnectionRejected(
            relationship.initiating_org_email,
            relationship.initiating_org_name
          );
          enhancedLogger.debug(`Rejection notification sent successfully`);
        } catch (notificationError) {
          // Log notification error but don't fail the transaction
          enhancedLogger.error(`Error sending rejection notification:`, notificationError);
          enhancedLogger.debug(`Continuing with transaction despite notification error`);
        }
      } else {
        enhancedLogger.debug(`No initiating organization email found, skipping notification`);
      }
      
      // Commit transaction
      enhancedLogger.debug(`Committing transaction for rejecting connection request: relationshipId=${relationshipId}`);
      await client.query('COMMIT');
      
      enhancedLogger.debug(`Connection request rejected successfully: relationshipId=${relationshipId}`);
      return {
        success: true,
        message: 'Connection request rejected successfully',
        relationshipId
      };
    } catch (error) {
      // Rollback transaction on error
      enhancedLogger.debug(`Rolling back transaction due to error: relationshipId=${relationshipId}`);
      await client.query('ROLLBACK');
      enhancedLogger.error('Error in rejectConnection:', error);
      throw error;
    } finally {
      // Release client
      client.release();
      enhancedLogger.debug(`Database client released: relationshipId=${relationshipId}`);
    }
  }
}

export default new RejectConnectionService();