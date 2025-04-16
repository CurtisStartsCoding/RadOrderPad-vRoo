import {
  accountNotifications,
  generalNotifications,
  connectionNotifications
} from './services';

/**
 * Manager for handling different types of notifications
 * This class serves as a facade for the underlying notification services
 */
export class NotificationManager {
  /**
   * Send an invitation email to a user
   * @param email Email address to send the invitation to
   * @param token Invitation token
   * @param organizationName Name of the organization
   * @param inviterName Name of the user who sent the invitation
   */
  async sendInviteEmail(
    email: string,
    token: string,
    organizationName: string,
    inviterName: string
  ): Promise<void> {
    return accountNotifications.sendInviteEmail(
      email,
      token,
      organizationName,
      inviterName
    );
  }
  
  /**
   * Send a password reset email to a user
   * @param email Email address to send the reset link to
   * @param token Reset token
   */
  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    return accountNotifications.sendPasswordResetEmail(email, token);
  }
  
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
  
  /**
   * Send a connection request notification to an organization
   * @param email Email address of the target organization admin
   * @param requestingOrgName Name of the organization requesting the connection
   */
  async sendConnectionRequest(
    email: string,
    requestingOrgName: string
  ): Promise<void> {
    return connectionNotifications.sendConnectionRequest(email, requestingOrgName);
  }
  
  /**
   * Send a connection approval notification
   * @param email Email address of the requesting organization admin
   * @param approvedOrgName Name of the organization that requested the connection
   */
  async sendConnectionApproved(
    email: string,
    approvedOrgName: string
  ): Promise<void> {
    return connectionNotifications.sendConnectionApproved(email, approvedOrgName);
  }
  
  /**
   * Send a connection rejection notification
   * @param email Email address of the requesting organization admin
   * @param rejectedOrgName Name of the organization that requested the connection
   */
  async sendConnectionRejected(
    email: string,
    rejectedOrgName: string
  ): Promise<void> {
    return connectionNotifications.sendConnectionRejected(email, rejectedOrgName);
  }
  
  /**
   * Send a connection termination notification
   * @param email Email address of the partner organization admin
   * @param partnerOrgName Name of the partner organization
   * @param terminatingOrgName Name of the organization terminating the connection
   */
  async sendConnectionTerminated(
    email: string,
    partnerOrgName: string,
    terminatingOrgName: string
  ): Promise<void> {
    return connectionNotifications.sendConnectionTerminated(
      email,
      partnerOrgName,
      terminatingOrgName
    );
  }
}

// Create and export a singleton instance
export default new NotificationManager();