import * as bcrypt from 'bcrypt';
import { UserRegistrationDTO, User, DatabaseClient } from '../types';

/**
 * Create an admin user for an organization
 * Auto-assigns role based on organization type
 */
export async function createAdminUser(
  client: DatabaseClient,
  userData: UserRegistrationDTO,
  organizationId: number,
  organizationType: string
): Promise<User> {
  // Hash the password
  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10');
  const passwordHash = await bcrypt.hash(userData.password, saltRounds);
  
  // Auto-assign role based on organization type
  const role = organizationType === 'referring_practice' ? 'admin_referring' : 'admin_radiology';
  
  // Create the admin user
  const userResult = await client.query(
    `INSERT INTO users
    (organization_id, email, password_hash, first_name, last_name, role, npi,
    specialty, phone_number, is_active, email_verified)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING *`,
    [
      organizationId,
      userData.email,
      passwordHash,
      userData.first_name,
      userData.last_name,
      role, // Use auto-assigned role
      userData.npi || null,
      userData.specialty || null,
      userData.phone_number || null,
      true, // is_active
      false // email_verified
    ]
  );
  
  return userResult.rows[0] as unknown as User;
}