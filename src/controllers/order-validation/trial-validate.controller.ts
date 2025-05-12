import { Request, Response } from 'express';
import { AuthTokenPayload } from '../../models/Auth';

// Define the extended Request type with user property
interface RequestWithUser extends Request {
  user?: AuthTokenPayload;
}
import ValidationService from '../../services/validation';
import { queryMainDb } from '../../config/db';
import enhancedLogger from '../../utils/enhanced-logger';
import { enhanceValidationResult } from '../../utils/response';

/**
 * Controller for handling trial order validation
 */
export class TrialValidateController {
  /**
   * Validate a trial order
   */
  async validateTrialOrder(req: RequestWithUser, res: Response): Promise<void> {
    try {
      // Check if user is a trial user
      if (req.user?.isTrial !== true) {
        res.status(403).json({
          success: false,
          message: 'Access denied. Trial account required.'
        });
        return;
      }
      
      // Extract dictation text from request body
      const { dictationText } = req.body;
      
      // Validate dictation text
      if (!dictationText || typeof dictationText !== 'string' || dictationText.trim().length < 10) {
        res.status(400).json({
          success: false,
          message: 'Valid dictation text is required (minimum 10 characters).'
        });
        return;
      }
      
      // Get trial user ID and specialty
      const trialUserId = req.user.userId;
      const specialty = req.user.specialty || '';
      
      // Check if user has reached validation limit
      const trialUserResult = await queryMainDb(
        'SELECT validation_count, max_validations FROM trial_users WHERE id = $1',
        [trialUserId]
      );
      
      if (!trialUserResult.rowCount || trialUserResult.rowCount === 0) {
        res.status(404).json({
          success: false,
          message: 'Trial user not found.'
        });
        return;
      }
      
      const trialUser = trialUserResult.rows[0];
      
      if (trialUser.validation_count >= trialUser.max_validations) {
        res.status(403).json({
          success: false,
          message: 'Validation limit reached. Please contact support to upgrade to a full account.'
        });
        return;
      }
      
      // Run validation
      let validationResult = await ValidationService.runValidation(
        dictationText,
        {
          // Pass specialty as part of the context
          patientInfo: { specialty }
        },
        true // Use test mode to prevent PHI logging
      );
      
      // Enhance the validation result with confidence scores
      validationResult = await enhanceValidationResult(validationResult, dictationText);
      
      // Increment validation count
      await queryMainDb(
        'UPDATE trial_users SET validation_count = validation_count + 1, last_validation_at = NOW() WHERE id = $1',
        [trialUserId]
      );
      
      // Return validation result
      res.status(200).json({
        success: true,
        validationResult
      });
    } catch (error) {
      enhancedLogger.error('Error in trial validation:', error);
      
      // Handle specific errors
      if (error instanceof Error) {
        if (error.message.includes('LLM service unavailable')) {
          res.status(503).json({
            success: false,
            message: 'Validation service temporarily unavailable. Please try again later.'
          });
          return;
        }
      }
      
      // Generic error
      res.status(500).json({
        success: false,
        message: 'An error occurred during validation. Please try again later.'
      });
    }
  }
}

export default new TrialValidateController();