export interface User {
  id: number;
  organization_id: number;
  primary_location_id?: number;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  npi?: string;
  signature_url?: string;
  is_active: boolean;
  last_login?: Date;
  created_at: Date;
  updated_at: Date;
  email_verified: boolean;
  specialty?: string;
  invitation_token?: string;
  invitation_sent_at?: Date;
  invitation_accepted_at?: Date;
  phone_number?: string;
}

export enum UserRole {
  ADMIN_REFERRING = 'admin_referring',
  ADMIN_RADIOLOGY = 'admin_radiology',
  PHYSICIAN = 'physician',
  ADMIN_STAFF = 'admin_staff',
  RADIOLOGIST = 'radiologist',
  SCHEDULER = 'scheduler',
  SUPER_ADMIN = 'super_admin'
}

export interface UserRegistrationDTO {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role?: UserRole; // Optional when registering organization (auto-assigned)
  organization_id?: number; // Optional if creating a new organization
  npi?: string;
  specialty?: string;
  phone_number?: string;
}

export interface UserLoginDTO {
  email: string;
  password: string;
}

export interface UserResponse {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  organization_id: number;
  npi?: string;
  specialty?: string;
  is_active: boolean;
  email_verified: boolean;
  created_at: Date;
  updated_at: Date;
}