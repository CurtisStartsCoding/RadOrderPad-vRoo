"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TerminateConnectionService = void 0;
const db_1 = require("../../../config/db");
const manager_1 = __importDefault(require("../../notification/manager"));
const terminate_1 = require("../queries/terminate");
const enhanced_logger_1 = __importDefault(require("../../../utils/enhanced-logger"));
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
        enhanced_logger_1.default.debug('terminateConnection called with params:', {
            relationshipId: params.relationshipId,
            terminatingOrgId: params.terminatingOrgId
        });
        const { relationshipId, terminatingOrgId } = params;
        const client = await (0, db_1.getMainDbClient)();
        try {
            enhanced_logger_1.default.debug('Beginning transaction');
            await client.query('BEGIN');
            // Get the relationship
            enhanced_logger_1.default.debug('Fetching relationship with query:', {
                query: terminate_1.GET_RELATIONSHIP_FOR_TERMINATION_QUERY,
                params: [relationshipId, terminatingOrgId]
            });
            const relationshipResult = await client.query(terminate_1.GET_RELATIONSHIP_FOR_TERMINATION_QUERY, [relationshipId, terminatingOrgId]);
            enhanced_logger_1.default.debug('Relationship query result:', {
                rowCount: relationshipResult.rowCount,
                hasRows: relationshipResult.rows.length > 0
            });
            if (relationshipResult.rows.length === 0) {
                enhanced_logger_1.default.debug('Relationship not found, not authorized, or not in active status');
                throw new Error('Relationship not found, not authorized, or not in active status');
            }
            // Update the relationship
            enhanced_logger_1.default.debug('Updating relationship status to terminated with query:', {
                query: terminate_1.TERMINATE_RELATIONSHIP_QUERY,
                params: [relationshipId]
            });
            await client.query(terminate_1.TERMINATE_RELATIONSHIP_QUERY, [relationshipId]);
            // Send notification
            const relationship = relationshipResult.rows[0];
            const isInitiator = relationship.organization_id === terminatingOrgId;
            enhanced_logger_1.default.debug('Relationship details for notification:', {
                isInitiator,
                terminatingOrgId,
                relationship: {
                    id: relationship.id,
                    organization_id: relationship.organization_id,
                    related_organization_id: relationship.related_organization_id,
                    org1_name: relationship.org1_name,
                    org2_name: relationship.org2_name
                }
            });
            // Notify the other organization
            const partnerEmail = isInitiator ? relationship.org2_email : relationship.org1_email;
            const terminatingOrgName = isInitiator ? relationship.org1_name : relationship.org2_name;
            const partnerOrgName = isInitiator ? relationship.org2_name : relationship.org1_name;
            enhanced_logger_1.default.debug('Notification details:', {
                partnerEmail,
                partnerOrgName,
                terminatingOrgName
            });
            if (partnerEmail) {
                try {
                    enhanced_logger_1.default.debug('Sending connection terminated notification');
                    await manager_1.default.sendConnectionTerminated(partnerEmail, partnerOrgName, terminatingOrgName);
                    enhanced_logger_1.default.debug('Notification sent successfully');
                }
                catch (notificationError) {
                    // Log notification error but don't fail the transaction
                    enhanced_logger_1.default.error('Error sending termination notification:', notificationError);
                    enhanced_logger_1.default.debug('Continuing despite notification error');
                }
            }
            else {
                enhanced_logger_1.default.debug('No partner email found, skipping notification');
            }
            enhanced_logger_1.default.debug('Committing transaction');
            await client.query('COMMIT');
            enhanced_logger_1.default.debug('Connection terminated successfully');
            return {
                success: true,
                message: 'Connection terminated successfully',
                relationshipId
            };
        }
        catch (error) {
            enhanced_logger_1.default.debug('Error occurred, rolling back transaction');
            try {
                await client.query('ROLLBACK');
                enhanced_logger_1.default.debug('Transaction rolled back successfully');
            }
            catch (rollbackError) {
                enhanced_logger_1.default.error('Error rolling back transaction:', rollbackError);
            }
            enhanced_logger_1.default.error('Error in terminateConnection:', error);
            throw error;
        }
        finally {
            enhanced_logger_1.default.debug('Releasing database client');
            client.release();
        }
    }
}
exports.TerminateConnectionService = TerminateConnectionService;
exports.default = new TerminateConnectionService();
//# sourceMappingURL=terminate-connection.js.map