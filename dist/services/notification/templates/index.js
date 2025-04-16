"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectionTerminationTemplate = exports.connectionRejectionTemplate = exports.connectionApprovalTemplate = exports.connectionRequestTemplate = exports.generalNotificationTemplate = exports.passwordResetTemplate = exports.inviteTemplate = void 0;
const invite_template_1 = __importDefault(require("./invite-template"));
exports.inviteTemplate = invite_template_1.default;
const password_reset_template_1 = __importDefault(require("./password-reset-template"));
exports.passwordResetTemplate = password_reset_template_1.default;
const general_notification_template_1 = __importDefault(require("./general-notification-template"));
exports.generalNotificationTemplate = general_notification_template_1.default;
const connection_1 = require("./connection");
Object.defineProperty(exports, "connectionRequestTemplate", { enumerable: true, get: function () { return connection_1.requestTemplate; } });
Object.defineProperty(exports, "connectionApprovalTemplate", { enumerable: true, get: function () { return connection_1.approvalTemplate; } });
Object.defineProperty(exports, "connectionRejectionTemplate", { enumerable: true, get: function () { return connection_1.rejectionTemplate; } });
Object.defineProperty(exports, "connectionTerminationTemplate", { enumerable: true, get: function () { return connection_1.terminationTemplate; } });
//# sourceMappingURL=index.js.map