import { queryMainDb, getMainDbClient } from '../config/db';
import notificationManager from './notification/notification-manager';

/**
 * Service for managing connections between organizations
 */
class ConnectionService {
  /**
   * List connections for an organization
   * @param orgId Organization ID
   * @returns Promise with connections list
   */
  async listConnections(orgId: number): Promise<any[]> {
    try {
      const result = await queryMainDb(
        `SELECT r.*, 
                o1.name as initiating_org_name,
                o2.name as target_org_name,
                u1.first_name as initiator_first_name,
                u1.last_name as initiator_last_name,
                u2.first_name as approver_first_name,
                u2.last_name as approver_last_name
         FROM organization_relationships r
         JOIN organizations o1 ON r.organization_id = o1.id
         JOIN organizations o2 ON r.related_organization_id = o2.id
         LEFT JOIN users u1 ON r.initiated_by_id = u1.id
         LEFT JOIN users u2 ON r.approved_by_id = u2.id
         WHERE (r.organization_id = $1 OR r.related_organization_id = $1)
         ORDER BY r.created_at DESC`,
        [orgId]
      );
      
      return result.rows.map((row: any) => {
        // Determine if this org is the initiator or target
        const isInitiator = row.organization_id === orgId;
        
        return {
          id: row.id,
          partnerOrgId: isInitiator ? row.related_organization_id : row.organization_id,
          partnerOrgName: isInitiator ? row.target_org_name : row.initiating_org_name,
          status: row.status,
          isInitiator,
          initiatedBy: row.initiator_first_name && row.initiator_last_name ? 
            `${row.initiator_first_name} ${row.initiator_last_name}` : null,
          approvedBy: row.approver_first_name && row.approver_last_name ? 
            `${row.approver_first_name} ${row.approver_last_name}` : null,
          notes: row.notes,
          createdAt: row.created_at,
          updatedAt: row.updated_at
        };
      });
    } catch (error) {
      console.error('Error in listConnections:', error);
      throw error;
    }
  }
  
  /**
   * List pending incoming connection requests
   * @param orgId Organization ID
   * @returns Promise with pending requests list
   */
  async listIncomingRequests(orgId: number): Promise<any[]> {
    try {
      const result = await queryMainDb(
        `SELECT r.*, 
                o1.name as initiating_org_name,
                u1.first_name as initiator_first_name,
                u1.last_name as initiator_last_name,
                u1.email as initiator_email
         FROM organization_relationships r
         JOIN organizations o1 ON r.organization_id = o1.id
         LEFT JOIN users u1 ON r.initiated_by_id = u1.id
         WHERE r.related_organization_id = $1 AND r.status = 'pending'
         ORDER BY r.created_at DESC`,
        [orgId]
      );
      
      return result.rows.map((row: any) => {
        return {
          id: row.id,
          initiatingOrgId: row.organization_id,
          initiatingOrgName: row.initiating_org_name,
          initiatedBy: row.initiator_first_name && row.initiator_last_name ? 
            `${row.initiator_first_name} ${row.initiator_last_name}` : null,
          initiatorEmail: row.initiator_email,
          notes: row.notes,
          createdAt: row.created_at
        };
      });
    } catch (error) {
      console.error('Error in listIncomingRequests:', error);
      throw error;
    }
  }
  
  /**
   * Request a connection to another organization
   * @param initiatingOrgId Organization ID initiating the request
   * @param targetOrgId Target organization ID
   * @param initiatingUserId User ID initiating the request
   * @param notes Optional notes about the connection
   * @returns Promise with result
   */
  async requestConnection(
    initiatingOrgId: number, 
    targetOrgId: number, 
    initiatingUserId: number,
    notes?: string
  ): Promise<any> {
    const client = await getMainDbClient();
    
    try {
      await client.query('BEGIN');
      
      // Check if the organizations exist
      const orgsResult = await client.query(
        `SELECT id, name, contact_email FROM organizations WHERE id IN ($1, $2)`,
        [initiatingOrgId, targetOrgId]
      );
      
      if (orgsResult.rows.length !== 2) {
        throw new Error('One or both organizations not found');
      }
      
      // Check if a relationship already exists
      const existingResult = await client.query(
        `SELECT id, status FROM organization_relationships 
         WHERE (organization_id = $1 AND related_organization_id = $2)
         OR (organization_id = $2 AND related_organization_id = $1)`,
        [initiatingOrgId, targetOrgId]
      );
      
      if (existingResult.rows.length > 0) {
        const existing = existingResult.rows[0];
        
        // If there's an active relationship, return it
        if (existing.status === 'active') {
          await client.query('ROLLBACK');
          return {
            success: false,
            message: 'A connection already exists between these organizations',
            relationshipId: existing.id,
            status: existing.status
          };
        }
        
        // If there's a pending relationship, return it
        if (existing.status === 'pending') {
          await client.query('ROLLBACK');
          return {
            success: false,
            message: 'A pending connection request already exists between these organizations',
            relationshipId: existing.id,
            status: existing.status
          };
        }
        
        // If there's a rejected or terminated relationship, update it to pending
        if (existing.status === 'rejected' || existing.status === 'terminated') {
          const updateResult = await client.query(
            `UPDATE organization_relationships
             SET status = 'pending', 
                 organization_id = $1,
                 related_organization_id = $2,
                 initiated_by_id = $3,
                 approved_by_id = NULL,
                 notes = $4,
                 updated_at = NOW()
             WHERE id = $5
             RETURNING id`,
            [initiatingOrgId, targetOrgId, initiatingUserId, notes || null, existing.id]
          );
          
          // Get target organization admin email for notification
          const targetOrg = orgsResult.rows.find(org => org.id === targetOrgId);
          
          // Send notification (stub)
          if (targetOrg && targetOrg.contact_email) {
            await notificationManager.sendConnectionRequest(
              targetOrg.contact_email,
              orgsResult.rows.find(org => org.id === initiatingOrgId)?.name || 'Unknown Organization'
            );
          }
          
          await client.query('COMMIT');
          
          return {
            success: true,
            message: 'Connection request sent successfully',
            relationshipId: updateResult.rows[0].id
          };
        }
      }
      
      // Create a new relationship
      const insertResult = await client.query(
        `INSERT INTO organization_relationships
         (organization_id, related_organization_id, status, initiated_by_id, notes)
         VALUES ($1, $2, 'pending', $3, $4)
         RETURNING id`,
        [initiatingOrgId, targetOrgId, initiatingUserId, notes || null]
      );
      
      // Get target organization admin email for notification
      const targetOrg = orgsResult.rows.find(org => org.id === targetOrgId);
      
      // Send notification (stub)
      if (targetOrg && targetOrg.contact_email) {
        await notificationManager.sendConnectionRequest(
          targetOrg.contact_email,
          orgsResult.rows.find(org => org.id === initiatingOrgId)?.name || 'Unknown Organization'
        );
      }
      
      await client.query('COMMIT');
      
      return {
        success: true,
        message: 'Connection request sent successfully',
        relationshipId: insertResult.rows[0].id
      };
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error in requestConnection:', error);
      throw error;
    } finally {
      client.release();
    }
  }
  
  /**
   * Approve a connection request
   * @param relationshipId Relationship ID
   * @param approvingUserId User ID approving the request
   * @param approvingOrgId Organization ID approving the request
   * @returns Promise with result
   */
  async approveConnection(
    relationshipId: number, 
    approvingUserId: number, 
    approvingOrgId: number
  ): Promise<any> {
    const client = await getMainDbClient();
    
    try {
      await client.query('BEGIN');
      
      // Get the relationship
      const relationshipResult = await client.query(
        `SELECT r.*, 
                o1.name as initiating_org_name,
                o1.contact_email as initiating_org_email
         FROM organization_relationships r
         JOIN organizations o1 ON r.organization_id = o1.id
         WHERE r.id = $1 AND r.related_organization_id = $2 AND r.status = 'pending'`,
        [relationshipId, approvingOrgId]
      );
      
      if (relationshipResult.rows.length === 0) {
        throw new Error('Relationship not found, not authorized, or not in pending status');
      }
      
      // Update the relationship
      await client.query(
        `UPDATE organization_relationships
         SET status = 'active', approved_by_id = $1, updated_at = NOW()
         WHERE id = $2`,
        [approvingUserId, relationshipId]
      );
      
      // Send notification (stub)
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
  
  /**
   * Reject a connection request
   * @param relationshipId Relationship ID
   * @param rejectingUserId User ID rejecting the request
   * @param rejectingOrgId Organization ID rejecting the request
   * @returns Promise with result
   */
  async rejectConnection(
    relationshipId: number, 
    rejectingUserId: number, 
    rejectingOrgId: number
  ): Promise<any> {
    const client = await getMainDbClient();
    
    try {
      await client.query('BEGIN');
      
      // Get the relationship
      const relationshipResult = await client.query(
        `SELECT r.*, 
                o1.name as initiating_org_name,
                o1.contact_email as initiating_org_email
         FROM organization_relationships r
         JOIN organizations o1 ON r.organization_id = o1.id
         WHERE r.id = $1 AND r.related_organization_id = $2 AND r.status = 'pending'`,
        [relationshipId, rejectingOrgId]
      );
      
      if (relationshipResult.rows.length === 0) {
        throw new Error('Relationship not found, not authorized, or not in pending status');
      }
      
      // Update the relationship
      await client.query(
        `UPDATE organization_relationships
         SET status = 'rejected', approved_by_id = $1, updated_at = NOW()
         WHERE id = $2`,
        [rejectingUserId, relationshipId]
      );
      
      // Send notification (stub)
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
  
  /**
   * Terminate an active connection
   * @param relationshipId Relationship ID
   * @param terminatingUserId User ID terminating the connection
   * @param terminatingOrgId Organization ID terminating the connection
   * @returns Promise with result
   */
  async terminateConnection(
    relationshipId: number, 
    terminatingUserId: number, 
    terminatingOrgId: number
  ): Promise<any> {
    const client = await getMainDbClient();
    
    try {
      await client.query('BEGIN');
      
      // Get the relationship
      const relationshipResult = await client.query(
        `SELECT r.*, 
                o1.name as org1_name,
                o1.contact_email as org1_email,
                o2.name as org2_name,
                o2.contact_email as org2_email
         FROM organization_relationships r
         JOIN organizations o1 ON r.organization_id = o1.id
         JOIN organizations o2 ON r.related_organization_id = o2.id
         WHERE r.id = $1 AND (r.organization_id = $2 OR r.related_organization_id = $2) AND r.status = 'active'`,
        [relationshipId, terminatingOrgId]
      );
      
      if (relationshipResult.rows.length === 0) {
        throw new Error('Relationship not found, not authorized, or not in active status');
      }
      
      // Update the relationship
      await client.query(
        `UPDATE organization_relationships
         SET status = 'terminated', updated_at = NOW()
         WHERE id = $1`,
        [relationshipId]
      );
      
      // Send notification (stub)
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

export default new ConnectionService();