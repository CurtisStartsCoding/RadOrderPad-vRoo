import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { queryMainDb } from '../../../config/db';
import enhancedLogger from '../../../utils/enhanced-logger';

/**
 * Register a new trial user
 * 
 * @param email User email
 * @param password User password
 * @param firstName User first name
 * @param lastName User last name
 * @param specialty User specialty
 * @returns Object containing JWT token and trial information
 */
/**
 * Interface for trial registration result including validation usage information
 */
export interface TrialRegisterResult {
  token: string;
  trialInfo: {
    validationsUsed: number;
    maxValidations: number;
    validationsRemaining: number;
  };
}

export async function registerTrialUser(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  specialty: string
): Promise<TrialRegisterResult> {
  try {
    // Check if email exists in users table (Main DB)
    const existingUserResult = await queryMainDb(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );
    
    if (existingUserResult.rowCount && existingUserResult.rowCount > 0) {
      throw new Error('Email associated with a full account.');
    }
    
    // Check if email exists in trial_users table (Main DB)
    const existingTrialUserResult = await queryMainDb(
      'SELECT id FROM trial_users WHERE email = $1',
      [email]
    );
    
    if (existingTrialUserResult.rowCount && existingTrialUserResult.rowCount > 0) {
      throw new Error('Email already registered for a trial.');
    }
    
    // Hash the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    // Insert new trial user
    const insertResult = await queryMainDb(
      `INSERT INTO trial_users (
        email, 
        password_hash, 
        first_name, 
        last_name, 
        specialty, 
        validation_count, 
        max_validations, 
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) RETURNING id`,
      [email, passwordHash, firstName, lastName, specialty, 0, 100]
    );
    
    const trialUserId = insertResult.rows[0].id;
    
    // Generate trial JWT
    const payload = {
      trialUserId,
      userId: trialUserId, // Map trialUserId to userId for compatibility
      orgId: 0, // No org for trial users
      role: 'trial_physician',
      email,
      specialty,
      isTrial: true
    };
    
    const secret = process.env.JWT_SECRET || 'default_jwt_secret';
    const expiresIn = process.env.JWT_EXPIRES_IN || '24h';
    
    // Need to use 'as any' due to type incompatibility in the jwt library
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const token = (jwt as any).sign(payload, secret, { expiresIn });
    
    enhancedLogger.info('Trial user registered successfully', {
      trialUserId,
      email,
      specialty
    });
    
    // Initial validation counts for new trial users
    const validationsUsed = 0;
    const maxValidations = 100;
    const validationsRemaining = maxValidations;
    
    return {
      token,
      trialInfo: {
        validationsUsed,
        maxValidations,
        validationsRemaining
      }
    };
  } catch (error) {
    enhancedLogger.error('Error in registerTrialUser service:', error);
    throw error;
  }
}