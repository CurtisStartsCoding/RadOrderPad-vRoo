"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLastLogin = updateLastLogin;
const db_1 = require("../../../config/db");
/**
 * Update the last login timestamp for a user
 */
async function updateLastLogin(userId) {
    await (0, db_1.queryMainDb)('UPDATE users SET last_login = NOW() WHERE id = $1', [userId]);
}
//# sourceMappingURL=update-last-login.js.map