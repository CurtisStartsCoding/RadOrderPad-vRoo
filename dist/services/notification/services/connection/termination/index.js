"use strict";
/**
 * Connection termination notification utilities
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendConnectionTerminated = exports.prepareConnectionTerminationData = void 0;
// Import functions
const prepare_connection_termination_data_1 = require("./prepare-connection-termination-data");
Object.defineProperty(exports, "prepareConnectionTerminationData", { enumerable: true, get: function () { return prepare_connection_termination_data_1.prepareConnectionTerminationData; } });
const send_connection_terminated_1 = require("./send-connection-terminated");
Object.defineProperty(exports, "sendConnectionTerminated", { enumerable: true, get: function () { return send_connection_terminated_1.sendConnectionTerminated; } });
// Default export for backward compatibility
exports.default = {
    prepareConnectionTerminationData: prepare_connection_termination_data_1.prepareConnectionTerminationData,
    sendConnectionTerminated: send_connection_terminated_1.sendConnectionTerminated
};
//# sourceMappingURL=index.js.map