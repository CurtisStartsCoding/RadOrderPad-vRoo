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
/**
 * Interface for trial login result including user profile and validation usage information
 */
export interface TrialLoginResult {
  token: string;
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    specialty: string | null;
    isTrial: true;
    createdAt: Date;
  };
  trialInfo: {
    validationsUsed: number;
    maxValidations: number;
    validationsRemaining: number;
  };
}

export async function loginTrialUser(
  email: string,
  password: string
): Promise<TrialLoginResult> {
  try {
    // Get trial user by email including profile and validation information
    const userResult = await queryMainDb(
      'SELECT id, email, password_hash, first_name, last_name, specialty, validation_count, max_validations, created_at FROM trial_users WHERE email = $1',
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
    
    // Calculate validation information
    const validationsUsed = user.validation_count || 0;
    const maxValidations = user.max_validations || 100;
    const validationsRemaining = Math.max(0, maxValidations - validationsUsed);
    
    // Construct user profile object
    const userProfile: {
      id: number;
      email: string;
      firstName: string;
      lastName: string;
      specialty: string | null;
      isTrial: true;
      createdAt: Date;
    } = {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      specialty: user.specialty || null,
      isTrial: true as const,
      createdAt: user.created_at
    };

    return {
      token,
      user: userProfile,
      trialInfo: {
        validationsUsed,
        maxValidations,
        validationsRemaining
      }
    };
  } catch (error) {
    enhancedLogger.error('Error in loginTrialUser service:', error);
    throw error;
  }
}