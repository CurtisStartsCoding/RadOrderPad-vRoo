import { getMainDbClient } from '../../../config/db';
import { CHECK_ORGANIZATIONS_QUERY, CHECK_EXISTING_RELATIONSHIP_QUERY } from '../queries/request';
import { updateExistingRelationship, createNewRelationship } from './request-connection-helpers';
/**
 * Service for requesting connections
 */
export class RequestConnectionService {
    /**
     * Request a connection to another organization
     * @param params Request connection parameters
     * @returns Promise with result
     */
    async requestConnection(params) {
        const { initiatingOrgId, targetOrgId, initiatingUserId, notes } = params;
        const client = await getMainDbClient();
        try {
            await client.query('BEGIN');
            // Check if the organizations exist
            const orgsResult = await client.query(CHECK_ORGANIZATIONS_QUERY, [initiatingOrgId, targetOrgId]);
            if (orgsResult.rows.length !== 2) {
                throw new Error('One or both organizations not found');
            }
            // Check if a relationship already exists
            const existingResult = await client.query(CHECK_EXISTING_RELATIONSHIP_QUERY, [initiatingOrgId, targetOrgId]);
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
                    return updateExistingRelationship(client, initiatingOrgId, targetOrgId, initiatingUserId, notes, existing.id, orgsResult.rows);
                }
            }
            // Create a new relationship
            return createNewRelationship(client, initiatingOrgId, targetOrgId, initiatingUserId, notes, orgsResult.rows);
        }
        catch (error) {
            await client.query('ROLLBACK');
            console.error('Error in requestConnection:', error);
            throw error;
        }
        finally {
            client.release();
        }
    }
}
export default new RequestConnectionService();
//# sourceMappingURL=request-connection.js.map