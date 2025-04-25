"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrganizationById = getOrganizationById;
const db_1 = require("../../../config/db");
const logger_1 = __importDefault(require("../../../utils/logger"));
/**
 * Get an organization by ID
 *
 * @param orgId Organization ID
 * @returns Promise with organization details or null if not found
 */
async function getOrganizationById(orgId) {
    try {
        // Query for the organization
        const orgQuery = `
      SELECT * 
      FROM organizations
      WHERE id = $1
    `;
        const orgResult = await (0, db_1.queryMainDb)(orgQuery, [orgId]);
        if (orgResult.rowCount === 0) {
            return null;
        }
        const organization = orgResult.rows[0];
        // Get associated users
        const usersQuery = `
      SELECT id, email, first_name, last_name, role, is_active
      FROM users
      WHERE organization_id = $1
      ORDER BY last_name, first_name
    `;
        const usersResult = await (0, db_1.queryMainDb)(usersQuery, [orgId]);
        // Get connection relationships
        const connectionsQuery = `
      SELECT r.*, 
             o1.name as organization_name, 
             o2.name as related_organization_name
      FROM organization_relationships r
      JOIN organizations o1 ON r.organization_id = o1.id
      JOIN organizations o2 ON r.related_organization_id = o2.id
      WHERE r.organization_id = $1 OR r.related_organization_id = $1
    `;
        const connectionsResult = await (0, db_1.queryMainDb)(connectionsQuery, [orgId]);
        // Get billing history
        const billingQuery = `
      SELECT *
      FROM billing_events
      WHERE organization_id = $1
      ORDER BY created_at DESC
    `;
        const billingResult = await (0, db_1.queryMainDb)(billingQuery, [orgId]);
        // Get purgatory history
        const purgatoryQuery = `
      SELECT *
      FROM purgatory_events
      WHERE organization_id = $1
      ORDER BY created_at DESC
    `;
        const purgatoryResult = await (0, db_1.queryMainDb)(purgatoryQuery, [orgId]);
        // Return organization with related data
        return {
            ...organization,
            users: usersResult.rows,
            connections: connectionsResult.rows,
            billingHistory: billingResult.rows,
            purgatoryHistory: purgatoryResult.rows
        };
    }
    catch (error) {
        logger_1.default.error('Error getting organization by ID:', {
            error,
            orgId
        });
        throw error;
    }
}
//# sourceMappingURL=get-organization-by-id.js.map