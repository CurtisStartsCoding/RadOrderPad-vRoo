"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDraftOrder = createDraftOrder;
/**
 * Functions for creating and managing draft orders
 */
const db_1 = require("../../../config/db");
const models_1 = require("../../../models");
/**
 * Create a new draft order
 *
 * @param dictationText - The original dictation text
 * @param userId - The ID of the user creating the order
 * @param patientInfo - Information about the patient
 * @param radiologyOrganizationId - Optional ID of the radiology organization
 * @returns The ID of the created order
 */
async function createDraftOrder(dictationText, userId, patientInfo, radiologyOrganizationId) {
    // Get user information to determine organization
    const userResult = await (0, db_1.queryMainDb)('SELECT organization_id FROM users WHERE id = $1', [userId]);
    if (userResult.rows.length === 0) {
        throw new Error('User not found');
    }
    const user = userResult.rows[0];
    // Extract patient ID from patientInfo
    const patientId = patientInfo?.id;
    if (!patientId) {
        throw new Error('Patient ID is required');
    }
    // Use default radiology organization ID if not provided
    const radOrgId = radiologyOrganizationId || 1; // Default to 1 if not provided
    // Create a new order in the PHI database
    const orderResult = await (0, db_1.queryPhiDb)(`INSERT INTO orders
    (order_number, referring_organization_id, radiology_organization_id,
    created_by_user_id, status, priority, original_dictation, patient_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING id`, [
        `ORD-${Date.now()}`, // Generate a temporary order number
        user.organization_id, // Referring organization
        radOrgId, // Radiology organization
        userId, // Created by user
        models_1.OrderStatus.PENDING_VALIDATION, // Status
        models_1.OrderPriority.ROUTINE, // Priority
        dictationText, // Original dictation
        patientId // Patient ID
    ]);
    const orderId = orderResult.rows[0].id;
    // Create order history entry
    await (0, db_1.queryPhiDb)(`INSERT INTO order_history 
    (order_id, user_id, event_type, new_status, created_at) 
    VALUES ($1, $2, $3, $4, NOW())`, [
        orderId,
        userId,
        'created',
        models_1.OrderStatus.PENDING_VALIDATION
    ]);
    return orderId;
}
//# sourceMappingURL=draft-order.js.map