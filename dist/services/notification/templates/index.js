"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectionTerminationTemplate = exports.connectionRejectionTemplate = exports.connectionApprovalTemplate = exports.connectionRequestTemplate = exports.generalNotificationTemplate = exports.passwordResetTemplate = exports.inviteTemplate = void 0;
const invite_template_js_1 = __importDefault(require("./invite-template.js"));
exports.inviteTemplate = invite_template_js_1.default;
const password_reset_template_js_1 = __importDefault(require("./password-reset-template.js"));
exports.passwordResetTemplate = password_reset_template_js_1.default;
const general_notification_template_js_1 = __importDefault(require("./general-notification-template.js"));
exports.generalNotificationTemplate = general_notification_template_js_1.default;
const index_js_1 = require("./connection/index.js");
Object.defineProperty(exports, "connectionRequestTemplate", { enumerable: true, get: function () { return index_js_1.requestTemplate; } });
Object.defineProperty(exports, "connectionApprovalTemplate", { enumerable: true, get: function () { return index_js_1.approvalTemplate; } });
Object.defineProperty(exports, "connectionRejectionTemplate", { enumerable: true, get: function () { return index_js_1.rejectionTemplate; } });
Object.defineProperty(exports, "connectionTerminationTemplate", { enumerable: true, get: function () { return index_js_1.terminationTemplate; } });
//# sourceMappingURL=index.js.map