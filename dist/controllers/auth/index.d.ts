/**
 * Re-export all authentication controller components
 */
export * from './error-handler';
export * from './register.controller';
export * from './login.controller';
/**
 * Combined AuthController class
 */
export declare class AuthController {
    /**
     * Register a new organization and admin user
     */
    register: (req: import("express").Request, res: import("express").Response) => Promise<void>;
    /**
     * Login a user
     */
    login: (req: import("express").Request, res: import("express").Response) => Promise<void>;
}
declare const _default: AuthController;
export default _default;
