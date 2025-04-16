"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTestModeEnabled = isTestModeEnabled;
const config_1 = __importDefault(require("../../../../config/config"));
/**
 * Check if email test mode is enabled
 */
function isTestModeEnabled() {
    return config_1.default.aws.ses.testMode;
}
//# sourceMappingURL=is-test-mode-enabled.js.map