import emailSender from '../email-sender';
import { generalNotificationTemplate } from '../templates';
import { NotificationEmailData } from '../types';

/**
 * Service for handling general notifications
 */
export class GeneralNotificationService {
  /**
   * Send a notification email
   * @param email Email address to send the notification to
   * @param subject Email subject
   * @param message Email message
   */
  async sendNotificationEmail(
    email: string,
    subject: string,
    message: string
  ): Promise<void> {
    // Log the attempt
    console.log(`[NOTIFICATION] Sending notification email to ${email}`);
    
    // Prepare the template data
    const templateData: NotificationEmailData = {
      email,
      subject,
      message
    };
    
    // Generate the email content
    const emailContent = generalNotificationTemplate.generateContent(templateData);
    
    // Send the email
    await emailSender.sendEmail(
      email,
      emailContent.subject,
      emailContent.textBody,
      emailContent.htmlBody
    );
  }
}

// Create and export a singleton instance
export default new GeneralNotificationService();