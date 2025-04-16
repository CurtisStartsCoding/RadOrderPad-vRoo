"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
/**
 * Re-export all authentication controller components
 */
__exportStar(require("./error-handler"), exports);
__exportStar(require("./register.controller"), exports);
__exportStar(require("./login.controller"), exports);
// Import controllers
const register_controller_1 = __importDefault(require("./register.controller"));
const login_controller_1 = __importDefault(require("./login.controller"));
/**
 * Combined AuthController class
 */
class AuthController {
    constructor() {
        /**
         * Register a new organization and admin user
         */
        this.register = register_controller_1.default.register.bind(register_controller_1.default);
        /**
         * Login a user
         */
        this.login = login_controller_1.default.login.bind(login_controller_1.default);
    }
}
exports.AuthController = AuthController;
// Export a singleton instance
exports.default = new AuthController();
//# sourceMappingURL=index.js.map