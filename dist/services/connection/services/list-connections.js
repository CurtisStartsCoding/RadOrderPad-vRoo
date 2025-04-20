import { queryMainDb } from '../../../config/db';
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
    async listConnections(orgId) {
        try {
            const result = await queryMainDb(LIST_CONNECTIONS_QUERY, [orgId]);
            return result.rows.map((row) => {
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
        }
        catch (error) {
            console.error('Error in listConnections:', error);
            throw error;
        }
    }
    /**
     * List pending incoming connection requests
     * @param orgId Organization ID
     * @returns Promise with pending requests list
     */
    async listIncomingRequests(orgId) {
        try {
            const result = await queryMainDb(LIST_INCOMING_REQUESTS_QUERY, [orgId]);
            return result.rows.map((row) => {
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
        }
        catch (error) {
            console.error('Error in listIncomingRequests:', error);
            throw error;
        }
    }
}
export default new ListConnectionsService();
//# sourceMappingURL=list-connections.js.map