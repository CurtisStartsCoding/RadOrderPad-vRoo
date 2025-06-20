"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyUserAuthorization = verifyUserAuthorization;
const db_1 = require("../../../../config/db");
/**
 * Verify that the user belongs to the referring organization
 *
 * @param userId The ID of the user
 * @param referringOrgId The ID of the referring organization
 * @throws Error if the user is not authorized
 */
async function verifyUserAuthorization(userId, referringOrgId) {
    const userResult = await (0, db_1.queryMainDb)('SELECT organization_id FROM users WHERE id = $1', [userId]);
    if (userResult.rows.length === 0) {
        throw new Error('User not found');
    }
    const user = userResult.rows[0];
    if (user.organization_id !== referringOrgId) {
        throw new Error('Unauthorized: User does not belong to the referring organization');
    }
}
//# sourceMappingURL=verify-user-authorization.js.map