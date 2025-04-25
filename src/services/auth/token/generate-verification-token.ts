import { randomBytes } from 'crypto';
import { DatabaseClient } from '../types';

/**
 * Generate a verification token for email verification
 * @param client Database client
 * @param userId User ID
 * @returns The generated verification token
 */
export async function generateVerificationToken(
  client: DatabaseClient,
  userId: number
): Promise<string> {
  // Generate a random token
  const token = randomBytes(32).toString('hex');
  
  // Calculate expiry date (24 hours from now)
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24);
  
  // Convert Date to ISO string for database storage
  const expiresAtString = expiresAt.toISOString();
  
  // Store the token in the database
  await client.query(
    `INSERT INTO email_verification_tokens 
    (user_id, token, expires_at, used) 
    VALUES ($1, $2, $3, $4)`,
    [userId, token, expiresAtString, false]
  );
  
  return token;
}