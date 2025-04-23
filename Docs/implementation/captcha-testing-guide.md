# CAPTCHA Testing Guide

This document provides guidance on how to test the self-service registration system with CAPTCHA verification.

## Getting reCAPTCHA Keys

To set up reCAPTCHA for testing the registration system, you need to:

1. **Get reCAPTCHA Keys from Google**:
   - Go to the Google reCAPTCHA admin console: https://www.google.com/recaptcha/admin
   - Sign in with your Google account
   - Click "Create" to create a new reCAPTCHA site
   - Fill in the form:
     - Label: "RadOrderPad API Testing"
     - reCAPTCHA type: Choose "reCAPTCHA v2" or "reCAPTCHA v3" (v3 is recommended for modern applications)
     - Domains: Add your domains (for testing, you can use "localhost" and your API domain)
     - Accept the Terms of Service
     - Click "Submit"
   - You'll receive two keys:
     - **Site Key**: Used in the frontend (client-side)
     - **Secret Key**: Used in the backend (server-side)

2. **Set Environment Variables on the Server**:
   - Set the `RECAPTCHA_SECRET_KEY` environment variable with the Secret Key you obtained
   - For Vercel deployment, you can set this in the Vercel dashboard under Project Settings > Environment Variables
   - For local development, you can add it to your `.env` file:
     ```
     RECAPTCHA_SECRET_KEY=your_secret_key_here
     ```

## Testing Keys

Google provides test keys that always return success:
- Site Key: `6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI`
- Secret Key: `6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe`

These keys are specifically for testing and will always pass verification. Set the environment variable with this test key:

```
RECAPTCHA_SECRET_KEY=6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe
```

## Environment Variables for Testing

For testing the registration with CAPTCHA, set the following environment variables on the server:

```
RECAPTCHA_SECRET_KEY=6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe
NODE_ENV=development
TEST_MODE=true
```

These environment variables need to be set on the server where the API is running, not just in your test script.

## Alternative: Modify the Server Code for Testing

If you can't modify the environment variables on the server, you can modify the server code to bypass CAPTCHA verification in test mode.

For detailed instructions on how to modify the server code, see [CAPTCHA Server Modifications for Testing](./captcha-server-modifications.md).

The main changes include:

1. Modifying the `captcha.ts` file to bypass verification in test mode
2. Updating the registration controller to use the test mode flag
3. Adding a test endpoint that bypasses CAPTCHA verification

These modifications will allow you to test the registration process without needing a valid CAPTCHA token.

## Running the Test

Once you have set up the environment variables or modified the server code, you can run the test using:

```
.\debug-scripts\vercel-tests\test-register-captcha.bat
```

This will test the registration process with CAPTCHA verification.

## Frontend Integration

For information on how to use the site key in the frontend application, see [CAPTCHA Frontend Integration Guide](./captcha-frontend-guide.md).

The site key (`6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI`) is used in the frontend to render the reCAPTCHA widget, while the secret key is used in the backend to verify the CAPTCHA token.
