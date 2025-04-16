import accountManager from './account';
import generalManager from './general';
import connectionManager from './connection';

/**
 * Manager for handling different types of notifications
 * This class serves as a facade for the underlying notification managers
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
    return accountManager.sendInviteEmail(
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
    return accountManager.sendPasswordResetEmail(email, token);
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
    return generalManager.sendNotificationEmail(email, subject, message);
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
    return connectionManager.sendConnectionRequest(email, requestingOrgName);
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
    return connectionManager.sendConnectionApproved(email, approvedOrgName);
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
    return connectionManager.sendConnectionRejected(email, rejectedOrgName);
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
    return connectionManager.sendConnectionTerminated(
      email,
      partnerOrgName,
      terminatingOrgName
    );
  }
}

// Export individual managers for direct use
export { accountManager, generalManager, connectionManager };

// Create and export a singleton instance
export default new NotificationManager();