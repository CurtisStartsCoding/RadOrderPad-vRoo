import { queryMainDb } from '../../../config/db';
import enhancedLogger from '../../../utils/enhanced-logger';

/**
 * Interface for trial user profile response
 */
export interface TrialUserProfileResult {
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

/**
 * Get a trial user's profile by ID
 * 
 * @param trialUserId The ID of the trial user
 * @returns Object containing user profile and trial usage information
 */
export async function getTrialUserProfile(
  trialUserId: number
): Promise<TrialUserProfileResult | null> {
  try {
    // Get trial user by ID including profile and validation information
    const userResult = await queryMainDb(
      'SELECT id, email, first_name, last_name, specialty, validation_count, max_validations, created_at FROM trial_users WHERE id = $1',
      [trialUserId]
    );
    
    if (!userResult.rowCount || userResult.rowCount === 0) {
      enhancedLogger.warn('Trial user not found', { trialUserId });
      return null;
    }
    
    const user = userResult.rows[0];
    
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

    enhancedLogger.info('Retrieved trial user profile', { 
      trialUserId: user.id, 
      email: user.email 
    });
    
    return {
      user: userProfile,
      trialInfo: {
        validationsUsed,
        maxValidations,
        validationsRemaining
      }
    };
  } catch (error) {
    enhancedLogger.error('Error in getTrialUserProfile service:', error);
    throw error;
  }
}