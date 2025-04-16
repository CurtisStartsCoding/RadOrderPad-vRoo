"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatUserResponse = formatUserResponse;
/**
 * Format a user object into a user response object
 */
function formatUserResponse(user) {
    return {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        organization_id: user.organization_id,
        npi: user.npi,
        specialty: user.specialty,
        is_active: user.is_active,
        email_verified: user.email_verified,
        created_at: user.created_at,
        updated_at: user.updated_at
    };
}
//# sourceMappingURL=format-user-response.js.map