"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestInformation = requestInformation;
const db_1 = require("../../../config/db");
const enhanced_logger_1 = __importDefault(require("../../../utils/enhanced-logger"));
/**
 * Request additional information from referring group
 * @param orderId Order ID
 * @param requestedInfoType Type of information requested
 * @param requestedInfoDetails Details of the request
 * @param userId User ID
 * @param orgId Radiology organization ID
 * @returns Promise with result
 */
async function requestInformation(orderId, requestedInfoType, requestedInfoDetails, userId, orgId) {
    try {
        // 1. Verify order exists and belongs to the radiology group
        enhanced_logger_1.default.info('Verifying order and authorization', { orderId, orgId });
        const orderResult = await (0, db_1.queryPhiDb)(`SELECT
         id,
         referring_organization_id,
         radiology_organization_id
       FROM orders
       WHERE id = $1`, [orderId]);
        if (orderResult.rows.length === 0) {
            enhanced_logger_1.default.warn(`Order ${orderId} not found`);
            throw new Error(`Order ${orderId} not found`);
        }
        const order = orderResult.rows[0];
        if (order.radiology_organization_id !== orgId) {
            enhanced_logger_1.default.warn(`Unauthorized: Order ${orderId} does not belong to organization ${orgId}`);
            throw new Error(`Unauthorized: Order ${orderId} does not belong to your organization`);
        }
        // 2. Create information request
        enhanced_logger_1.default.info('Creating information request', {
            orderId,
            requestedInfoType,
            targetOrgId: order.referring_organization_id
        });
        const result = await (0, db_1.queryPhiDb)(`INSERT INTO information_requests
       (order_id, requested_by_user_id, requesting_organization_id, target_organization_id,
        requested_info_type, requested_info_details, status, requested_at, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW(), NOW())
       RETURNING id`, [
            orderId,
            userId,
            orgId,
            order.referring_organization_id,
            requestedInfoType,
            requestedInfoDetails,
            'pending'
        ]);
        const requestId = result.rows[0].id;
        // 3. Log the event in order_history
        enhanced_logger_1.default.info('Logging event in order history', { orderId, userId, eventType: 'information_requested' });
        await (0, db_1.queryPhiDb)(`INSERT INTO order_history
       (order_id, user_id, event_type, details, created_at)
       VALUES ($1, $2, $3, $4, NOW())`, [
            orderId,
            userId,
            'information_requested',
            `Requested: ${requestedInfoType}`
        ]);
        // TODO: Implement notification to referring group (future enhancement)
        return {
            success: true,
            orderId,
            requestId,
            message: 'Information request created successfully'
        };
    }
    catch (error) {
        // Log detailed error information
        if (error instanceof Error) {
            enhanced_logger_1.default.error('Error in requestInformation service:', {
                error: error.message,
                stack: error.stack,
                orderId,
                requestedInfoType,
                userId,
                orgId
            });
        }
        else {
            enhanced_logger_1.default.error('Unknown error in requestInformation service:', {
                error,
                orderId,
                requestedInfoType,
                userId,
                orgId
            });
        }
        throw error;
    }
}
exports.default = requestInformation;
//# sourceMappingURL=information-request.service.js.map