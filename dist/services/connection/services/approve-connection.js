"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApproveConnectionService = void 0;
const db_1 = require("../../../config/db");
const manager_1 = __importDefault(require("../../notification/manager"));
const approve_1 = require("../queries/approve");
const enhanced_logger_1 = __importDefault(require("../../../utils/enhanced-logger"));
/**
 * Service for approving connection requests
 */
class ApproveConnectionService {
    /**
     * Approve a connection request
     * @param params Approve connection parameters
     * @returns Promise with result
     */
    async approveConnection(params) {
        const { relationshipId, approvingUserId, approvingOrgId } = params;
        const client = await (0, db_1.getMainDbClient)();
        enhanced_logger_1.default.debug(`Approving connection: relationshipId=${relationshipId}, approvingUserId=${approvingUserId}, approvingOrgId=${approvingOrgId}`);
        try {
            await client.query('BEGIN');
            // Get the relationship
            enhanced_logger_1.default.debug(`Fetching relationship for approval: relationshipId=${relationshipId}, approvingOrgId=${approvingOrgId}`);
            const relationshipResult = await client.query(approve_1.GET_RELATIONSHIP_FOR_APPROVAL_QUERY, [relationshipId, approvingOrgId]);
            if (relationshipResult.rows.length === 0) {
                enhanced_logger_1.default.debug(`Relationship not found or not authorized: relationshipId=${relationshipId}, approvingOrgId=${approvingOrgId}`);
                throw new Error('Relationship not found, not authorized, or not in pending status');
            }
            // Update the relationship
            enhanced_logger_1.default.debug(`Updating relationship status to active: relationshipId=${relationshipId}`);
            await client.query(approve_1.APPROVE_RELATIONSHIP_QUERY, [approvingUserId, relationshipId]);
            // Send notification
            const relationship = relationshipResult.rows[0];
            if (relationship.initiating_org_email) {
                enhanced_logger_1.default.debug(`Sending approval notification to: ${relationship.initiating_org_email}`);
                try {
                    await manager_1.default.sendConnectionApproved(relationship.initiating_org_email, relationship.initiating_org_name);
                    enhanced_logger_1.default.debug('Notification sent successfully');
                }
                catch (notificationError) {
                    // Log notification error but don't fail the transaction
                    enhanced_logger_1.default.error('Error sending approval notification:', notificationError);
                }
            }
            else {
                enhanced_logger_1.default.debug('No initiating organization email found, skipping notification');
            }
            await client.query('COMMIT');
            enhanced_logger_1.default.debug(`Connection approved successfully: relationshipId=${relationshipId}`);
            return {
                success: true,
                message: 'Connection request approved successfully',
                relationshipId
            };
        }
        catch (error) {
            await client.query('ROLLBACK');
            enhanced_logger_1.default.error(`Error in approveConnection: ${error instanceof Error ? error.message : 'Unknown error'}`, error);
            throw error;
        }
        finally {
            client.release();
        }
    }
}
exports.ApproveConnectionService = ApproveConnectionService;
exports.default = new ApproveConnectionService();
//# sourceMappingURL=approve-connection.js.map