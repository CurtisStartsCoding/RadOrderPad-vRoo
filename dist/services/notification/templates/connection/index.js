"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.terminationTemplate = exports.rejectionTemplate = exports.approvalTemplate = exports.requestTemplate = void 0;
/**
 * Export all connection-related email templates
 */
const request_template_1 = __importDefault(require("./request-template"));
exports.requestTemplate = request_template_1.default;
const approval_template_1 = __importDefault(require("./approval-template"));
exports.approvalTemplate = approval_template_1.default;
const rejection_template_1 = __importDefault(require("./rejection-template"));
exports.rejectionTemplate = rejection_template_1.default;
const termination_template_1 = __importDefault(require("./termination-template"));
exports.terminationTemplate = termination_template_1.default;
//# sourceMappingURL=index.js.map