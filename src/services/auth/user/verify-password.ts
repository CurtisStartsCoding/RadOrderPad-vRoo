import * as bcrypt from 'bcrypt';

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, passwordHash: string): Promise<boolean> {
  return bcrypt.compare(password, passwordHash);
}