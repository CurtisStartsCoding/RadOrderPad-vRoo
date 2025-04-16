import notificationManager from '../../notification';
import { ConnectionOperationResponse } from '../types';
import {
  UPDATE_RELATIONSHIP_TO_PENDING_QUERY,
  CREATE_RELATIONSHIP_QUERY
} from '../queries/request';

/**
 * Update an existing relationship to pending
 */
export async function updateExistingRelationship(
  client: any,
  initiatingOrgId: number,
  targetOrgId: number,
  initiatingUserId: number,
  notes: string | undefined,
  existingId: number,
  orgsData: any[]
): Promise<ConnectionOperationResponse> {
  const updateResult = await client.query(
    UPDATE_RELATIONSHIP_TO_PENDING_QUERY,
    [initiatingOrgId, targetOrgId, initiatingUserId, notes || null, existingId]
  );
  
  // Get target organization admin email for notification
  const targetOrg = orgsData.find(org => org.id === targetOrgId);
  
  // Send notification
  if (targetOrg && targetOrg.contact_email) {
    await notificationManager.sendConnectionRequest(
      targetOrg.contact_email,
      orgsData.find(org => org.id === initiatingOrgId)?.name || 'Unknown Organization'
    );
  }
  
  await client.query('COMMIT');
  
  return {
    success: true,
    message: 'Connection request sent successfully',
    relationshipId: updateResult.rows[0].id
  };
}

/**
 * Create a new relationship
 */
export async function createNewRelationship(
  client: any,
  initiatingOrgId: number,
  targetOrgId: number,
  initiatingUserId: number,
  notes: string | undefined,
  orgsData: any[]
): Promise<ConnectionOperationResponse> {
  const insertResult = await client.query(
    CREATE_RELATIONSHIP_QUERY,
    [initiatingOrgId, targetOrgId, initiatingUserId, notes || null]
  );
  
  // Get target organization admin email for notification
  const targetOrg = orgsData.find(org => org.id === targetOrgId);
  
  // Send notification
  if (targetOrg && targetOrg.contact_email) {
    await notificationManager.sendConnectionRequest(
      targetOrg.contact_email,
      orgsData.find(org => org.id === initiatingOrgId)?.name || 'Unknown Organization'
    );
  }
  
  await client.query('COMMIT');
  
  return {
    success: true,
    message: 'Connection request sent successfully',
    relationshipId: insertResult.rows[0].id
  };
}