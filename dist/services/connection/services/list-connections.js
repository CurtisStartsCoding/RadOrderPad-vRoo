"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListConnectionsService = void 0;
const db_1 = require("../../../config/db");
const list_1 = require("../queries/list");
/**
 * Service for listing connections
 */
class ListConnectionsService {
    /**
     * List connections for an organization
     * @param orgId Organization ID
     * @returns Promise with connections list
     */
    async listConnections(orgId) {
        const result = await (0, db_1.queryMainDb)(list_1.LIST_CONNECTIONS_QUERY, [orgId]);
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
    /**
     * List pending incoming connection requests
     * @param orgId Organization ID
     * @returns Promise with pending requests list
     */
    async listIncomingRequests(orgId) {
        try {
            // Execute the query
            const result = await (0, db_1.queryMainDb)(list_1.LIST_INCOMING_REQUESTS_QUERY, [orgId]);
            // Map the rows to the IncomingRequest interface
            return result.rows.map((row) => {
                return {
                    id: row.id,
                    initiatingOrgId: row.organization_id,
                    initiatingOrgName: row.initiating_org_name || 'Unknown Organization',
                    initiatedBy: row.initiator_first_name && row.initiator_last_name ?
                        `${row.initiator_first_name} ${row.initiator_last_name}` : null,
                    initiatorEmail: row.initiator_email,
                    notes: row.notes,
                    createdAt: row.created_at
                };
            });
        }
        catch (error) {
            // Enhance error message with more details
            if (error instanceof Error) {
                error.message = `Failed to list incoming requests for organization ${orgId}: ${error.message}`;
            }
            throw error;
        }
    }
}
exports.ListConnectionsService = ListConnectionsService;
exports.default = new ListConnectionsService();
//# sourceMappingURL=list-connections.js.map