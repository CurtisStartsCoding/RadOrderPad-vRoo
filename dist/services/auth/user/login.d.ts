import { UserLoginDTO, LoginResponse } from '../types';
/**
 * Login a user
 */
export declare function login(loginData: UserLoginDTO): Promise<LoginResponse>;
