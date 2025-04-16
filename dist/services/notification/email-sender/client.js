"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sesClient = void 0;
exports.createSesClient = createSesClient;
const client_ses_1 = require("@aws-sdk/client-ses");
const config_1 = __importDefault(require("../../../config/config"));
/**
 * Create and configure an AWS SES client
 */
function createSesClient() {
    return new client_ses_1.SESClient({
        region: config_1.default.aws.region,
        credentials: {
            accessKeyId: config_1.default.aws.accessKeyId || '',
            secretAccessKey: config_1.default.aws.secretAccessKey || ''
        }
    });
}
// Create and export a singleton instance
exports.sesClient = createSesClient();
//# sourceMappingURL=client.js.map