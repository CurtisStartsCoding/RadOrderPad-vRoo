"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listAllOrganizations = listAllOrganizations;
const db_1 = require("../../../config/db");
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
        console.error('Error listing organizations:', error);
        throw error;
    }
}
//# sourceMappingURL=list-all-organizations.js.map