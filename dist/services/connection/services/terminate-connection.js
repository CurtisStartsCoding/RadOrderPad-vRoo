"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TerminateConnectionService = void 0;
const db_1 = require("../../../config/db");
const notification_1 = __importDefault(require("../../notification"));
const terminate_1 = require("../queries/terminate");
/**
 * Service for terminating connections
 */
class TerminateConnectionService {
    /**
     * Terminate an active connection
     * @param params Terminate connection parameters
     * @returns Promise with result
     */
    async terminateConnection(params) {
        const { relationshipId, terminatingUserId, terminatingOrgId } = params;
        const client = await (0, db_1.getMainDbClient)();
        try {
            await client.query('BEGIN');
            // Get the relationship
            const relationshipResult = await client.query(terminate_1.GET_RELATIONSHIP_FOR_TERMINATION_QUERY, [relationshipId, terminatingOrgId]);
            if (relationshipResult.rows.length === 0) {
                throw new Error('Relationship not found, not authorized, or not in active status');
            }
            // Update the relationship
            await client.query(terminate_1.TERMINATE_RELATIONSHIP_QUERY, [relationshipId]);
            // Send notification
            const relationship = relationshipResult.rows[0];
            const isInitiator = relationship.organization_id === terminatingOrgId;
            // Notify the other organization
            const partnerEmail = isInitiator ? relationship.org2_email : relationship.org1_email;
            const partnerName = isInitiator ? relationship.org2_name : relationship.org1_name;
            const terminatingOrgName = isInitiator ? relationship.org1_name : relationship.org2_name;
            if (partnerEmail) {
                await notification_1.default.sendConnectionTerminated(partnerEmail, partnerName, terminatingOrgName);
            }
            await client.query('COMMIT');
            return {
                success: true,
                message: 'Connection terminated successfully',
                relationshipId
            };
        }
        catch (error) {
            await client.query('ROLLBACK');
            console.error('Error in terminateConnection:', error);
            throw error;
        }
        finally {
            client.release();
        }
    }
}
exports.TerminateConnectionService = TerminateConnectionService;
exports.default = new TerminateConnectionService();
//# sourceMappingURL=terminate-connection.js.map