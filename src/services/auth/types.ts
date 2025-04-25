import {
  User,
  UserRegistrationDTO,
  UserLoginDTO,
  UserResponse
} from '../../models/User';

import {
  Organization,
  OrganizationRegistrationDTO,
  OrganizationStatus
} from '../../models/Organization';

import {
  AuthTokenPayload,
  LoginResponse,
  RegistrationResponse
} from '../../models/Auth';

export {
  User,
  UserRegistrationDTO,
  UserLoginDTO,
  Organization,
  OrganizationRegistrationDTO,
  OrganizationStatus,
  AuthTokenPayload,
  LoginResponse,
  RegistrationResponse,
  UserResponse
};

export interface DatabaseClient {
  query: (text: string, params?: (string | number | boolean | null)[] | undefined) => Promise<{
    rows: Record<string, unknown>[];
    rowCount: number;
  }>;
  release: () => void;
}