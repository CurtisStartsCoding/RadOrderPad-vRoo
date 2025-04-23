import { UserResponse } from './User';
import { Organization } from './Organization';

export interface AuthTokenPayload {
  userId: number;
  orgId: number;
  role: string;
  email: string;
}

export interface LoginResponse {
  token: string;
  user: UserResponse;
}

export interface RegistrationResponse {
  token: string;
  user: UserResponse;
  organization: Organization;
  message?: string; // Optional message field for additional information
}

export interface RefreshToken {
  id: number;
  user_id: number;
  token: string;
  token_id: string;
  expires_at: Date;
  issued_at: Date;
  is_revoked: boolean;
  ip_address?: string;
  user_agent?: string;
  created_at: Date;
}

export interface PasswordResetToken {
  id: number;
  user_id: number;
  token: string;
  expires_at: Date;
  used: boolean;
  created_at: Date;
}

export interface EmailVerificationToken {
  id: number;
  user_id: number;
  token: string;
  expires_at: Date;
  used: boolean;
  created_at: Date;
}

export interface UserInvitation {
  id: number;
  organization_id: number;
  invited_by_user_id?: number;
  email: string;
  role: string;
  token: string;
  expires_at: Date;
  status: string;
  created_at: Date;
  updated_at: Date;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirmation {
  token: string;
  newPassword: string;
}

export interface EmailVerificationRequest {
  token: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}