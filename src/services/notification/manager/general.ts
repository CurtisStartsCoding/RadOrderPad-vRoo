import { generalNotifications } from '../services';

/**
 * General notification manager functions
 */
export class GeneralNotificationManager {
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
    return generalNotifications.sendNotificationEmail(email, subject, message);
  }
}

// Create and export a singleton instance
export default new GeneralNotificationManager();