import { accountNotifications, connectionNotifications, generalNotifications, userNotifications } from './services';

/**
 * Facade for notification services
 */
class NotificationManager {
  /**
   * Send a verification email to a newly registered user
   * @param email Email address of the user
   * @param token Verification token
   * @param data Additional data for the email template
   */
  async sendVerificationEmail(
    email: string,
    token: string,
    data: { firstName: string; organizationName: string }
  ): Promise<void> {
    return accountNotifications.sendVerificationEmail(email, token, data);
  }

  /**
   * Send an invitation email to a new user
   * @param email Email address of the invited user
   * @param token Invitation token
   * @param organizationName Name of the organization
   * @param inviterName Name of the person who sent the invitation
   * @param role Role the user is being invited to
   */
  async sendInviteEmail(
    email: string,
    token: string,
    organizationName: string,
    inviterName: string,
    role: string
  ): Promise<void> {
    return userNotifications.sendInviteEmail(email, token, organizationName, inviterName, role);
  }

  /**
   * Send a connection request notification
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
    return connectionNotifications.sendConnectionTerminated(email, partnerOrgName, terminatingOrgName);
  }

  /**
   * Send a general notification email
   * @param email Email address of the recipient
   * @param subject Email subject
   * @param message Email message
   */
  async sendNotification(
    email: string,
    subject: string,
    message: string
  ): Promise<void> {
    return generalNotifications.sendNotificationEmail(email, subject, message);
  }
}

// Export a singleton instance
export default new NotificationManager();