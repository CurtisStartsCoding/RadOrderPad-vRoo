import { getMainDbClient } from '../../config/db';
import bcrypt from 'bcrypt';
import { generateToken } from '../../utils/token.utils';
import { User, UserResponse } from '../../models';

/**
 * Service function to handle user invitation acceptance
 * @param token Invitation token
 * @param password User's chosen password
 * @param firstName User's first name
 * @param lastName User's last name
 * @returns Promise with login details (token and user info)
 */
export const acceptInvitation = async (
  token: string,
  password: string,
  firstName: string,
  lastName: string
): Promise<{ token: string; user: UserResponse }> => {
  // Start a transaction
  const client = await getMainDbClient();
  
  try {
    await client.query('BEGIN');
    
    // Find the invitation by token
    const invitationResult = await client.query(
      `SELECT id, organization_id, email, role, expires_at, status 
       FROM user_invitations 
       WHERE token = $1`,
      [token]
    );
    
    if (!invitationResult.rowCount || invitationResult.rowCount === 0) {
      throw new Error('Invalid invitation token');
    }
    
    const invitation = invitationResult.rows[0];
    
    // Check if invitation is still valid
    if (invitation.status !== 'pending') {
      throw new Error('Invitation has already been used or expired');
    }
    
    // Check if invitation has expired
    const now = new Date();
    if (now > new Date(invitation.expires_at)) {
      // Update invitation status to 'expired'
      await client.query(
        `UPDATE user_invitations SET status = 'expired', updated_at = NOW() WHERE id = $1`,
        [invitation.id]
      );
      
      await client.query('COMMIT');
      throw new Error('Invitation has expired');
    }
    
    // Check if user with this email already exists
    const existingUserResult = await client.query(
      `SELECT id FROM users WHERE email = $1`,
      [invitation.email]
    );
    
    if (existingUserResult.rowCount && existingUserResult.rowCount > 0) {
      throw new Error('User with this email already exists');
    }
    
    // Hash the password
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10');
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    // Create the user
    const userResult = await client.query(
      `INSERT INTO users (
        organization_id, 
        email, 
        password_hash, 
        first_name, 
        last_name, 
        role, 
        is_active, 
        email_verified,
        created_at,
        updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, true, true, NOW(), NOW())
      RETURNING id, email, first_name, last_name, role, organization_id, is_active, email_verified, created_at, updated_at`,
      [
        invitation.organization_id,
        invitation.email,
        passwordHash,
        firstName,
        lastName,
        invitation.role,
      ]
    );
    
    const newUser = userResult.rows[0];
    
    // Update invitation status to 'accepted'
    await client.query(
      `UPDATE user_invitations SET status = 'accepted', updated_at = NOW() WHERE id = $1`,
      [invitation.id]
    );
    
    // Commit the transaction
    await client.query('COMMIT');
    
    // Create user object for token generation
    const user: User = {
      id: newUser.id,
      organization_id: newUser.organization_id,
      email: newUser.email,
      password_hash: '', // Not needed for token generation
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      role: newUser.role,
      is_active: newUser.is_active,
      created_at: newUser.created_at,
      updated_at: newUser.updated_at,
      email_verified: newUser.email_verified
    };
    
    // Generate JWT token
    const jwtToken = generateToken(user);
    
    // Create user response object
    const userResponse: UserResponse = {
      id: newUser.id,
      email: newUser.email,
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      role: newUser.role,
      organization_id: newUser.organization_id,
      is_active: newUser.is_active,
      email_verified: newUser.email_verified,
      created_at: newUser.created_at,
      updated_at: newUser.updated_at
    };
    
    return {
      token: jwtToken,
      user: userResponse
    };
  } catch (error) {
    // Rollback the transaction in case of error
    await client.query('ROLLBACK');
    throw error;
  } finally {
    // Release the client back to the pool
    client.release();
  }
};