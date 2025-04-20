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
    async sendConnectionRequest(email, requestingOrgName) {
        return connectionNotifications.sendConnectionRequest(email, requestingOrgName);
    }
    /**
     * Send a connection approval notification
     * @param email Email address of the requesting organization admin
     * @param approvedOrgName Name of the organization that requested the connection
     */
    async sendConnectionApproved(email, approvedOrgName) {
        return connectionNotifications.sendConnectionApproved(email, approvedOrgName);
    }
    /**
     * Send a connection rejection notification
     * @param email Email address of the requesting organization admin
     * @param rejectedOrgName Name of the organization that requested the connection
     */
    async sendConnectionRejected(email, rejectedOrgName) {
        return connectionNotifications.sendConnectionRejected(email, rejectedOrgName);
    }
    /**
     * Send a connection termination notification
     * @param email Email address of the partner organization admin
     * @param partnerOrgName Name of the partner organization
     * @param terminatingOrgName Name of the organization terminating the connection
     */
    async sendConnectionTerminated(email, partnerOrgName, terminatingOrgName) {
        return connectionNotifications.sendConnectionTerminated(email, partnerOrgName, terminatingOrgName);
    }
}
// Create and export a singleton instance
export default new ConnectionNotificationManager();
//# sourceMappingURL=connection.js.map