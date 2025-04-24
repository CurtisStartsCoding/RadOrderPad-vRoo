import axios from 'axios';
import enhancedLogger from './enhanced-logger';

/**
 * Verify a CAPTCHA token with the reCAPTCHA API
 * @param token The CAPTCHA token to verify
 * @param isTestMode Optional flag to bypass verification in test mode
 * @returns True if the token is valid, false otherwise
 */
export async function verifyCaptcha(token: string, isTestMode = false): Promise<boolean> {
  // Bypass verification in test mode
  if (isTestMode || process.env.NODE_ENV === 'development' || process.env.TEST_MODE === 'true') {
    enhancedLogger.info('CAPTCHA verification bypassed in test mode');
    return true;
  }
  
  try {
    // Get the reCAPTCHA secret key from environment variables
    const recaptchaSecretKey = process.env.RECAPTCHA_SECRET_KEY;
    
    if (!recaptchaSecretKey) {
      enhancedLogger.error('RECAPTCHA_SECRET_KEY is not set in environment variables');
      return false;
    }
    
    // Verify the token with the reCAPTCHA API
    const response = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      null,
      {
        params: {
          secret: recaptchaSecretKey,
          response: token
        }
      }
    );
    
    // Check if the verification was successful
    if (response.data && response.data.success) {
      return true;
    }
    
    return false;
  } catch (error) {
    enhancedLogger.error('Error verifying CAPTCHA:', error);
    return false;
  }
}

/**
 * Mock implementation for testing purposes
 * Always returns true in development environment
 */
export async function mockVerifyCaptcha(token: string): Promise<boolean> {
  // In development, always return true
  if (process.env.NODE_ENV === 'development') {
    return true;
  }
  
  // In production, use the real implementation
  return verifyCaptcha(token);
}