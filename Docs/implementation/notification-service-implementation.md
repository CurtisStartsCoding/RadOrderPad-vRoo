# Notification Service Implementation

**Date:** 2025-04-13
**Author:** Roo
**Status:** Complete

## Overview

This document details the implementation of the Notification Service, which is responsible for sending transactional emails to users via AWS Simple Email Service (SES). The implementation follows the requirements specified in the `notification_service.md` documentation.

## Components Implemented

### 1. AWS SES Integration

- Installed the AWS SDK v3 SES Client: `@aws-sdk/client-ses`
- Configured the SES client with AWS credentials and region from the environment variables
- Implemented email sending functionality using the `SendEmailCommand`

### 2. Configuration Updates

- Updated `src/config/config.ts` to include SES configuration:
  ```typescript
  aws: {
    // ... existing config
    ses: {
      fromEmail: process.env.SES_FROM_EMAIL || 'no-reply@radorderpad.com'
    }
  }
  ```
- Added `SES_FROM_EMAIL` to the `.env` file

### 3. Email Templates

Implemented HTML and plain text templates for the following email types:

1. **User Invitation** (`sendInviteEmail`)
   - Sends an invitation link to join an organization
   - Includes organization name and inviter name

2. **Password Reset** (`sendPasswordResetEmail`)
   - Sends a password reset link
   - Includes security information

3. **General Notification** (`sendNotificationEmail`)
   - Generic notification with customizable subject and message

4. **Connection Request** (`sendConnectionRequest`)
   - Notifies organization admins of a new connection request
   - Includes requesting organization name and link to review

5. **Connection Approval** (`sendConnectionApproved`)
   - Notifies the requesting organization that their connection request was approved
   - Includes link to view connections

6. **Connection Rejection** (`sendConnectionRejected`)
   - Notifies the requesting organization that their connection request was rejected
   - Includes link to view connections

7. **Connection Termination** (`sendConnectionTerminated`)
   - Notifies an organization that a partner has terminated their connection
   - Includes terminating organization name and link to view connections

## Implementation Details

### Email Sending Logic

The core of the implementation is the private `sendEmail` method, which:

1. Constructs the email parameters (sender, recipient, subject, body)
2. Creates a `SendEmailCommand` with these parameters
3. Sends the command using the SES client
4. Logs the result (success or failure)

```typescript
private async sendEmail(
  to: string,
  subject: string,
  textBody: string,
  htmlBody?: string
): Promise<void> {
  try {
    // Construct the email parameters
    const params: SendEmailCommandInput = {
      Source: this.fromEmail,
      Destination: {
        ToAddresses: [to]
      },
      Message: {
        Subject: {
          Data: subject,
          Charset: 'UTF-8'
        },
        Body: {
          Text: {
            Data: textBody,
            Charset: 'UTF-8'
          },
          ...(htmlBody && {
            Html: {
              Data: htmlBody,
              Charset: 'UTF-8'
            }
          })
        }
      }
    };

    // Send the email
    const command = new SendEmailCommand(params);
    await this.sesClient.send(command);
    
    // Log success
    console.log(`[NOTIFICATION] Email sent successfully to ${to}`);
  } catch (error) {
    // Log error
    console.error(`[NOTIFICATION] Failed to send email to ${to}:`, error);
    throw error;
  }
}
```

### Email Templates

All email templates follow a consistent structure:

1. **Plain Text Version**: Simple, readable text with clear instructions and links
2. **HTML Version**: Styled HTML with:
   - Consistent header with RadOrderPad branding
   - Content section with the message and action buttons
   - Footer with additional information
   - Responsive design for mobile devices

Example HTML template structure:

```html
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #0066cc; color: white; padding: 10px 20px; }
    .content { padding: 20px; }
    .button { display: inline-block; background-color: #0066cc; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; }
    .footer { font-size: 12px; color: #666; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>Email Title</h2>
    </div>
    <div class="content">
      <p>Hello,</p>
      <p>Main message content...</p>
      <p><a href="${actionLink}" class="button">Action Button</a></p>
      <p>Or copy and paste this link into your browser:</p>
      <p>${actionLink}</p>
      <p>Best regards,<br>The RadOrderPad Team</p>
    </div>
    <div class="footer">
      <p>This is an automated message, please do not reply to this email.</p>
    </div>
  </div>
</body>
</html>
```

## Error Handling

The implementation includes comprehensive error handling:

1. **Try-Catch Blocks**: All AWS SES API calls are wrapped in try-catch blocks
2. **Error Logging**: Detailed error messages are logged to the console
3. **Error Propagation**: Errors are thrown to allow calling code to handle them appropriately

## Test Mode Implementation

The NotificationService includes a test mode feature that allows automated tests to run without actually sending emails:

```typescript
private async sendEmail(
  to: string,
  subject: string,
  textBody: string,
  htmlBody?: string
): Promise<void> {
  try {
    // Log the test mode configuration
    console.log(`[NOTIFICATION] Email test mode is: ${config.aws.ses.testMode ? 'ENABLED' : 'DISABLED'}`);
    
    // Check if test mode is enabled
    if (config.aws.ses.testMode) {
      // In test mode, just log the email details and return successfully
      console.log(`[TEST MODE] Email send skipped for recipient: ${to}, subject: ${subject}`);
      console.log(`[TEST MODE] Email body would have been: ${textBody.substring(0, 100)}...`);
      return;
    }
    
    // Regular email sending logic...
  }
}
```

This test mode is controlled by the `EMAIL_TEST_MODE` environment variable, which is set to `true` in the `.env` file for development and testing environments.

When test mode is enabled, the service logs the email details but doesn't actually send the email, allowing tests to run without requiring AWS SES credentials or permissions.

## Refactoring Implementation

The notification service has been refactored into a modular architecture to improve maintainability and extensibility. The refactoring was completed on 2025-04-13.

### Refactoring Approach

The refactoring followed these key principles:

1. **Single Responsibility Principle**: Each module has a clear, focused purpose
2. **Separation of Concerns**: Email sending, templating, and business logic are separated
3. **Modularity**: Smaller, more maintainable files (most under 50 lines)
4. **Type Safety**: Comprehensive TypeScript interfaces for all notification data

### Refactored Directory Structure

```
src/services/
└── notification/
    ├── types.ts                         (91 lines)  - Type definitions
    ├── email-sender.ts                  (85 lines)  - AWS SES integration
    ├── templates/
    │   ├── email-template-base.ts       (76 lines)  - Base template
    │   ├── invite-template.ts           (53 lines)  - Invitation emails
    │   ├── password-reset-template.ts   (51 lines)  - Password reset emails
    │   ├── general-notification-template.ts (38 lines) - General notifications
    │   ├── connection/
    │   │   ├── request-template.ts      (50 lines)  - Connection requests
    │   │   ├── approval-template.ts     (45 lines)  - Connection approvals
    │   │   ├── rejection-template.ts    (45 lines)  - Connection rejections
    │   │   ├── termination-template.ts  (50 lines)  - Connection terminations
    │   │   └── index.ts                 (13 lines)  - Connection template exports
    │   └── index.ts                     (19 lines)  - Template exports
    ├── services/
    │   ├── account-notifications.ts     (65 lines)  - Account-related notifications
    │   ├── general-notifications.ts     (39 lines)  - General notifications
    │   ├── connection-notifications.ts  (135 lines) - Connection-related notifications
    │   └── index.ts                     (11 lines)  - Service exports
    ├── notification-manager.ts          (106 lines) - Facade for services
    ├── index.ts                         (5 lines)   - Public API
    └── test-notification.js             (69 lines)  - Test script
```

### Key Refactoring Components

1. **Email Sender Module** (`email-sender.ts`)
   - Encapsulates AWS SES integration
   - Handles test mode for development environments
   - Provides consistent error handling and logging

2. **Template System**
   - Base template class with common HTML/text formatting
   - Specialized templates for each notification type
   - Connection templates broken down into individual files
   - Consistent styling across all email types

3. **Specialized Services**
   - Account notifications service for user management
   - General notifications service for system messages
   - Connection notifications service for organization relationships

4. **Facade Pattern**
   - Notification manager acts as a simple facade
   - Delegates to specialized services
   - Maintains the same API for backward compatibility

### Integration with Existing Code

The connection service has been updated to use the notification manager directly:

```typescript
// Before refactoring
import notificationService from './notification.service';

// After refactoring
import notificationManager from './notification/notification-manager';
```

All tests continue to pass with the refactored implementation, confirming backward compatibility.

## Future Enhancements

1. **Email Templates Management**: Move templates to a database or file system for easier management
2. **Localization**: Add support for multiple languages
3. **Email Analytics**: Track email opens, clicks, and other metrics
4. **Bounce and Complaint Handling**: Implement handling of bounces and complaints via SNS notifications
5. **Email Queuing**: Add a queue system for high-volume email sending
6. **Template Customization**: Allow organizations to customize email templates with their branding
7. **Additional Notification Channels**: Support for SMS, in-app notifications, and push notifications

## Related Documentation

- [Notification Service Requirements](../../Docs/notification_service.md)
- [AWS SES Documentation](https://docs.aws.amazon.com/ses/latest/dg/Welcome.html)