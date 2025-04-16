// Simple test script for notification service
// This test uses the fully refactored notification manager
const notificationManager = require('../../../dist/services/notification/notification-manager').default;

async function testNotificationService() {
  try {
    console.log('Testing Notification Service with Refactored Modules...');
    
    // Test invitation email
    console.log('\nTesting invitation email:');
    await notificationManager.sendInviteEmail(
      'test@example.com',
      'test-token-123',
      'Test Organization',
      'Test Inviter'
    );
    
    // Test password reset email
    console.log('\nTesting password reset email:');
    await notificationManager.sendPasswordResetEmail(
      'test@example.com',
      'reset-token-456'
    );
    
    // Test general notification email
    console.log('\nTesting general notification email:');
    await notificationManager.sendNotificationEmail(
      'test@example.com',
      'Test Notification',
      'This is a test notification message.'
    );
    
    // Test connection request email
    console.log('\nTesting connection request email:');
    await notificationManager.sendConnectionRequest(
      'test@example.com',
      'Requesting Organization'
    );
    
    // Test connection approval email
    console.log('\nTesting connection approval email:');
    await notificationManager.sendConnectionApproved(
      'test@example.com',
      'Approved Organization'
    );
    
    // Test connection rejection email
    console.log('\nTesting connection rejection email:');
    await notificationManager.sendConnectionRejected(
      'test@example.com',
      'Rejected Organization'
    );
    
    // Test connection termination email
    console.log('\nTesting connection termination email:');
    await notificationManager.sendConnectionTerminated(
      'test@example.com',
      'Partner Organization',
      'Terminating Organization'
    );
    
    console.log('\nAll tests completed successfully!');
  } catch (error) {
    console.error('Error testing notification service:', error);
  }
}

// Run the tests
testNotificationService();