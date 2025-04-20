import { queryMainDb } from '../../../config/db';
/**
 * Get an organization by ID
 *
 * @param orgId Organization ID
 * @returns Promise with organization details or null if not found
 */
export async function getOrganizationById(orgId) {
    try {
        // Query for the organization
        const orgQuery = `
      SELECT * 
      FROM organizations
      WHERE id = $1
    `;
        const orgResult = await queryMainDb(orgQuery, [orgId]);
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
        const usersResult = await queryMainDb(usersQuery, [orgId]);
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
        const connectionsResult = await queryMainDb(connectionsQuery, [orgId]);
        // Get billing history
        const billingQuery = `
      SELECT *
      FROM billing_events
      WHERE organization_id = $1
      ORDER BY created_at DESC
    `;
        const billingResult = await queryMainDb(billingQuery, [orgId]);
        // Get purgatory history
        const purgatoryQuery = `
      SELECT *
      FROM purgatory_events
      WHERE organization_id = $1
      ORDER BY created_at DESC
    `;
        const purgatoryResult = await queryMainDb(purgatoryQuery, [orgId]);
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
        console.error(`Error getting organization with ID ${orgId}:`, error);
        throw error;
    }
}
//# sourceMappingURL=get-organization-by-id.js.map