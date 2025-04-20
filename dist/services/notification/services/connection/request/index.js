"use strict";
/**
 * Connection request notification services
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendConnectionRequest = exports.prepareConnectionRequestData = exports.getFrontendUrl = void 0;
// Import functions
const get_frontend_url_1 = require("./get-frontend-url");
Object.defineProperty(exports, "getFrontendUrl", { enumerable: true, get: function () { return get_frontend_url_1.getFrontendUrl; } });
const prepare_connection_request_data_1 = require("./prepare-connection-request-data");
Object.defineProperty(exports, "prepareConnectionRequestData", { enumerable: true, get: function () { return prepare_connection_request_data_1.prepareConnectionRequestData; } });
const send_connection_request_1 = require("./send-connection-request");
Object.defineProperty(exports, "sendConnectionRequest", { enumerable: true, get: function () { return send_connection_request_1.sendConnectionRequest; } });
// Default export for backward compatibility
exports.default = {
    getFrontendUrl: get_frontend_url_1.getFrontendUrl,
    prepareConnectionRequestData: prepare_connection_request_data_1.prepareConnectionRequestData,
    sendConnectionRequest: send_connection_request_1.sendConnectionRequest
};
//# sourceMappingURL=index.js.map