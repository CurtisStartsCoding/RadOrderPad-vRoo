"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApproveConnectionService = void 0;
const db_1 = require("../../../config/db");
const notification_1 = __importDefault(require("../../notification"));
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
        try {
            await client.query('BEGIN');
            // Get the relationship
            const relationshipResult = await client.query(approve_1.GET_RELATIONSHIP_FOR_APPROVAL_QUERY, [relationshipId, approvingOrgId]);
            if (relationshipResult.rows.length === 0) {
                throw new Error('Relationship not found, not authorized, or not in pending status');
            }
            // Update the relationship
            await client.query(approve_1.APPROVE_RELATIONSHIP_QUERY, [approvingUserId, relationshipId]);
            // Send notification
            const relationship = relationshipResult.rows[0];
            if (relationship.initiating_org_email) {
                await notification_1.default.sendConnectionApproved(relationship.initiating_org_email, relationship.initiating_org_name);
            }
            await client.query('COMMIT');
            return {
                success: true,
                message: 'Connection request approved successfully',
                relationshipId
            };
        }
        catch (error) {
            await client.query('ROLLBACK');
            enhanced_logger_1.default.error('Error in approveConnection:', error);
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