"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listAllUsers = listAllUsers;
const db_1 = require("../../../config/db");
const logger_1 = __importDefault(require("../../../utils/logger"));
/**
 * List all users with optional filtering
 *
 * @param filters Optional filters for users
 * @returns Promise with array of users
 */
async function listAllUsers(filters) {
    try {
        // Start building the query
        let query = `
      SELECT u.id, u.email, u.first_name, u.last_name, u.role, 
             u.is_active, u.last_login, u.created_at, u.email_verified,
             u.npi, u.specialty, u.phone_number,
             o.id as organization_id, o.name as organization_name, o.type as organization_type
      FROM users u
      JOIN organizations o ON u.organization_id = o.id
      WHERE 1=1
    `;
        // Add filters if provided
        const params = [];
        let paramIndex = 1;
        if (filters.orgId) {
            query += ` AND u.organization_id = $${paramIndex}`;
            params.push(filters.orgId);
            paramIndex++;
        }
        if (filters.email) {
            query += ` AND u.email ILIKE $${paramIndex}`;
            params.push(`%${filters.email}%`);
            paramIndex++;
        }
        if (filters.role) {
            query += ` AND u.role = $${paramIndex}`;
            params.push(filters.role);
            paramIndex++;
        }
        if (filters.status !== undefined) {
            query += ` AND u.is_active = $${paramIndex}`;
            params.push(filters.status);
            paramIndex++;
        }
        // Add ordering
        query += ` ORDER BY u.last_name, u.first_name`;
        // Execute the query
        const result = await (0, db_1.queryMainDb)(query, params);
        // Remove password_hash from results for security
        const users = result.rows.map((user) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password_hash, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });
        return users;
    }
    catch (error) {
        logger_1.default.error('Error listing users:', {
            error,
            filters
        });
        throw error;
    }
}
//# sourceMappingURL=list-all-users.js.map