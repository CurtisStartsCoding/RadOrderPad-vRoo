import { User, UserResponse } from '../types';

/**
 * Format a user object into a user response object
 */
export function formatUserResponse(user: User): UserResponse {
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