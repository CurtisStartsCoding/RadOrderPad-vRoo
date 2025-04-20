/**
 * Simple test script for notification service
 * This test uses the fully refactored notification manager
 */
import notificationManager from './notification-manager';

async function testNotificationService(): Promise<void> {
  try {
    // eslint-disable-next-line no-console
    console.log('Testing Notification Service with Refactored Modules...');
    
    // Test invitation email
    // eslint-disable-next-line no-console
    console.log('\nTesting invitation email:');
    await notificationManager.sendInviteEmail(
      'test@example.com',
      'test-token-123',
      'Test Organization',
      'Test Inviter'
    );
    
    // Test password reset email
    // eslint-disable-next-line no-console
    console.log('\nTesting password reset email:');
    await notificationManager.sendPasswordResetEmail(
      'test@example.com',
      'reset-token-456'
    );
    
    // Test general notification email
    // eslint-disable-next-line no-console
    console.log('\nTesting general notification email:');
    await notificationManager.sendNotificationEmail(
      'test@example.com',
      'Test Notification',
      'This is a test notification message.'
    );
    
    // Test connection request email
    // eslint-disable-next-line no-console
    console.log('\nTesting connection request email:');
    await notificationManager.sendConnectionRequest(
      'test@example.com',
      'Requesting Organization'
    );
    
    // Test connection approval email
    // eslint-disable-next-line no-console
    console.log('\nTesting connection approval email:');
    await notificationManager.sendConnectionApproved(
      'test@example.com',
      'Approved Organization'
    );
    
    // Test connection rejection email
    // eslint-disable-next-line no-console
    console.log('\nTesting connection rejection email:');
    await notificationManager.sendConnectionRejected(
      'test@example.com',
      'Rejected Organization'
    );
    
    // Test connection termination email
    // eslint-disable-next-line no-console
    console.log('\nTesting connection termination email:');
    await notificationManager.sendConnectionTerminated(
      'test@example.com',
      'Partner Organization',
      'Terminating Organization'
    );
    
    // eslint-disable-next-line no-console
    console.log('\nAll tests completed successfully!');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error testing notification service:', error);
  }
}

// Run the tests
testNotificationService();