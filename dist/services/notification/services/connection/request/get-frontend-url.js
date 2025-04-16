"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFrontendUrl = getFrontendUrl;
const config_1 = __importDefault(require("../../../../../config/config"));
/**
 * Get the frontend URL from environment variables
 */
function getFrontendUrl() {
    return config_1.default.frontendUrl;
}
//# sourceMappingURL=get-frontend-url.js.map