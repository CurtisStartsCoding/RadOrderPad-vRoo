"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAdminUser = createAdminUser;
const bcrypt = __importStar(require("bcrypt"));
/**
 * Create an admin user for an organization
 */
async function createAdminUser(client, userData, organizationId) {
    // Hash the password
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10');
    const passwordHash = await bcrypt.hash(userData.password, saltRounds);
    // Create the admin user
    const userResult = await client.query(`INSERT INTO users
    (organization_id, email, password_hash, first_name, last_name, role, npi,
    specialty, phone_number, is_active, email_verified)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING *`, [
        organizationId,
        userData.email,
        passwordHash,
        userData.first_name,
        userData.last_name,
        userData.role,
        userData.npi || null,
        userData.specialty || null,
        userData.phone_number || null,
        true, // is_active
        false // email_verified
    ]);
    return userResult.rows[0];
}
//# sourceMappingURL=create-admin-user.js.map