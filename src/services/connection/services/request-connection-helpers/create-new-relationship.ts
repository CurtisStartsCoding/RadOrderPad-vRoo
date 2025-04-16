import notificationManager from '../../../notification';
import { ConnectionOperationResponse } from '../../types';
import { CREATE_RELATIONSHIP_QUERY } from '../../queries/request';

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