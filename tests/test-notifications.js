/**
 * Test script for notification service
 *
 * This script tests the notification service by sending test emails
 * using AWS SES. It verifies that the email sending functionality
 * is working correctly.
 *
 * Usage:
 * ```
 * node tests/test-notifications.js
 * ```
 */

/* eslint-disable no-console, no-undef */

import dotenv from 'dotenv';
import notificationManager from '../dist/services/notification/notification-manager.js';

// Load environment variables
dotenv.config();

// Test email address (replace with your own for testing)
const TEST_EMAIL = process.env.TEST_EMAIL || 'test@example.com';

/**
 * Test sending an invitation email
 */
async function testInviteEmail() {
  console.log('\n--- Testing Invitation Email ---');
  try {
    await notificationManager.sendInviteEmail(
      TEST_EMAIL,
      'test-invitation-token-123',
      'Test Organization',
      'Test Admin'
    );
    console.log('✅ Invitation email test completed');
  } catch (error) {
    console.error('❌ Invitation email test failed:', error);
  }
}

/**
 * Test sending a password reset email
 */
async function testPasswordResetEmail() {
  console.log('\n--- Testing Password Reset Email ---');
  try {
    await notificationManager.sendPasswordResetEmail(
      TEST_EMAIL,
      'test-password-reset-token-123'
    );
    console.log('✅ Password reset email test completed');
  } catch (error) {
    console.error('❌ Password reset email test failed:', error);
  }
}

/**
 * Test sending a general notification email
 */
async function testNotificationEmail() {
  console.log('\n--- Testing General Notification Email ---');
  try {
    await notificationManager.sendNotificationEmail(
      TEST_EMAIL,
      'Test Notification',
      'This is a test notification message.'
    );
    console.log('✅ General notification email test completed');
  } catch (error) {
    console.error('❌ General notification email test failed:', error);
  }
}

/**
 * Test sending a connection request email
 */
async function testConnectionRequestEmail() {
  console.log('\n--- Testing Connection Request Email ---');
  try {
    await notificationManager.sendConnectionRequest(
      TEST_EMAIL,
      'Requesting Organization'
    );
    console.log('✅ Connection request email test completed');
  } catch (error) {
    console.error('❌ Connection request email test failed:', error);
  }
}

/**
 * Run all tests
 */
async function runTests() {
  console.log('Starting notification service tests...');
  console.log(`Using test email: ${TEST_EMAIL}`);
  console.log(`Email test mode: ${process.env.EMAIL_TEST_MODE === 'true' ? 'ENABLED' : 'DISABLED'}`);
  
  if (process.env.EMAIL_TEST_MODE !== 'true') {
    console.log('\n⚠️ WARNING: Email test mode is disabled. Real emails will be sent.');
    console.log('Set EMAIL_TEST_MODE=true in .env to prevent sending real emails during testing.');
  }
  
  // Run the tests
  await testInviteEmail();
  await testPasswordResetEmail();
  await testNotificationEmail();
  await testConnectionRequestEmail();
  
  console.log('\nAll notification tests completed.');
  
  if (process.env.EMAIL_TEST_MODE === 'true') {
    console.log('\nℹ️ Email test mode was enabled, so no actual emails were sent.');
    console.log('Check the logs above to verify that the tests completed successfully.');
  } else {
    console.log('\nℹ️ Real emails were sent to:', TEST_EMAIL);
    console.log('Please check the inbox to verify that the emails were received.');
    console.log('Also check the AWS SES console to verify the sending statistics.');
  }
}

// Run the tests
runTests().catch(error => {
  console.error('Error running tests:', error);
  process.exit(1);
});