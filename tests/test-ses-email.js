/**
 * Test script for AWS SES email sending
 * 
 * This script tests sending an email using AWS SES directly.
 * It doesn't rely on the application code, so it's useful for
 * verifying that the AWS credentials and SES configuration are correct.
 * 
 * Usage:
 * ```
 * node tests/test-ses-email.js
 * ```
 */

import dotenv from 'dotenv';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

// Load environment variables
dotenv.config();

// Test email address (replace with your own for testing)
const TEST_EMAIL = process.env.TEST_EMAIL || 'test@example.com';
const FROM_EMAIL = process.env.SES_FROM_EMAIL || 'no-reply@radorderpad.com';

// Initialize the SES client
const sesClient = new SESClient({
  region: process.env.AWS_REGION || 'us-east-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
});

/**
 * Send a test email
 */
async function sendTestEmail() {
  console.log('Sending test email...');
  console.log(`From: ${FROM_EMAIL}`);
  console.log(`To: ${TEST_EMAIL}`);
  
  // Check if test mode is enabled
  const testMode = process.env.EMAIL_TEST_MODE === 'true';
  console.log(`Test mode: ${testMode ? 'ENABLED' : 'DISABLED'}`);
  
  if (testMode) {
    console.log('[TEST MODE] Email send skipped');
    return;
  }
  
  try {
    // Construct the email parameters
    const params = {
      Source: FROM_EMAIL,
      Destination: {
        ToAddresses: [TEST_EMAIL]
      },
      Message: {
        Subject: {
          Data: 'Test Email from RadOrderPad',
          Charset: 'UTF-8'
        },
        Body: {
          Text: {
            Data: 'This is a test email from RadOrderPad to verify AWS SES integration.',
            Charset: 'UTF-8'
          },
          Html: {
            Data: `
              <html>
              <head>
                <style>
                  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                  .header { background-color: #0066cc; color: white; padding: 10px 20px; }
                  .content { padding: 20px; }
                  .footer { font-size: 12px; color: #666; margin-top: 30px; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h2>Test Email</h2>
                  </div>
                  <div class="content">
                    <p>Hello,</p>
                    <p>This is a test email from RadOrderPad to verify AWS SES integration.</p>
                    <p>If you're seeing this, the AWS SES integration is working correctly!</p>
                    <p>Best regards,<br>The RadOrderPad Team</p>
                  </div>
                  <div class="footer">
                    <p>This is an automated message, please do not reply to this email.</p>
                  </div>
                </div>
              </body>
              </html>
            `,
            Charset: 'UTF-8'
          }
        }
      }
    };
    
    // Send the email
    const command = new SendEmailCommand(params);
    await sesClient.send(command);
    
    console.log('✅ Email sent successfully!');
  } catch (error) {
    console.error('❌ Failed to send email:', error);
  }
}

// Run the test
sendTestEmail().catch(error => {
  console.error('Error running test:', error);
  process.exit(1);
});