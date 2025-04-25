"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestConnectionService = void 0;
const db_1 = require("../../../config/db");
const request_1 = require("../queries/request");
const request_connection_helpers_1 = require("./request-connection-helpers");
const logger_1 = __importDefault(require("../../../utils/logger"));
/**
 * Service for requesting connections
 */
class RequestConnectionService {
    /**
     * Request a connection to another organization
     * @param params Request connection parameters
     * @returns Promise with result
     */
    async requestConnection(params) {
        const { initiatingOrgId, targetOrgId, initiatingUserId, notes } = params;
        const client = await (0, db_1.getMainDbClient)();
        try {
            await client.query('BEGIN');
            // Check if the organizations exist
            const orgsResult = await client.query(request_1.CHECK_ORGANIZATIONS_QUERY, [initiatingOrgId, targetOrgId]);
            if (orgsResult.rows.length !== 2) {
                throw new Error('One or both organizations not found');
            }
            // Check if a relationship already exists
            const existingResult = await client.query(request_1.CHECK_EXISTING_RELATIONSHIP_QUERY, [initiatingOrgId, targetOrgId]);
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
                    return (0, request_connection_helpers_1.updateExistingRelationship)(client, initiatingOrgId, targetOrgId, initiatingUserId, notes, existing.id, orgsResult.rows);
                }
            }
            // Create a new relationship
            return (0, request_connection_helpers_1.createNewRelationship)(client, initiatingOrgId, targetOrgId, initiatingUserId, notes, orgsResult.rows);
        }
        catch (error) {
            await client.query('ROLLBACK');
            logger_1.default.error('Error in requestConnection:', { error });
            throw error;
        }
        finally {
            client.release();
        }
    }
}
exports.RequestConnectionService = RequestConnectionService;
exports.default = new RequestConnectionService();
//# sourceMappingURL=request-connection.js.map