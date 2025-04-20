"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserByEmail = findUserByEmail;
const db_1 = require("../../../config/db");
/**
 * Find a user by email
 */
async function findUserByEmail(email) {
    const result = await (0, db_1.queryMainDb)('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
        return null;
    }
    return result.rows[0];
}
//# sourceMappingURL=find-user-by-email.js.map