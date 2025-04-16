"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionNotificationManager = void 0;
const services_1 = require("../services");
/**
 * Connection-related notification manager functions
 */
class ConnectionNotificationManager {
    /**
     * Send a connection request notification to an organization
     * @param email Email address of the target organization admin
     * @param requestingOrgName Name of the organization requesting the connection
     */
    async sendConnectionRequest(email, requestingOrgName) {
        return services_1.connectionNotifications.sendConnectionRequest(email, requestingOrgName);
    }
    /**
     * Send a connection approval notification
     * @param email Email address of the requesting organization admin
     * @param approvedOrgName Name of the organization that requested the connection
     */
    async sendConnectionApproved(email, approvedOrgName) {
        return services_1.connectionNotifications.sendConnectionApproved(email, approvedOrgName);
    }
    /**
     * Send a connection rejection notification
     * @param email Email address of the requesting organization admin
     * @param rejectedOrgName Name of the organization that requested the connection
     */
    async sendConnectionRejected(email, rejectedOrgName) {
        return services_1.connectionNotifications.sendConnectionRejected(email, rejectedOrgName);
    }
    /**
     * Send a connection termination notification
     * @param email Email address of the partner organization admin
     * @param partnerOrgName Name of the partner organization
     * @param terminatingOrgName Name of the organization terminating the connection
     */
    async sendConnectionTerminated(email, partnerOrgName, terminatingOrgName) {
        return services_1.connectionNotifications.sendConnectionTerminated(email, partnerOrgName, terminatingOrgName);
    }
}
exports.ConnectionNotificationManager = ConnectionNotificationManager;
// Create and export a singleton instance
exports.default = new ConnectionNotificationManager();
//# sourceMappingURL=connection.js.map