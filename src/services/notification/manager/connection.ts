import { connectionNotifications } from '../services';

/**
 * Connection-related notification manager functions
 */
export class ConnectionNotificationManager {
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
export default new ConnectionNotificationManager();