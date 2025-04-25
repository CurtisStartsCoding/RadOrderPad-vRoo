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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const user_1 = require("./user");
const organization_1 = require("./organization");
const token_1 = require("./token");
const trial_1 = require("./trial");
/**
 * Service for handling authentication-related operations
 */
class AuthService {
    /**
     * Register a new organization and admin user
     */
    async registerOrganization(orgData, userData) {
        return (0, organization_1.registerOrganization)(orgData, userData);
    }
    /**
     * Login a user
     */
    async login(loginData) {
        return (0, user_1.login)(loginData);
    }
    /**
     * Register a trial user
     */
    async registerTrialUser(email, password, firstName, lastName, specialty) {
        return (0, trial_1.registerTrialUser)(email, password, firstName, lastName, specialty);
    }
    /**
     * Login a trial user
     */
    async loginTrialUser(email, password) {
        return (0, trial_1.loginTrialUser)(email, password);
    }
    /**
     * Generate a JWT token for a user
     */
    generateToken(user) {
        return (0, token_1.generateToken)(user);
    }
}
exports.AuthService = AuthService;
// Export types
__exportStar(require("./types"), exports);
// Export user functionality
__exportStar(require("./user"), exports);
// Export organization functionality
__exportStar(require("./organization"), exports);
// Export token functionality
__exportStar(require("./token"), exports);
// Export trial functionality
__exportStar(require("./trial"), exports);
// Export default instance
exports.default = new AuthService();
//# sourceMappingURL=index.js.map