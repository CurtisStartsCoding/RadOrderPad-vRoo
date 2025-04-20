import { queryPhiDb } from '../../../config/db';
/**
 * Request additional information from referring group
 * @param orderId Order ID
 * @param requestedInfoType Type of information requested
 * @param requestedInfoDetails Details of the request
 * @param userId User ID
 * @param orgId Radiology organization ID
 * @returns Promise with result
 */
export async function requestInformation(orderId, requestedInfoType, requestedInfoDetails, userId, orgId) {
    try {
        // 1. Verify order exists and belongs to the radiology group
        const orderResult = await queryPhiDb(`SELECT o.id, o.referring_organization_id, o.radiology_organization_id
       FROM orders o
       WHERE o.id = $1`, [orderId]);
        if (orderResult.rows.length === 0) {
            throw new Error(`Order ${orderId} not found`);
        }
        const order = orderResult.rows[0];
        if (order.radiology_organization_id !== orgId) {
            throw new Error(`Unauthorized: Order ${orderId} does not belong to your organization`);
        }
        // 2. Create information request
        const result = await queryPhiDb(`INSERT INTO information_requests
       (order_id, requested_by_user_id, requesting_organization_id, target_organization_id,
        requested_info_type, requested_info_details, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
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
        await queryPhiDb(`INSERT INTO order_history
       (order_id, user_id, event_type, details, created_at)
       VALUES ($1, $2, $3, $4, NOW())`, [
            orderId,
            userId,
            'information_requested',
            `Requested information: ${requestedInfoType}`
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
        console.error('Error in requestInformation:', error);
        throw error;
    }
}
export default requestInformation;
//# sourceMappingURL=information-request.service.js.map