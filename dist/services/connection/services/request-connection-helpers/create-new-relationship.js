"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNewRelationship = createNewRelationship;
const notification_1 = __importDefault(require("../../../notification"));
const request_1 = require("../../queries/request");
async function createNewRelationship(client, initiatingOrgId, targetOrgId, initiatingUserId, notes, orgsData) {
    const insertResult = await client.query(request_1.CREATE_RELATIONSHIP_QUERY, [initiatingOrgId, targetOrgId, initiatingUserId, notes || null]);
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
        relationshipId: insertResult.rows[0].id
    };
}
//# sourceMappingURL=create-new-relationship.js.map