import { queryMainDb } from '../../../config/db';
import { User } from '../types';

/**
 * Find a user by email
 */
export async function findUserByEmail(email: string): Promise<User | null> {
  const result = await queryMainDb(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );
  
  if (result.rows.length === 0) {
    return null;
  }
  
  return result.rows[0] as User;
}