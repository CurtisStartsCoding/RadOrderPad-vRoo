"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectionManager = exports.generalManager = exports.accountManager = exports.NotificationManager = void 0;
const account_1 = __importDefault(require("./account"));
exports.accountManager = account_1.default;
const general_1 = __importDefault(require("./general"));
exports.generalManager = general_1.default;
const connection_1 = __importDefault(require("./connection"));
exports.connectionManager = connection_1.default;
/**
 * Manager for handling different types of notifications
 * This class serves as a facade for the underlying notification managers
 */
class NotificationManager {
    /**
     * Send an invitation email to a user
     * @param email Email address to send the invitation to
     * @param token Invitation token
     * @param organizationName Name of the organization
     * @param inviterName Name of the user who sent the invitation
     */
    async sendInviteEmail(email, token, organizationName, inviterName) {
        return account_1.default.sendInviteEmail(email, token, organizationName, inviterName);
    }
    /**
     * Send a password reset email to a user
     * @param email Email address to send the reset link to
     * @param token Reset token
     */
    async sendPasswordResetEmail(email, token) {
        return account_1.default.sendPasswordResetEmail(email, token);
    }
    /**
     * Send a notification email
     * @param email Email address to send the notification to
     * @param subject Email subject
     * @param message Email message
     */
    async sendNotificationEmail(email, subject, message) {
        return general_1.default.sendNotificationEmail(email, subject, message);
    }
    /**
     * Send a connection request notification to an organization
     * @param email Email address of the target organization admin
     * @param requestingOrgName Name of the organization requesting the connection
     */
    async sendConnectionRequest(email, requestingOrgName) {
        return connection_1.default.sendConnectionRequest(email, requestingOrgName);
    }
    /**
     * Send a connection approval notification
     * @param email Email address of the requesting organization admin
     * @param approvedOrgName Name of the organization that requested the connection
     */
    async sendConnectionApproved(email, approvedOrgName) {
        return connection_1.default.sendConnectionApproved(email, approvedOrgName);
    }
    /**
     * Send a connection rejection notification
     * @param email Email address of the requesting organization admin
     * @param rejectedOrgName Name of the organization that requested the connection
     */
    async sendConnectionRejected(email, rejectedOrgName) {
        return connection_1.default.sendConnectionRejected(email, rejectedOrgName);
    }
    /**
     * Send a connection termination notification
     * @param email Email address of the partner organization admin
     * @param partnerOrgName Name of the partner organization
     * @param terminatingOrgName Name of the organization terminating the connection
     */
    async sendConnectionTerminated(email, partnerOrgName, terminatingOrgName) {
        return connection_1.default.sendConnectionTerminated(email, partnerOrgName, terminatingOrgName);
    }
}
exports.NotificationManager = NotificationManager;
// Create and export a singleton instance
exports.default = new NotificationManager();
//# sourceMappingURL=index.js.map