import { queryMainDb } from '../../../config/db';

/**
 * Update the last login timestamp for a user
 */
export async function updateLastLogin(userId: number): Promise<void> {
  await queryMainDb(
    'UPDATE users SET last_login = NOW() WHERE id = $1',
    [userId]
  );
}