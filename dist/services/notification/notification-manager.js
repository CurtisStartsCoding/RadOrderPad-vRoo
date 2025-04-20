import { accountNotifications, generalNotifications, connectionNotifications } from './services/index.js';
/**
 * NotificationManager - Central manager for all notification types
 *
 * This class serves as a facade for the underlying notification services,
 * providing a simplified and unified API for sending various types of notifications.
 * It abstracts away the implementation details of different notification services
 * and presents a clean interface to the rest of the application.
 *
 * The manager handles three main categories of notifications:
 * 1. Account notifications (invitations, password resets)
 * 2. General notifications (system announcements, alerts)
 * 3. Connection notifications (requests, approvals, rejections, terminations)
 *
 * All methods are asynchronous and return Promises that resolve when the
 * notification has been successfully sent or reject with an error.
 */
export class NotificationManager {
    /**
     * Send an invitation email to a user
     *
     * This method sends an email invitation to join an organization on RadOrderPad.
     * The email includes a unique token that allows the recipient to create an account
     * and automatically join the specified organization.
     *
     * The email contains:
     * - Information about who sent the invitation
     * - The organization they're being invited to
     * - A link with the token to complete registration
     *
     * @param email Email address to send the invitation to
     * @param token Unique invitation token for secure registration
     * @param organizationName Name of the organization the user is being invited to
     * @param inviterName Name of the user who sent the invitation
     * @returns Promise that resolves when the email is sent successfully
     * @throws Error if the email cannot be sent
     */
    async sendInviteEmail(email, token, organizationName, inviterName) {
        return accountNotifications.sendInviteEmail(email, token, organizationName, inviterName);
    }
    /**
     * Send a password reset email to a user
     * @param email Email address to send the reset link to
     * @param token Reset token
     */
    async sendPasswordResetEmail(email, token) {
        return accountNotifications.sendPasswordResetEmail(email, token);
    }
    /**
     * Send a notification email
     * @param email Email address to send the notification to
     * @param subject Email subject
     * @param message Email message
     */
    async sendNotificationEmail(email, subject, message) {
        return generalNotifications.sendNotificationEmail(email, subject, message);
    }
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
export default new NotificationManager();
//# sourceMappingURL=notification-manager.js.map