import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { queryMainDb } from '../../../config/db';
import enhancedLogger from '../../../utils/enhanced-logger';

/**
 * Login a trial user
 * 
 * @param email User email
 * @param password User password
 * @returns Object containing JWT token
 */
export async function loginTrialUser(
  email: string,
  password: string
): Promise<{ token: string }> {
  try {
    // Get trial user by email
    const userResult = await queryMainDb(
      'SELECT id, email, password_hash, specialty FROM trial_users WHERE email = $1',
      [email]
    );
    
    if (!userResult.rowCount || userResult.rowCount === 0) {
      throw new Error('Invalid trial email or password.');
    }
    
    const user = userResult.rows[0];
    
    // Compare password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    
    if (!passwordMatch) {
      throw new Error('Invalid trial email or password.');
    }
    
    // Generate trial JWT
    const payload = {
      trialUserId: user.id,
      userId: user.id, // Map trialUserId to userId for compatibility
      orgId: 0, // No org for trial users
      role: 'trial_physician',
      email: user.email,
      specialty: user.specialty,
      isTrial: true
    };
    
    const secret = process.env.JWT_SECRET || 'default_jwt_secret';
    const expiresIn = process.env.JWT_EXPIRES_IN || '24h';
    
    // Need to use 'as any' due to type incompatibility in the jwt library
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const token = (jwt as any).sign(payload, secret, { expiresIn });
    
    enhancedLogger.info('Trial user logged in successfully', { 
      trialUserId: user.id, 
      email: user.email 
    });
    
    return { token };
  } catch (error) {
    enhancedLogger.error('Error in loginTrialUser service:', error);
    throw error;
  }
}