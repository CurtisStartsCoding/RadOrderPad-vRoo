import { listConnections, listIncomingRequests } from './list';
import { requestConnection } from './request.controller';
import { approveConnection } from './approve.controller';
import { rejectConnection } from './reject.controller';
import { terminateConnection } from './terminate.controller';
/**
 * Controller for handling connection-related requests
 */
export class ConnectionController {
    /**
     * List connections for the authenticated user's organization
     * @param req Express request object
     * @param res Express response object
     */
    async listConnections(req, res) {
        return listConnections(req, res);
    }
    /**
     * List pending incoming connection requests
     * @param req Express request object
     * @param res Express response object
     */
    async listIncomingRequests(req, res) {
        return listIncomingRequests(req, res);
    }
    /**
     * Request a connection to another organization
     * @param req Express request object
     * @param res Express response object
     */
    async requestConnection(req, res) {
        return requestConnection(req, res);
    }
    /**
     * Approve a connection request
     * @param req Express request object
     * @param res Express response object
     */
    async approveConnection(req, res) {
        return approveConnection(req, res);
    }
    /**
     * Reject a connection request
     * @param req Express request object
     * @param res Express response object
     */
    async rejectConnection(req, res) {
        return rejectConnection(req, res);
    }
    /**
     * Terminate an active connection
     * @param req Express request object
     * @param res Express response object
     */
    async terminateConnection(req, res) {
        return terminateConnection(req, res);
    }
}
// Export a singleton instance
export default new ConnectionController();
// Export individual controllers for direct use if needed
export { listConnections, listIncomingRequests, requestConnection, approveConnection, rejectConnection, terminateConnection };
//# sourceMappingURL=index.js.map