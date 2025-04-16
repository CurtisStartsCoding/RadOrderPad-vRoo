"use strict";
/**
 * Email test mode utilities
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleTestMode = exports.isTestModeEnabled = void 0;
// Import functions
const is_test_mode_enabled_1 = require("./is-test-mode-enabled");
Object.defineProperty(exports, "isTestModeEnabled", { enumerable: true, get: function () { return is_test_mode_enabled_1.isTestModeEnabled; } });
const handle_test_mode_1 = require("./handle-test-mode");
Object.defineProperty(exports, "handleTestMode", { enumerable: true, get: function () { return handle_test_mode_1.handleTestMode; } });
// Default export for backward compatibility
exports.default = {
    isTestModeEnabled: is_test_mode_enabled_1.isTestModeEnabled,
    handleTestMode: handle_test_mode_1.handleTestMode
};
//# sourceMappingURL=index.js.map