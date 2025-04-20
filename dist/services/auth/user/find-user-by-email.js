import { queryMainDb } from '../../../config/db';
/**
 * Find a user by email
 */
export async function findUserByEmail(email) {
    const result = await queryMainDb('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
        return null;
    }
    return result.rows[0];
}
//# sourceMappingURL=find-user-by-email.js.map