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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.userControllers = exports.organizationControllers = void 0;
const organizationControllers = __importStar(require("./organization"));
exports.organizationControllers = organizationControllers;
const userControllers = __importStar(require("./user"));
exports.userControllers = userControllers;
/**
 * Controller for handling location-related requests
 */
class LocationController {
    /**
     * List locations for the authenticated user's organization
     * @param req Express request object
     * @param res Express response object
     */
    async listLocations(req, res) {
        return organizationControllers.listLocations(req, res);
    }
    /**
     * Create a new location for the authenticated user's organization
     * @param req Express request object
     * @param res Express response object
     */
    async createLocation(req, res) {
        return organizationControllers.createLocation(req, res);
    }
    /**
     * Get details of a specific location
     * @param req Express request object
     * @param res Express response object
     */
    async getLocation(req, res) {
        return organizationControllers.getLocation(req, res);
    }
    /**
     * Update a location
     * @param req Express request object
     * @param res Express response object
     */
    async updateLocation(req, res) {
        return organizationControllers.updateLocation(req, res);
    }
    /**
     * Deactivate a location (soft delete)
     * @param req Express request object
     * @param res Express response object
     */
    async deactivateLocation(req, res) {
        return organizationControllers.deactivateLocation(req, res);
    }
    /**
     * List locations assigned to a user
     * @param req Express request object
     * @param res Express response object
     */
    async listUserLocations(req, res) {
        return userControllers.listUserLocations(req, res);
    }
    /**
     * Assign a user to a location
     * @param req Express request object
     * @param res Express response object
     */
    async assignUserToLocation(req, res) {
        return userControllers.assignUserToLocation(req, res);
    }
    /**
     * Unassign a user from a location
     * @param req Express request object
     * @param res Express response object
     */
    async unassignUserFromLocation(req, res) {
        return userControllers.unassignUserFromLocation(req, res);
    }
}
exports.default = new LocationController();
//# sourceMappingURL=index.js.map