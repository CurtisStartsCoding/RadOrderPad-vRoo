import { Request, Response } from 'express';
/**
 * Controller for handling user login
 */
export declare class LoginController {
    /**
     * Login a user
     */
    login(req: Request, res: Response): Promise<void>;
}
declare const _default: LoginController;
export default _default;
