"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listLocations = void 0;
const location_1 = __importDefault(require("../../../services/location"));
const types_1 = require("../types");
/**
 * List locations for the authenticated user's organization
 * @param req Express request object
 * @param res Express response object
 */
const listLocations = async (req, res) => {
    try {
        // Check if user is authenticated
        if (!(0, types_1.checkAuthentication)(req, res)) {
            return;
        }
        const orgId = req.user.orgId;
        const locations = await location_1.default.listLocations(orgId);
        res.status(200).json({ locations });
    }
    catch (error) {
        (0, types_1.handleControllerError)(res, error, 'Failed to list locations');
    }
};
exports.listLocations = listLocations;
exports.default = exports.listLocations;
//# sourceMappingURL=list-locations.js.map