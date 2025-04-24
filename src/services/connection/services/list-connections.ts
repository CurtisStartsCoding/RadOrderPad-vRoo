import { queryMainDb } from '../../../config/db';
import { Connection, IncomingRequest } from '../types';
import { LIST_CONNECTIONS_QUERY, LIST_INCOMING_REQUESTS_QUERY } from '../queries/list';

/**
 * Service for listing connections
 */
export class ListConnectionsService {
  /**
   * List connections for an organization
   * @param orgId Organization ID
   * @returns Promise with connections list
   */
  async listConnections(orgId: number): Promise<Connection[]> {
    const result = await queryMainDb(LIST_CONNECTIONS_QUERY, [orgId]);
    
    return result.rows.map((row: Record<string, unknown>) => {
      // Determine if this org is the initiator or target
      const isInitiator = row.organization_id === orgId;
      
      return {
        id: row.id as number,
        partnerOrgId: isInitiator ? row.related_organization_id as number : row.organization_id as number,
        partnerOrgName: isInitiator ? row.target_org_name as string : row.initiating_org_name as string,
        status: row.status as Connection['status'],
        isInitiator,
        initiatedBy: row.initiator_first_name && row.initiator_last_name ? 
          `${row.initiator_first_name} ${row.initiator_last_name}` : null,
        approvedBy: row.approver_first_name && row.approver_last_name ? 
          `${row.approver_first_name} ${row.approver_last_name}` : null,
        notes: row.notes as string | null,
        createdAt: row.created_at as Date,
        updatedAt: row.updated_at as Date
      };
    });
  }
  
  /**
   * List pending incoming connection requests
   * @param orgId Organization ID
   * @returns Promise with pending requests list
   */
  async listIncomingRequests(orgId: number): Promise<IncomingRequest[]> {
    try {
      // Execute the query
      const result = await queryMainDb(LIST_INCOMING_REQUESTS_QUERY, [orgId]);
      
      // Map the rows to the IncomingRequest interface
      return result.rows.map((row: Record<string, unknown>) => {
        return {
          id: row.id as number,
          initiatingOrgId: row.organization_id as number,
          initiatingOrgName: (row.initiating_org_name as string) || 'Unknown Organization',
          initiatedBy: row.initiator_first_name && row.initiator_last_name ?
            `${row.initiator_first_name} ${row.initiator_last_name}` : null,
          initiatorEmail: row.initiator_email as string | null,
          notes: row.notes as string | null,
          createdAt: row.created_at as Date
        };
      });
    } catch (error) {
      // Enhance error message with more details
      if (error instanceof Error) {
        error.message = `Failed to list incoming requests for organization ${orgId}: ${error.message}`;
      }
      throw error;
    }
  }
}

export default new ListConnectionsService();