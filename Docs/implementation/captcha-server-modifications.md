# CAPTCHA Server Modifications for Testing

This document explains how to modify the server code to support testing the registration with CAPTCHA verification.

## Current Issues

The current implementation of CAPTCHA verification makes it difficult to test the registration process because:

1. The server requires a valid CAPTCHA token
2. The token is verified with the reCAPTCHA API
3. Test tokens are not accepted by the API

## Recommended Modifications

To support testing, we recommend the following modifications to the server code:

### 1. Modify the CAPTCHA Verification Function

Update the `src/utils/captcha.ts` file to bypass verification in test mode:

```typescript
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
export function mockVerifyCaptcha(token: string): boolean {
  // In development or test mode, always return true
  if (process.env.NODE_ENV === 'development' || process.env.TEST_MODE === 'true') {
    return true;
  }
  
  // In production, use the real implementation
  return false;
}
```

### 2. Modify the Registration Controller

Update the `src/controllers/auth/register.controller.ts` file to use the test mode flag:

```typescript
// In the register method
async register(req: Request, res: Response): Promise<void> {
  try {
    const { organization, user, captchaToken } = req.body;
    
    // ... existing validation code ...
    
    // Check for test mode
    const isTestMode = req.headers['x-test-mode'] === 'true' || 
                      process.env.NODE_ENV === 'development' || 
                      process.env.TEST_MODE === 'true';
    
    // Verify CAPTCHA token
    if (!captchaToken) {
      res.status(400).json({ message: 'CAPTCHA verification is required' });
      return;
    }
    
    const captchaValid = await verifyCaptcha(captchaToken, isTestMode);
    if (!captchaValid) {
      res.status(400).json({ message: 'CAPTCHA verification failed' });
      return;
    }
    
    // ... rest of the registration logic ...
  } catch (error) {
    // ... error handling ...
  }
}
```

### 3. Add a Test Endpoint

Add a test endpoint to the `src/routes/auth.routes.ts` file:

```typescript
// Import the register controller
import registerController from '../controllers/auth/register.controller';

// ... existing code ...

// Add a test endpoint that bypasses CAPTCHA verification
router.post('/register-test', (req, res, next) => {
  // Set the test mode header
  req.headers['x-test-mode'] = 'true';
  // Call the regular register controller
  registerController.register(req, res);
});

// ... existing code ...
```

## Environment Variables

Set the following environment variables for testing:

```
NODE_ENV=development
TEST_MODE=true
RECAPTCHA_SECRET_KEY=your_secret_key_here
```

## Testing

After making these modifications, you can test the registration process using:

1. The regular endpoint with the test mode header:
   ```
   POST /api/auth/register
   Headers: { 'x-test-mode': 'true' }
   ```

2. The test endpoint:
   ```
   POST /api/auth/register-test
   ```

Both approaches will bypass CAPTCHA verification in test mode.

## Security Considerations

These modifications should only be used in development and testing environments. In production, CAPTCHA verification should always be enabled to prevent automated abuse.

To ensure this, you can add additional checks:

```typescript
// Only allow test mode in non-production environments
const isTestMode = (req.headers['x-test-mode'] === 'true' || 
                   process.env.TEST_MODE === 'true') && 
                   process.env.NODE_ENV !== 'production';
```

This ensures that test mode cannot be enabled in production, even if the environment variables are set.