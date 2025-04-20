import { listConnectionsService, requestConnectionService, approveConnectionService, rejectConnectionService, terminateConnectionService } from './services';
/**
 * Facade for connection services
 */
class ConnectionManager {
    /**
     * List connections for an organization
     * @param orgId Organization ID
     * @returns Promise with connections list
     */
    async listConnections(orgId) {
        return listConnectionsService.listConnections(orgId);
    }
    /**
     * List pending incoming connection requests
     * @param orgId Organization ID
     * @returns Promise with pending requests list
     */
    async listIncomingRequests(orgId) {
        return listConnectionsService.listIncomingRequests(orgId);
    }
    /**
     * Request a connection to another organization
     * @param params Request connection parameters
     * @returns Promise with result
     */
    async requestConnection(params) {
        return requestConnectionService.requestConnection(params);
    }
    /**
     * Approve a connection request
     * @param params Approve connection parameters
     * @returns Promise with result
     */
    async approveConnection(params) {
        return approveConnectionService.approveConnection(params);
    }
    /**
     * Reject a connection request
     * @param params Reject connection parameters
     * @returns Promise with result
     */
    async rejectConnection(params) {
        return rejectConnectionService.rejectConnection(params);
    }
    /**
     * Terminate an active connection
     * @param params Terminate connection parameters
     * @returns Promise with result
     */
    async terminateConnection(params) {
        return terminateConnectionService.terminateConnection(params);
    }
}
export default new ConnectionManager();
//# sourceMappingURL=connection-manager.js.map