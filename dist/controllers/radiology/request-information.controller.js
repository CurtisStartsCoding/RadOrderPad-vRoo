"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestInformation = requestInformation;
const radiology_1 = __importDefault(require("../../services/order/radiology"));
const enhanced_logger_1 = __importDefault(require("../../utils/enhanced-logger"));
/**
 * Request additional information from referring group
 * @route POST /api/radiology/orders/:orderId/request-info
 */
async function requestInformation(req, res) {
    try {
        enhanced_logger_1.default.info('Request information endpoint called', {
            orderId: req.params.orderId,
            userId: req.user?.userId,
            orgId: req.user?.orgId
        });
        // Validate orderId parameter
        const orderId = parseInt(req.params.orderId);
        if (isNaN(orderId) || orderId <= 0) {
            enhanced_logger_1.default.warn('Invalid order ID provided', { orderId: req.params.orderId });
            res.status(400).json({
                success: false,
                message: 'Invalid order ID. Must be a positive number.'
            });
            return;
        }
        // Validate request body
        const { requestedInfoType, requestedInfoDetails } = req.body;
        if (!requestedInfoType) {
            enhanced_logger_1.default.warn('Missing requestedInfoType in request body');
            res.status(400).json({
                success: false,
                message: 'requestedInfoType is required'
            });
            return;
        }
        if (!requestedInfoDetails) {
            enhanced_logger_1.default.warn('Missing requestedInfoDetails in request body');
            res.status(400).json({
                success: false,
                message: 'requestedInfoDetails is required'
            });
            return;
        }
        if (typeof requestedInfoType !== 'string' || typeof requestedInfoDetails !== 'string') {
            enhanced_logger_1.default.warn('Invalid data types in request body', {
                requestedInfoTypeType: typeof requestedInfoType,
                requestedInfoDetailsType: typeof requestedInfoDetails
            });
            res.status(400).json({
                success: false,
                message: 'requestedInfoType and requestedInfoDetails must be strings'
            });
            return;
        }
        // Get user information from the JWT token
        const userId = req.user?.userId;
        const orgId = req.user?.orgId;
        if (!userId || !orgId) {
            enhanced_logger_1.default.warn('Missing user authentication', { userId, orgId });
            res.status(401).json({
                success: false,
                message: 'User authentication required'
            });
            return;
        }
        // Call the service to request information
        enhanced_logger_1.default.info('Calling requestInformation service', {
            orderId,
            requestedInfoType,
            userId,
            orgId
        });
        const result = await radiology_1.default.requestInformation(orderId, requestedInfoType, requestedInfoDetails, userId, orgId);
        enhanced_logger_1.default.info('Information request created successfully', {
            orderId,
            requestId: result.requestId
        });
        res.status(200).json(result);
    }
    catch (error) {
        // Detailed error logging
        if (error instanceof Error) {
            enhanced_logger_1.default.error('Error in requestInformation controller:', {
                error: error.message,
                stack: error.stack,
                orderId: req.params.orderId,
                userId: req.user?.userId,
                orgId: req.user?.orgId,
                requestedInfoType: req.body?.requestedInfoType
            });
            // Return appropriate HTTP status based on error message
            if (error.message.includes('not found')) {
                res.status(404).json({
                    success: false,
                    message: error.message
                });
            }
            else if (error.message.includes('Unauthorized')) {
                res.status(403).json({
                    success: false,
                    message: error.message
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    message: error.message
                });
            }
        }
        else {
            enhanced_logger_1.default.error('Unknown error in requestInformation controller:', {
                error,
                orderId: req.params.orderId,
                userId: req.user?.userId,
                orgId: req.user?.orgId
            });
            res.status(500).json({
                success: false,
                message: 'An unexpected error occurred'
            });
        }
    }
}
exports.default = requestInformation;
//# sourceMappingURL=request-information.controller.js.map