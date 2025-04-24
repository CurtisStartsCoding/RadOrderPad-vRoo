"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RejectConnectionService = void 0;
const db_1 = require("../../../config/db");
const manager_1 = __importDefault(require("../../notification/manager"));
const approve_1 = require("../queries/approve");
const reject_1 = require("../queries/reject");
const enhanced_logger_1 = __importDefault(require("../../../utils/enhanced-logger"));
/**
 * Service for rejecting connection requests
 */
class RejectConnectionService {
    /**
     * Reject a connection request
     * @param params Reject connection parameters
     * @returns Promise with result
     */
    async rejectConnection(params) {
        const { relationshipId, rejectingUserId, rejectingOrgId } = params;
        enhanced_logger_1.default.debug(`Rejecting connection request: relationshipId=${relationshipId}, rejectingUserId=${rejectingUserId}, rejectingOrgId=${rejectingOrgId}`);
        const client = await (0, db_1.getMainDbClient)();
        try {
            // Start transaction
            enhanced_logger_1.default.debug(`Starting transaction for rejecting connection request: relationshipId=${relationshipId}`);
            await client.query('BEGIN');
            // Check if the relationship exists, is in pending status, and the user is authorized to reject it
            enhanced_logger_1.default.debug(`Checking if relationship exists and can be rejected: relationshipId=${relationshipId}, rejectingOrgId=${rejectingOrgId}`);
            const relationshipResult = await client.query(approve_1.GET_RELATIONSHIP_FOR_APPROVAL_QUERY, [relationshipId, rejectingOrgId]);
            if (relationshipResult.rows.length === 0) {
                enhanced_logger_1.default.debug(`Relationship not found, not authorized, or not in pending status: relationshipId=${relationshipId}, rejectingOrgId=${rejectingOrgId}`);
                throw new Error('Relationship not found, not authorized, or not in pending status');
            }
            // Update the relationship status to rejected
            enhanced_logger_1.default.debug(`Updating relationship status to rejected: relationshipId=${relationshipId}, rejectingUserId=${rejectingUserId}`);
            await client.query(reject_1.REJECT_RELATIONSHIP_QUERY, [rejectingUserId, relationshipId]);
            // Send notification to the initiating organization
            const relationship = relationshipResult.rows[0];
            if (relationship.initiating_org_email) {
                enhanced_logger_1.default.debug(`Sending rejection notification to initiating organization: email=${relationship.initiating_org_email}, name=${relationship.initiating_org_name}`);
                try {
                    await manager_1.default.sendConnectionRejected(relationship.initiating_org_email, relationship.initiating_org_name);
                    enhanced_logger_1.default.debug(`Rejection notification sent successfully`);
                }
                catch (notificationError) {
                    // Log notification error but don't fail the transaction
                    enhanced_logger_1.default.error(`Error sending rejection notification:`, notificationError);
                    enhanced_logger_1.default.debug(`Continuing with transaction despite notification error`);
                }
            }
            else {
                enhanced_logger_1.default.debug(`No initiating organization email found, skipping notification`);
            }
            // Commit transaction
            enhanced_logger_1.default.debug(`Committing transaction for rejecting connection request: relationshipId=${relationshipId}`);
            await client.query('COMMIT');
            enhanced_logger_1.default.debug(`Connection request rejected successfully: relationshipId=${relationshipId}`);
            return {
                success: true,
                message: 'Connection request rejected successfully',
                relationshipId
            };
        }
        catch (error) {
            // Rollback transaction on error
            enhanced_logger_1.default.debug(`Rolling back transaction due to error: relationshipId=${relationshipId}`);
            await client.query('ROLLBACK');
            enhanced_logger_1.default.error('Error in rejectConnection:', error);
            throw error;
        }
        finally {
            // Release client
            client.release();
            enhanced_logger_1.default.debug(`Database client released: relationshipId=${relationshipId}`);
        }
    }
}
exports.RejectConnectionService = RejectConnectionService;
exports.default = new RejectConnectionService();
//# sourceMappingURL=reject-connection.js.map