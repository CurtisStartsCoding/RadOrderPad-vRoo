"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLocation = void 0;
const location_1 = __importDefault(require("../../../services/location"));
const types_1 = require("../types");
/**
 * Get details of a specific location
 * @param req Express request object
 * @param res Express response object
 */
const getLocation = async (req, res) => {
    try {
        // Check if user is authenticated
        if (!(0, types_1.checkAuthentication)(req, res)) {
            return;
        }
        // Validate location ID
        if (!(0, types_1.validateLocationId)(req, res)) {
            return;
        }
        const orgId = req.user.orgId;
        const locationId = parseInt(req.params.locationId);
        try {
            const location = await location_1.default.getLocation(locationId, orgId);
            res.status(200).json({ location });
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
        (0, types_1.handleControllerError)(res, error, 'Failed to get location');
    }
};
exports.getLocation = getLocation;
exports.default = exports.getLocation;
//# sourceMappingURL=get-location.js.map