"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RejectConnectionService = void 0;
const db_1 = require("../../../config/db");
const notification_1 = __importDefault(require("../../notification"));
const approve_1 = require("../queries/approve");
const reject_1 = require("../queries/reject");
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
        const client = await (0, db_1.getMainDbClient)();
        try {
            await client.query('BEGIN');
            // Get the relationship
            const relationshipResult = await client.query(approve_1.GET_RELATIONSHIP_FOR_APPROVAL_QUERY, [relationshipId, rejectingOrgId]);
            if (relationshipResult.rows.length === 0) {
                throw new Error('Relationship not found, not authorized, or not in pending status');
            }
            // Update the relationship
            await client.query(reject_1.REJECT_RELATIONSHIP_QUERY, [rejectingUserId, relationshipId]);
            // Send notification
            const relationship = relationshipResult.rows[0];
            if (relationship.initiating_org_email) {
                await notification_1.default.sendConnectionRejected(relationship.initiating_org_email, relationship.initiating_org_name);
            }
            await client.query('COMMIT');
            return {
                success: true,
                message: 'Connection request rejected successfully',
                relationshipId
            };
        }
        catch (error) {
            await client.query('ROLLBACK');
            console.error('Error in rejectConnection:', error);
            throw error;
        }
        finally {
            client.release();
        }
    }
}
exports.RejectConnectionService = RejectConnectionService;
exports.default = new RejectConnectionService();
//# sourceMappingURL=reject-connection.js.map