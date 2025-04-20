"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listUserLocations = void 0;
const location_1 = __importDefault(require("../../../services/location"));
const types_1 = require("../types");
/**
 * List locations assigned to a user
 * @param req Express request object
 * @param res Express response object
 */
const listUserLocations = async (req, res) => {
    try {
        // Check if user is authenticated
        if (!(0, types_1.checkAuthentication)(req, res)) {
            return;
        }
        // Validate user ID
        if (!(0, types_1.validateUserId)(req, res)) {
            return;
        }
        const orgId = req.user.orgId;
        const userId = parseInt(req.params.userId);
        try {
            const locations = await location_1.default.listUserLocations(userId, orgId);
            res.status(200).json({ locations });
        }
        catch (error) {
            // Handle not found or not authorized
            if (error.message.includes('not found or not authorized')) {
                res.status(404).json({ message: error.message });
            }
            else {
                throw error;
            }
        }
    }
    catch (error) {
        (0, types_1.handleControllerError)(res, error, 'Failed to list user locations');
    }
};
exports.listUserLocations = listUserLocations;
exports.default = exports.listUserLocations;
//# sourceMappingURL=list-user-locations.js.map