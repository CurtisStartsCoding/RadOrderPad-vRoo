import { queryMainDb } from '../../../config/db';
/**
 * Get a user by ID
 *
 * @param userId User ID
 * @returns Promise with user details or null if not found
 */
export async function getUserById(userId) {
    try {
        // Query for the user with organization details
        const userQuery = `
      SELECT u.id, u.email, u.first_name, u.last_name, u.role, 
             u.is_active, u.last_login, u.created_at, u.email_verified,
             u.npi, u.specialty, u.phone_number, u.organization_id,
             o.name as organization_name, o.type as organization_type
      FROM users u
      JOIN organizations o ON u.organization_id = o.id
      WHERE u.id = $1
    `;
        const userResult = await queryMainDb(userQuery, [userId]);
        if (userResult.rowCount === 0) {
            return null;
        }
        const user = userResult.rows[0];
        // Get user's location assignments
        const locationsQuery = `
      SELECT l.*
      FROM locations l
      JOIN user_locations ul ON l.id = ul.location_id
      WHERE ul.user_id = $1
    `;
        const locationsResult = await queryMainDb(locationsQuery, [userId]);
        // Return user with related data
        return {
            ...user,
            locations: locationsResult.rows
        };
    }
    catch (error) {
        console.error(`Error getting user with ID ${userId}:`, error);
        throw error;
    }
}
//# sourceMappingURL=get-user-by-id.js.map