"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.terminateConnection = exports.rejectConnection = exports.approveConnection = exports.requestConnection = exports.listIncomingRequests = exports.listConnections = exports.ConnectionController = void 0;
const list_1 = require("./list");
Object.defineProperty(exports, "listConnections", { enumerable: true, get: function () { return list_1.listConnections; } });
Object.defineProperty(exports, "listIncomingRequests", { enumerable: true, get: function () { return list_1.listIncomingRequests; } });
const request_controller_1 = require("./request.controller");
Object.defineProperty(exports, "requestConnection", { enumerable: true, get: function () { return request_controller_1.requestConnection; } });
const approve_controller_1 = require("./approve.controller");
Object.defineProperty(exports, "approveConnection", { enumerable: true, get: function () { return approve_controller_1.approveConnection; } });
const reject_controller_1 = require("./reject.controller");
Object.defineProperty(exports, "rejectConnection", { enumerable: true, get: function () { return reject_controller_1.rejectConnection; } });
const terminate_controller_1 = require("./terminate.controller");
Object.defineProperty(exports, "terminateConnection", { enumerable: true, get: function () { return terminate_controller_1.terminateConnection; } });
/**
 * Controller for handling connection-related requests
 */
class ConnectionController {
    /**
     * List connections for the authenticated user's organization
     * @param req Express request object
     * @param res Express response object
     */
    async listConnections(req, res) {
        return (0, list_1.listConnections)(req, res);
    }
    /**
     * List pending incoming connection requests
     * @param req Express request object
     * @param res Express response object
     */
    async listIncomingRequests(req, res) {
        return (0, list_1.listIncomingRequests)(req, res);
    }
    /**
     * Request a connection to another organization
     * @param req Express request object
     * @param res Express response object
     */
    async requestConnection(req, res) {
        return (0, request_controller_1.requestConnection)(req, res);
    }
    /**
     * Approve a connection request
     * @param req Express request object
     * @param res Express response object
     */
    async approveConnection(req, res) {
        return (0, approve_controller_1.approveConnection)(req, res);
    }
    /**
     * Reject a connection request
     * @param req Express request object
     * @param res Express response object
     */
    async rejectConnection(req, res) {
        return (0, reject_controller_1.rejectConnection)(req, res);
    }
    /**
     * Terminate an active connection
     * @param req Express request object
     * @param res Express response object
     */
    async terminateConnection(req, res) {
        return (0, terminate_controller_1.terminateConnection)(req, res);
    }
}
exports.ConnectionController = ConnectionController;
// Export a singleton instance
exports.default = new ConnectionController();
//# sourceMappingURL=index.js.map