"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listAllOrganizations = listAllOrganizations;
const db_1 = require("../../../config/db");
const logger_1 = __importDefault(require("../../../utils/logger"));
/**
 * List all organizations with optional filtering
 *
 * @param filters Optional filters for organizations
 * @returns Promise with array of organizations
 */
async function listAllOrganizations(filters) {
    try {
        // Start building the query
        let query = `
      SELECT * 
      FROM organizations
      WHERE 1=1
    `;
        // Add filters if provided
        const params = [];
        let paramIndex = 1;
        if (filters.name) {
            query += ` AND name ILIKE $${paramIndex}`;
            params.push(`%${filters.name}%`);
            paramIndex++;
        }
        if (filters.type) {
            query += ` AND type = $${paramIndex}`;
            params.push(filters.type);
            paramIndex++;
        }
        if (filters.status) {
            query += ` AND status = $${paramIndex}`;
            params.push(filters.status);
            paramIndex++;
        }
        // Add ordering
        query += ` ORDER BY name ASC`;
        // Execute the query
        const result = await (0, db_1.queryMainDb)(query, params);
        return result.rows;
    }
    catch (error) {
        logger_1.default.error('Error listing organizations:', {
            error,
            filters
        });
        throw error;
    }
}
//# sourceMappingURL=list-all-organizations.js.map