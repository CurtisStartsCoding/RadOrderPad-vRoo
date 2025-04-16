import { Request, Response } from 'express';
/**
 * Controller for handling organization and user registration
 */
export declare class RegisterController {
    /**
     * Register a new organization and admin user
     */
    register(req: Request, res: Response): Promise<void>;
}
declare const _default: RegisterController;
export default _default;
