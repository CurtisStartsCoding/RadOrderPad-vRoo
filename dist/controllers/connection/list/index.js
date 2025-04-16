"use strict";
/**
 * Connection list controllers
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.listIncomingRequests = exports.listConnections = void 0;
// Import functions
const list_connections_1 = require("./list-connections");
Object.defineProperty(exports, "listConnections", { enumerable: true, get: function () { return list_connections_1.listConnections; } });
const list_incoming_requests_1 = require("./list-incoming-requests");
Object.defineProperty(exports, "listIncomingRequests", { enumerable: true, get: function () { return list_incoming_requests_1.listIncomingRequests; } });
// Default export for backward compatibility
exports.default = {
    listConnections: list_connections_1.listConnections,
    listIncomingRequests: list_incoming_requests_1.listIncomingRequests
};
//# sourceMappingURL=index.js.map