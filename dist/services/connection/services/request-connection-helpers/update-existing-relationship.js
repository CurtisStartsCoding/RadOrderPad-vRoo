"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateExistingRelationship = updateExistingRelationship;
const notification_1 = __importDefault(require("../../../notification"));
const request_1 = require("../../queries/request");
/**
 * Update an existing relationship to pending
 */
async function updateExistingRelationship(client, initiatingOrgId, targetOrgId, initiatingUserId, notes, existingId, orgsData) {
    const updateResult = await client.query(request_1.UPDATE_RELATIONSHIP_TO_PENDING_QUERY, [initiatingOrgId, targetOrgId, initiatingUserId, notes || null, existingId]);
    // Get target organization admin email for notification
    const targetOrg = orgsData.find(org => org.id === targetOrgId);
    // Send notification
    if (targetOrg && targetOrg.contact_email) {
        await notification_1.default.sendConnectionRequest(targetOrg.contact_email, orgsData.find(org => org.id === initiatingOrgId)?.name || 'Unknown Organization');
    }
    await client.query('COMMIT');
    return {
        success: true,
        message: 'Connection request sent successfully',
        relationshipId: updateResult.rows[0].id
    };
}
//# sourceMappingURL=update-existing-relationship.js.map