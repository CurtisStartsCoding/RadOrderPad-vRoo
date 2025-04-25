import notificationManager from '../../../notification';
import { ConnectionOperationResponse } from '../../types';
import { UPDATE_RELATIONSHIP_TO_PENDING_QUERY } from '../../queries/request';

interface DatabaseClient {
  query: (text: string, params?: (string | number | null)[] | undefined) => Promise<{
    rows: Array<{ id: number } & Record<string, unknown>>;
    rowCount: number;
  }>;
}

interface OrganizationData {
  id: number;
  name: string;
  contact_email?: string;
  [key: string]: unknown;
}

/**
 * Update an existing relationship to pending
 */
export async function updateExistingRelationship(
  client: DatabaseClient,
  initiatingOrgId: number,
  targetOrgId: number,
  initiatingUserId: number,
  notes: string | undefined,
  existingId: number,
  orgsData: OrganizationData[]
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